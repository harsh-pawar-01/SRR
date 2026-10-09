/**
 * feeRoutes.js
 * Fee and payment routing.
 */

const express = require('express');
const router = express.Router();
const {
    getFees,
    createFee,
    updatePayment,
    createRazorpayOrder,
    verifyRazorpayPayment,
    createFeeSchema,
    manualPaymentSchema,
    createOrderSchema,
    verifyPaymentSchema,
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.route('/')
    .get(getFees)
    .post(authorize('admin', 'reception'), validate(createFeeSchema), createFee);

router.post('/:id/pay', authorize('admin', 'reception'), validate(manualPaymentSchema), updatePayment);

// Razorpay Online Payment
router.post('/:id/create-order', validate(createOrderSchema), createRazorpayOrder);
router.post('/:id/verify-payment', validate(verifyPaymentSchema), verifyRazorpayPayment);

module.exports = router;