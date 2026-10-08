/**
 * marksRoutes.js
 * Marks management routing.
 */

const express = require('express');
const router = express.Router();
const {
    addMarks,
    getMarks,
    deleteMark,
    marksEntrySchema,
} = require('../controllers/marksController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.route('/')
    .get(getMarks)
    .post(authorize('admin', 'reception', 'teacher'), validate(marksEntrySchema), addMarks);

router.route('/:id')
    .delete(authorize('admin', 'reception', 'teacher'), deleteMark);

module.exports = router;
