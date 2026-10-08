/**
 * feeController.js
 * Fee structures, race-safe atomic payments, and Razorpay integration.
 */

const crypto = require('crypto');
const Razorpay = require('razorpay');
const { z } = require('zod');
const supabase = require('../config/supabase');

// Initialize Razorpay client lazily from environment variables
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return null;
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// Validation schemas
exports.createFeeSchema = z.object({
    body: z.object({
        studentId: z.string().uuid('Valid student ID is required'),
        totalAmount: z.coerce.number().positive('Total amount must be greater than 0'),
        dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be formatted as YYYY-MM-DD'),
    }),
});

exports.manualPaymentSchema = z.object({
    body: z.object({
        amount: z.coerce.number().positive('Payment amount must be greater than 0'),
        method: z.enum(['CASH', 'MANUAL', 'CHEQUE', 'UPI']).default('CASH'),
    }),
});

exports.createOrderSchema = z.object({
    body: z.object({
        amountToPay: z.coerce.number().positive('Amount to pay must be greater than 0'),
    }),
});

exports.verifyPaymentSchema = z.object({
    body: z.object({
        razorpay_order_id: z.string().min(1, 'razorpay_order_id is required'),
        razorpay_payment_id: z.string().min(1, 'razorpay_payment_id is required'),
        razorpay_signature: z.string().min(1, 'razorpay_signature is required'),
    }),
});

/**
 * @desc    Get fee records (Student sees own; Admin/Reception sees all)
 * @route   GET /api/fees
 * @access  Private
 */
