/**
 * syllabusRoutes.js
 * Syllabus tracking routing.
 */

const express = require('express');
const router = express.Router();
const {
    getSyllabus,
    addChapter,
    deleteChapter,
    addChapterSchema,
} = require('../controllers/syllabusController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// Public or Authenticated reading
router.get('/:classGrade', getSyllabus);

// Protected routes for chapter modification
router.post('/', protect, authorize('admin', 'teacher'), validate(addChapterSchema), addChapter);
router.delete('/:id', protect, authorize('admin', 'teacher'), deleteChapter);

module.exports = router;
