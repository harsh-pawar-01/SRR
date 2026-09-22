const express = require('express');
const router = express.Router();
const { 
    getFees, 
    createFee, 
    updatePayment, 
    createRazorpayOrder, 
    verifyRazorpayPayment 
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFees)
    .post(protect, authorize('admin', 'reception'), createFee);

router.route('/:id/pay')
    .put(protect, authorize('admin', 'reception'), updatePayment);

// Razorpay Online Payment Routes
router.post('/:id/create-order', protect, createRazorpayOrder);
router.post('/:id/verify-payment', protect, verifyRazorpayPayment);

module.exports = router;