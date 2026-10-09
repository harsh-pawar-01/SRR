/**
 * attendanceRoutes.js
 * Attendance management routing.
 */

const express = require('express');
const router = express.Router();
const {
    saveAttendance,
    getAttendance,
    saveAttendanceSchema,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

router.route('/')
    .get(getAttendance)
    .post(authorize('admin', 'reception'), validate(saveAttendanceSchema), saveAttendance);

module.exports = router;
