/**
 * attendanceController.js
 * Daily attendance marking, batch upsert per (student, date), and history queries.
 */

const { z } = require('zod');
const supabase = require('../config/supabase');

// Validation schema for saving attendance
exports.saveAttendanceSchema = z.object({
    body: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
        attendanceList: z.array(
            z.object({
                studentId: z.string().uuid('Valid student ID is required'),
                status: z.enum(['Present', 'Absent'], {
                    errorMap: () => ({ message: "Status must be 'Present' or 'Absent'" }),
                }),
            })
        ).min(1, 'At least one student attendance record is required'),
    }),
});

/**
 * @desc    Save/Upsert daily attendance in bulk (Admin, Reception)
 * @route   POST /api/attendance
 * @access  Private (Admin, Reception)
 */
exports.saveAttendance = async (req, res, next) => {
    try {
        const { date, attendanceList } = req.body;

        const records = attendanceList.map((item) => ({
            student_id: item.studentId,
            date,
            status: item.status,
        }));

        // Upsert on unique constraint (student_id, date)
        const { data: upserted, error } = await supabase
            .from('attendance')
            .upsert(records, { onConflict: 'student_id, date' })
            .select('*');

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            message: `Attendance marked successfully for ${upserted.length} student(s) on ${date}`,
            data: upserted,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get attendance records (Student reads own; Staff can filter by date/student)
 * @route   GET /api/attendance
 * @access  Private
 */
exports.getAttendance = async (req, res, next) => {
    try {
        const { date, student_id } = req.query;

        let query = supabase
            .from('attendance')
            .select(`
                id,
                student_id,
                date,
                status,
                students (
                    id,
                    class_grade,
                    users (name, username)
                )
            `)
            .order('date', { ascending: false });

        // Enforce ownership: student can only view their own attendance
        if (req.user.role === 'student') {
            if (!req.user.studentId) {
                return res.status(404).json({ success: false, message: 'Student profile not linked to user account' });
            }
            query = query.eq('student_id', req.user.studentId);
        } else {
            if (student_id) query = query.eq('student_id', student_id);
            if (date) query = query.eq('date', date);
        }

        const { data: records, error } = await query;

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (err) {
        next(err);
    }
};