exports.getFees = async (req, res, next) => {
    try {
        const { student_id, status } = req.query;

        let query = supabase
            .from('fees')
            .select(`
                id,
                student_id,
                total_amount,
                paid_amount,
                status,
                due_date,
                created_at,
                students (
                    id,
                    mobile_no,
                    class_grade,
                    users (name, username, phone, email)
                ),
                fee_payments (
                    id,
                    amount,
                    method,
                    razorpay_payment_id,
                    paid_at
                )
            `)
            .order('created_at', { ascending: false });

        // Enforce ownership: student sees ONLY their own fee record
        if (req.user.role === 'student') {
            if (!req.user.studentId) {
                return res.status(404).json({ success: false, message: 'Student profile not linked to user account' });
            }
            query = query.eq('student_id', req.user.studentId);
        } else {
            if (student_id) query = query.eq('student_id', student_id);
            if (status) query = query.eq('status', status);
        }

        const { data: fees, error } = await query;

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            count: fees.length,
            data: fees,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Create/assign fee ledger to a student (Admin, Reception)
 * @route   POST /api/fees
 * @access  Private (Admin, Reception)
 */
exports.createFee = async (req, res, next) => {
    try {
        const { studentId, totalAmount, dueDate } = req.body;

        // Verify student exists
        const { data: student } = await supabase
            .from('students')
            .select('id')
            .eq('id', studentId)
            .maybeSingle();

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const { data: fee, error } = await supabase
            .from('fees')
            .insert({
                student_id: studentId,
                total_amount: totalAmount,
                paid_amount: 0.00,
                status: 'Pending',
                due_date: dueDate,
            })
            .select('*')
            .single();

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(201).json({
            success: true,
            message: 'Fee ledger initialized successfully',
            data: fee,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Record manual/cash installment payment atomically (Admin, Reception)
 * @route   POST /api/fees/:id/pay
 * @access  Private (Admin, Reception)
 */
exports.updatePayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount, method } = req.body;

        // Fetch fee record to verify remaining balance
        const { data: fee, error: feeErr } = await supabase
            .from('fees')
            .select('id, total_amount, paid_amount')
            .eq('id', id)
            .maybeSingle();

        if (feeErr || !fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }

        const remainingBalance = Number(fee.total_amount) - Number(fee.paid_amount);
        if (Number(amount) > remainingBalance) {
            return res.status(400).json({
                success: false,
                message: `Payment amount ₹${amount} exceeds remaining balance of ₹${remainingBalance}`,
            });
        }

        // Atomic update via stored function
        const { data, error } = await supabase.rpc('record_fee_payment', {
            p_fee_id: id,
            p_amount: Number(amount),
            p_method: method || 'CASH',
            p_razorpay_payment_id: null,
            p_razorpay_order_id: null,
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Payment update failed',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Payment recorded successfully',
            data: data.fee,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Create Razorpay Order for online fee payment
 * @route   POST /api/fees/:id/create-order
 * @access  Private (Student for own fee, Admin, Reception)
 */
exports.createRazorpayOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amountToPay } = req.body;

        const { data: fee, error: feeErr } = await supabase
            .from('fees')
            .select('id, student_id, total_amount, paid_amount')
            .eq('id', id)
            .maybeSingle();

        if (feeErr || !fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }

        // Ownership enforcement: student can only pay their own fee
        if (req.user.role === 'student' && fee.student_id !== req.user.studentId) {
            return res.status(403).json({ success: false, message: 'Unauthorized fee payment attempt' });
        }

        const remainingBalance = Number(fee.total_amount) - Number(fee.paid_amount);
        if (Number(amountToPay) > remainingBalance) {
            return res.status(400).json({
                success: false,
                message: `Payment amount ₹${amountToPay} exceeds remaining balance of ₹${remainingBalance}`,
            });
        }

        const razorpay = getRazorpayInstance();
        if (!razorpay) {
            return res.status(500).json({
                success: false,
                message: 'Razorpay payment gateway is not configured on the server',
            });
        }

        // Create order in Razorpay (amount in integer paise)
        const options = {
            amount: Math.round(Number(amountToPay) * 100),
            currency: 'INR',
            receipt: `fee_${fee.id.substring(0, 8)}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
                feeId: fee.id,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Verify Razorpay payment signature & update fee atomically
 * @route   POST /api/fees/:id/verify-payment
 * @access  Private (Student, Admin, Reception)
 */
exports.verifyRazorpayPayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const { data: fee, error: feeErr } = await supabase
            .from('fees')
            .select('id, student_id, total_amount, paid_amount')
            .eq('id', id)
            .maybeSingle();

        if (feeErr || !fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }

        // Ownership enforcement for student
        if (req.user.role === 'student' && fee.student_id !== req.user.studentId) {
            return res.status(403).json({ success: false, message: 'Unauthorized fee verification attempt' });
        }

        // Step 1: Verify cryptographic signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: 'Razorpay secret is not configured' });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: Invalid cryptographic signature',
            });
        }

        // Step 2: Fetch real payment amount from Razorpay (NEVER trust client-sent amount)
        const razorpay = getRazorpayInstance();
        if (!razorpay) {
            return res.status(500).json({ success: false, message: 'Razorpay client is not configured' });
        }

        let verifiedAmountInRupees;
        try {
            const payment = await razorpay.payments.fetch(razorpay_payment_id);
            if (payment.status !== 'captured' && payment.status !== 'authorized') {
                return res.status(400).json({
                    success: false,
                    message: `Payment is not completed (status: ${payment.status})`,
                });
            }
            verifiedAmountInRupees = Number(payment.amount) / 100;
        } catch (fetchErr) {
            return res.status(400).json({
                success: false,
                message: `Failed to fetch payment details from Razorpay: ${fetchErr.message}`,
            });
        }

        const remainingBalance = Number(fee.total_amount) - Number(fee.paid_amount);
        if (verifiedAmountInRupees > remainingBalance) {
            return res.status(400).json({
                success: false,
                message: `Payment amount ₹${verifiedAmountInRupees} exceeds remaining balance of ₹${remainingBalance}`,
            });
        }

        // Step 3: Atomic database update with idempotency & balance check
        const { data, error } = await supabase.rpc('record_fee_payment', {
            p_fee_id: id,
            p_amount: verifiedAmountInRupees,
            p_method: 'RAZORPAY',
            p_razorpay_payment_id: razorpay_payment_id,
            p_razorpay_order_id: razorpay_order_id,
        });

        // Handle unique constraint / duplicate idempotency gracefully
        if (error) {
            if (error.code === '23505' || error.message.includes('unique') || error.message.includes('already')) {
                const { data: latestFee } = await supabase
                    .from('fees')
                    .select('*, fee_payments(*)')
                    .eq('id', id)
                    .single();

                return res.status(200).json({
                    success: true,
                    message: 'Payment already processed (idempotent)',
                    data: latestFee,
                });
            }

            return res.status(400).json({
                success: false,
                message: error.message || 'Payment recording failed',
            });
        }

        return res.status(200).json({
            success: true,
            message: data.already_processed ? 'Payment already verified' : 'Payment verified and fee updated successfully',
            data: data.fee,
        });
    } catch (err) {
        next(err);
    }
};