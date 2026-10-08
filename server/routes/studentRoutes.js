/**
 * studentRoutes.js
 * Student management routing.
 */

const express = require('express');
const router = express.Router();
const {
    admitStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    swap11to12,
    bulkArchive12th,
    admitStudentSchema,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// All student routes require authentication
router.use(protect);

// Admission (Admin / Reception)
router.post('/admit', authorize('admin', 'reception'), validate(admitStudentSchema), admitStudent);

// Promotion 11th -> 12th (Admin / Reception)
router.post('/swap-11-to-12', authorize('admin', 'reception'), swap11to12);

// Bulk archive 12th passed batch (Admin / Reception)
router.post('/bulk-archive-12th', authorize('admin', 'reception'), bulkArchive12th);

// List all students (Admin / Reception / Teacher)
router.get('/', authorize('admin', 'reception', 'teacher'), getStudents);

// Get student details (Admin, Reception, Teacher, or Student for self)
router.get('/:id', getStudentById);

// Update student (Admin / Reception)
router.patch('/:id', authorize('admin', 'reception'), updateStudent);

// Delete student (Admin / Reception)
router.delete('/:id', authorize('admin', 'reception'), deleteStudent);

module.exports = router;
