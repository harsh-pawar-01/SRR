/**
 * consultationRoutes.js
 * Consultation inquiry routing.
 */

const express = require('express');
const router = express.Router();
const {
    createConsultation,
    getConsultations,
    updateConsultationStatus,
    createConsultationSchema,
    updateStatusSchema,
} = require('../controllers/consultationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// Public route: Submit inquiry (rate-limited via server.js limiter)
router.post('/', validate(createConsultationSchema), createConsultation);

// Protected routes: Front desk review
router.get('/', protect, authorize('admin', 'reception'), getConsultations);
router.patch('/:id', protect, authorize('admin', 'reception'), validate(updateStatusSchema), updateConsultationStatus);

module.exports = router;
