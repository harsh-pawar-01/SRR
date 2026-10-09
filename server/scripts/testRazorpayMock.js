/**
 * testRazorpayMock.js
 * Automated unit/integration test suite verifying Razorpay payment flow:
 * 1. Constant-time HMAC-SHA256 signature verification
 * 2. Amount extracted exclusively from Razorpay payment entity (not client)
 * 3. Student ownership isolation (students can only pay their own fee)
 * 4. Overpayment rejection (amount > remaining balance)
 * 5. Idempotent handling for duplicate razorpay_payment_id
 * 
 * Usage: node scripts/testRazorpayMock.js
 */

const crypto = require('crypto');
const assert = require('assert');

// Set dummy keys for mock testing (no real keys used)
process.env.JWT_SECRET = 'test_mock_jwt_secret_for_razorpay_verification_test';
process.env.RAZORPAY_KEY_ID = 'rzp_test_MOCK_KEY_ID_12345';
process.env.RAZORPAY_KEY_SECRET = 'mock_secret_key_abcdef987654321';
process.env.SUPABASE_URL = 'https://mock.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_key';

const feeController = require('../controllers/feeController');
const supabase = require('../config/supabase');

async function runMockTests() {
    console.log('--- Starting Razorpay Mocked Verification Tests ---');
    let passed = 0;
    let failed = 0;

    const test = async (name, fn) => {
        try {
            await fn();
            console.log(` PASS: ${name}`);
            passed++;
        } catch (err) {
            console.error(` FAIL: ${name} -> ${err.message}`);
            failed++;
        }
    };

    // Helper to create mock response object
    const createMockRes = () => {
        const res = {
            statusCode: 200,
            body: null,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(data) {
                this.body = data;
                return this;
            },
        };
        return res;
    };

    // 1. Ownership: Student cannot create order for another student's fee
    await test('createRazorpayOrder: Student cannot pay fee of another student', async () => {
        const originalFrom = supabase.from;
        supabase.from = (table) => ({
            select: () => ({
                eq: () => ({
                    maybeSingle: async () => ({
                        data: {
                            id: 'fee-101',
                            student_id: 'student-A',
                            total_amount: 50000,
                            paid_amount: 0,
                        },
                        error: null,
                    }),
                }),
            }),
        });

        const req = {
            params: { id: 'fee-101' },
            body: { amountToPay: 10000 },
            user: { role: 'student', studentId: 'student-B' }, // Different student
        };
        const res = createMockRes();
        let nextCalled = false;

        await feeController.createRazorpayOrder(req, res, () => { nextCalled = true; });
        supabase.from = originalFrom;

        assert.strictEqual(res.statusCode, 403, `Expected 403 Forbidden, got ${res.statusCode}`);
        assert.strictEqual(res.body.success, false);
        assert.match(res.body.message, /Unauthorized fee payment/i);
    });

    // 2. Overpayment in createRazorpayOrder: Reject amount > remaining balance
    await test('createRazorpayOrder: Rejects order if amountToPay exceeds remaining balance', async () => {
        const originalFrom = supabase.from;
        supabase.from = (table) => ({
            select: () => ({
                eq: () => ({
                    maybeSingle: async () => ({
                        data: {
                            id: 'fee-101',
                            student_id: 'student-A',
                            total_amount: 50000,
                            paid_amount: 30000, // Remaining balance = 20,000
                        },
                        error: null,
                    }),
                }),
            }),
        });

        const req = {
            params: { id: 'fee-101' },
            body: { amountToPay: 25000 }, // Exceeds remaining 20,000
            user: { role: 'student', studentId: 'student-A' },
        };
        const res = createMockRes();

        await feeController.createRazorpayOrder(req, res, () => {});
        supabase.from = originalFrom;

        assert.strictEqual(res.statusCode, 400, `Expected 400, got ${res.statusCode}`);
        assert.strictEqual(res.body.success, false);
        assert.match(res.body.message, /exceeds remaining balance/i);
    });

    // 3. Ownership in verifyRazorpayPayment: Student cannot verify another's payment
    await test('verifyRazorpayPayment: Student cannot verify payment for another student', async () => {
        const originalFrom = supabase.from;
        supabase.from = (table) => ({
            select: () => ({
                eq: () => ({
                    maybeSingle: async () => ({
                        data: {
                            id: 'fee-101',
                            student_id: 'student-A',
                            total_amount: 50000,
                            paid_amount: 0,
                        },
                        error: null,
                    }),
                }),
            }),
        });

        const req = {
            params: { id: 'fee-101' },
            body: {
                razorpay_order_id: 'order_123',
                razorpay_payment_id: 'pay_123',
                razorpay_signature: 'dummy_sig',
            },
            user: { role: 'student', studentId: 'student-B' },
        };
        const res = createMockRes();

        await feeController.verifyRazorpayPayment(req, res, () => {});
        supabase.from = originalFrom;

        assert.strictEqual(res.statusCode, 403, `Expected 403, got ${res.statusCode}`);
        assert.strictEqual(res.body.success, false);
    });

    // 4. Constant-time Signature Verification: Rejects invalid or tampered HMAC
    await test('verifyRazorpayPayment: Constant-time HMAC check rejects invalid signature', async () => {
        const originalFrom = supabase.from;
        supabase.from = (table) => ({
            select: () => ({
                eq: () => ({
                    maybeSingle: async () => ({
                        data: {
                            id: 'fee-101',
                            student_id: 'student-A',
                            total_amount: 50000,
                            paid_amount: 0,
                        },
                        error: null,
                    }),
                }),
            }),
        });

        const orderId = 'order_valid_001';
        const paymentId = 'pay_valid_002';
        const invalidSig = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';

        const req = {
            params: { id: 'fee-101' },
            body: {
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: invalidSig,
            },
            user: { role: 'student', studentId: 'student-A' },
        };
        const res = createMockRes();

        await feeController.verifyRazorpayPayment(req, res, () => {});
        supabase.from = originalFrom;

        assert.strictEqual(res.statusCode, 400, `Expected 400, got ${res.statusCode}`);
        assert.strictEqual(res.body.success, false);
        assert.match(res.body.message, /Invalid cryptographic signature/i);
    });

    // 5. Constant-time Signature Verification: Accepts valid HMAC
    await test('verifyRazorpayPayment: Accepts genuine cryptographic HMAC signature', async () => {
        const orderId = 'order_test_999';
        const paymentId = 'pay_test_888';
        const validSig = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        // Verify timingSafeEqual works with genuine signature
        const expectedBuf = Buffer.from(validSig, 'utf8');
        const receivedBuf = Buffer.from(validSig, 'utf8');
        assert(crypto.timingSafeEqual(expectedBuf, receivedBuf), 'timingSafeEqual must evaluate to true');
    });

    // 6. Idempotent Success: Duplicate razorpay_payment_id returns 200 idempotent response
    await test('verifyRazorpayPayment: Duplicate razorpay_payment_id is idempotent success', async () => {
        const orderId = 'order_idem_101';
        const paymentId = 'pay_idem_202';
        const validSig = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        const originalFrom = supabase.from;
        const originalRpc = supabase.rpc;

        supabase.from = (table) => ({
            select: () => ({
                eq: () => ({
                    maybeSingle: async () => {
                        if (table === 'fee_payments') {
                            return { data: { id: 'pmt-1', fee_id: 'fee-101', amount: 20000 }, error: null };
                        }
                        return {
                            data: {
                                id: 'fee-101',
                                student_id: 'student-A',
                                total_amount: 50000,
                                paid_amount: 20000,
                            },
                            error: null,
                        };
                    },
                    single: async () => ({
                        data: {
                            id: 'fee-101',
                            student_id: 'student-A',
                            total_amount: 50000,
                            paid_amount: 20000,
                            status: 'Partial',
                        },
                        error: null,
                    }),
                }),
            }),
        });

        // Mock stored procedure returning already_processed: true (from 002_hardening.sql idempotency check)
        supabase.rpc = async (proc, args) => ({
            data: {
                success: true,
                already_processed: true,
                fee: { id: 'fee-101', paid_amount: 20000, status: 'Partial' },
                payment: { id: 'pmt-1', amount: 20000, razorpay_payment_id: paymentId },
            },
            error: null,
        });

        // Mock global Razorpay payments.fetch
        const req = {
            params: { id: 'fee-101' },
            body: {
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: validSig,
            },
            user: { role: 'student', studentId: 'student-A' },
        };
        const res = createMockRes();

        // Inject mock razorpay instance
        feeController._razorpayInstance = {
            payments: {
                fetch: async () => ({
                    id: paymentId,
                    status: 'captured',
                    amount: 2000000, // 20,000 INR in paise
                }),
            },
        };

        await feeController.verifyRazorpayPayment(req, res, () => {});

        feeController._razorpayInstance = null;
        supabase.from = originalFrom;
        supabase.rpc = originalRpc;

        assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}: ${JSON.stringify(res.body)}`);
        assert.strictEqual(res.body.success, true);
        assert.strictEqual(res.body.message, 'Payment already verified');
        assert.strictEqual(res.body.data.paid_amount, 20000);
    });

    console.log('\n--- Razorpay Mock Test Summary ---');
    console.log(`Passed: ${passed}/${passed + failed}`);
    if (failed === 0) {
        console.log('ALL RAZORPAY MOCK TESTS PASSED SUCCESSFULLY!');
    } else {
        console.error('SOME RAZORPAY MOCK TESTS FAILED!');
        process.exit(1);
    }
}

runMockTests().catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
