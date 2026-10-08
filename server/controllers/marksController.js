/**
 * marksController.js
 * Test marks entry, subject-level security, and performance records.
 */

const { z } = require('zod');
const supabase = require('../config/supabase');

// Validation schema for marks entry
exports.marksEntrySchema = z.object({
    body: z.object({
        testName: z.string().min(2, 'Test name is required').trim(),
        subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Biology'], {
            errorMap: () => ({ message: 'Subject must be Physics, Chemistry, Mathematics, or Biology' }),
        }),
        totalMarks: z.coerce.number().positive('Total marks must be greater than 0'),
        date: z.string().optional(),
        // Either batch entries or single student
        studentId: z.string().uuid().optional(),
        marksObtained: z.coerce.number().min(0).optional(),
        entries: z.array(
            z.object({
                studentId: z.string().uuid(),
                marksObtained: z.coerce.number().min(0),
            })
        ).optional(),
    }).refine((data) => {
        // Must provide either single studentId or entries array
        return (data.studentId !== undefined && data.marksObtained !== undefined) || (Array.isArray(data.entries) && data.entries.length > 0);
    }, {
        message: 'Must provide either studentId with marksObtained, or an entries array',
    }),
});

/**
 * @desc    Record test marks (Reception, Admin, or Teacher for own subject)
 * @route   POST /api/marks
 * @access  Private (Admin, Reception, Teacher)
 */
exports.addMarks = async (req, res, next) => {
    try {
        const { testName, subject, totalMarks, date, studentId, marksObtained, entries } = req.body;

        // Subject enforcement: teachers can only record marks for their own subject!
        if (req.user.role === 'teacher') {
            if (req.user.subject !== subject) {
                return res.status(403).json({
                    success: false,
                    message: `Teachers are only permitted to enter marks for their assigned subject (${req.user.subject})`,
                });
            }
        }

        const markDate = date || new Date().toISOString().split('T')[0];
        const rowsToInsert = [];

        if (Array.isArray(entries) && entries.length > 0) {
            for (const entry of entries) {
                if (entry.marksObtained > totalMarks) {
                    return res.status(400).json({
                        success: false,
                        message: `Marks obtained (${entry.marksObtained}) cannot exceed total marks (${totalMarks})`,
                    });
                }
                rowsToInsert.push({
                    student_id: entry.studentId,
                    test_name: testName.trim(),
                    subject,
                    marks_obtained: entry.marksObtained,
                    total_marks: totalMarks,
                    date: markDate,
                });
            }
        } else if (studentId !== undefined && marksObtained !== undefined) {
            if (marksObtained > totalMarks) {
                return res.status(400).json({
                    success: false,
                    message: `Marks obtained (${marksObtained}) cannot exceed total marks (${totalMarks})`,
                });
            }
            rowsToInsert.push({
                student_id: studentId,
                test_name: testName.trim(),
                subject,
                marks_obtained: marksObtained,
                total_marks: totalMarks,
                date: markDate,
            });
        }

        const { data: inserted, error } = await supabase
            .from('marks')
            .insert(rowsToInsert)
            .select('*');

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(201).json({
            success: true,
            message: `Recorded marks for ${inserted.length} student(s) successfully`,
            data: inserted,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get marks records (Student reads own; Staff can filter by student/subject)
 * @route   GET /api/marks
 * @access  Private
 */
exports.getMarks = async (req, res, next) => {
    try {
        const { student_id, subject } = req.query;

        let query = supabase
            .from('marks')
            .select(`
                id,
                student_id,
                test_name,
                subject,
                marks_obtained,
                total_marks,
                date,
                students (
                    id,
                    class_grade,
                    users (name, username)
                )
            `)
            .order('date', { ascending: false });

        // Ownership enforcement for student role
        if (req.user.role === 'student') {
            if (!req.user.studentId) {
                return res.status(404).json({ success: false, message: 'Student profile not linked to user account' });
            }
            query = query.eq('student_id', req.user.studentId);
        } else {
            if (student_id) query = query.eq('student_id', student_id);
            if (subject) query = query.eq('subject', subject);
        }

        const { data: marks, error } = await query;

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            count: marks.length,
            data: marks,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Delete a mark entry (Admin, Reception, Teacher for own subject)
 * @route   DELETE /api/marks/:id
 * @access  Private (Admin, Reception, Teacher)
 */
exports.deleteMark = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fetch mark to check subject if user is a teacher
        const { data: mark } = await supabase
            .from('marks')
            .select('id, subject')
            .eq('id', id)
            .maybeSingle();

        if (!mark) {
            return res.status(404).json({ success: false, message: 'Mark entry not found' });
        }

        if (req.user.role === 'teacher' && req.user.subject !== mark.subject) {
            return res.status(403).json({
                success: false,
                message: `Teacher can only delete marks for their assigned subject (${req.user.subject})`,
            });
        }

        const { error } = await supabase.from('marks').delete().eq('id', id);

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Mark entry deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};
