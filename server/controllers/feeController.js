const Fee = require('../models/Fee');
const User = require('../models/User');

// @desc    Get all fees (Admin/Reception see all, Student sees their own)
// @route   GET /api/fees
// @access  Private
exports.getFees = async (req, res) => {
    try {
        let query;
        
        // If user is a student, only return their specific fee record
        if (req.user.role === 'student') {
            query = Fee.find({ student: req.user._id }).populate('student', 'name email phone');
        } else {
            // Admin, Teacher, and Reception can see all fee records
            query = Fee.find().populate('student', 'name email phone');
        }

        const fees = await query;
        res.status(200).json({ success: true, count: fees.length, data: fees });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Assign a fee to a student
// @route   POST /api/fees
// @access  Private (Admin, Reception)
exports.createFee = async (req, res) => {
    try {
        const { studentId, totalAmount, dueDate } = req.body;

        // Verify student exists
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ success: false, message: 'Student not found or invalid role' });
        }

        const fee = await Fee.create({
            student: studentId,
            totalAmount,
            dueDate,
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: fee });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Record a fee payment
// @route   PUT /api/fees/:id/pay
// @access  Private (Admin, Reception)
exports.updatePayment = async (req, res) => {
    try {
        const { amount, razorpayPaymentId } = req.body;
        const feeRecord = await Fee.findById(req.params.id);

        if (!feeRecord) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }

        feeRecord.paidAmount += Number(amount);
        
        // Push payment history entry
        feeRecord.paymentHistory.push({
            razorpayPaymentId: razorpayPaymentId || 'CASH_OR_MANUAL',
            amount: Number(amount)
        });

        // Update status based on paid vs total amount
        if (feeRecord.paidAmount >= feeRecord.totalAmount) {
            feeRecord.status = 'Paid';
        } else if (feeRecord.paidAmount > 0) {
            feeRecord.status = 'Partial';
        }

        await feeRecord.save();

        res.status(200).json({ success: true, data: feeRecord });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// @desc    Create Razorpay Order for Fee Payment
// @route   POST /api/fees/:id/create-order
// @access  Private (Student / Admin / Reception)
exports.createRazorpayOrder = async (req, res) => {
    try {
        const feeRecord = await Fee.findById(req.params.id);
        if (!feeRecord) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }

        const { amountToPay } = req.body; // Amount in INR

        const options = {
            amount: Number(amountToPay) * 100, // Razorpay expects amount in paise (e.g., ₹500 = 50000 paise)
            currency: 'INR',
            receipt: `receipt_fee_${feeRecord._id}`
        };

        const order = await razorpayInstance.orders.create(options);
        
        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            feeId: feeRecord._id
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Verify Razorpay Payment Signature & Update Fee Record
// @route   POST /api/fees/:id/verify-payment
// @access  Private
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amountPaid } = req.body;
        const feeRecord = await Fee.findById(req.params.id);

        if (!feeRecord) {
            return res.status(404).json({ success: false, message: 'Fee record not found' });
        }

        // Verify cryptographic signature from Razorpay
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: 'Payment verification failed: Invalid signature' });
        }

        // Update fee record status and history
        feeRecord.paidAmount += Number(amountPaid);
        feeRecord.paymentHistory.push({
            razorpayPaymentId: razorpay_payment_id,
            amount: Number(amountPaid)
        });

        if (feeRecord.paidAmount >= feeRecord.totalAmount) {
            feeRecord.status = 'Paid';
        } else if (feeRecord.paidAmount > 0) {
            feeRecord.status = 'Partial';
        }

        await feeRecord.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully and fee updated',
            data: feeRecord
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};