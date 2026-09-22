const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: [true, 'Please specify total fee amount']
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Partial', 'Paid'],
        default: 'Pending'
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentHistory: [
        {
            razorpayPaymentId: String,
            amount: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('Fee', feeSchema);