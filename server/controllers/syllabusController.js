/**
 * syllabusController.js
 * Syllabus tracking and chapter completion by subject teachers.
 */

const { z } = require('zod');
const supabase = require('../config/supabase');

// Validation schema for adding a completed chapter
exports.addChapterSchema = z.object({
    body: z.object({
        classGrade: z.enum(['11th', '12th'], {
            errorMap: () => ({ message: "classGrade must be '11th' or '12th'" }),
        }),
        subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Biology'], {
            errorMap: () => ({ message: 'Subject must be Physics, Chemistry, Mathematics, or Biology' }),
        }),
        chapterName: z.string().min(2, 'Chapter name is required').trim(),
    }),
});

/**
 * @desc    Get completed syllabus chapters by class grade
 * @route   GET /api/syllabus/:classGrade
 * @access  Public / Authenticated
 */
exports.getSyllabus = async (req, res, next) => {
    try {
        const { classGrade } = req.params;
        const { subject } = req.query;

        if (classGrade !== '11th' && classGrade !== '12th') {
            return res.status(400).json({
                success: false,
                message: "classGrade must be '11th' or '12th'",
            });
        }

        let query = supabase
            .from('syllabus')
            .select(`
                id,
                class_grade,
                subject,
                chapter_name,
                completed_at,
                created_by,
                users (
                    name,
                    username
                )
            `)
            .eq('class_grade', classGrade)
            .order('completed_at', { ascending: true });

        if (subject) {
            query = query.eq('subject', subject);
        }

        const { data: chapters, error } = await query;

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            count: chapters.length,
            data: chapters,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Add a completed syllabus chapter (Teacher for own subject, Admin)
 * @route   POST /api/syllabus
 * @access  Private (Teacher, Admin)
 */
exports.addChapter = async (req, res, next) => {
    try {
        const { classGrade, subject, chapterName } = req.body;

        // Subject enforcement: teachers can only add chapters for their own subject!
        if (req.user.role === 'teacher' && req.user.subject !== subject) {
            return res.status(403).json({
                success: false,
                message: `Teachers are only permitted to manage chapters for their assigned subject (${req.user.subject})`,
            });
        }

        const { data: newChapter, error } = await supabase
            .from('syllabus')
            .insert({
                class_grade: classGrade,
                subject,
                chapter_name: chapterName.trim(),
                completed_at: new Date().toISOString(),
                created_by: req.user.id,
            })
            .select('*')
            .single();

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(201).json({
            success: true,
            message: `Chapter '${chapterName}' added to completed syllabus`,
            data: newChapter,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Remove completed chapter (Teacher for own subject, Admin)
 * @route   DELETE /api/syllabus/:id
 * @access  Private (Teacher, Admin)
 */
exports.deleteChapter = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fetch chapter to check subject
        const { data: chapter } = await supabase
            .from('syllabus')
            .select('id, subject')
            .eq('id', id)
            .maybeSingle();

        if (!chapter) {
            return res.status(404).json({ success: false, message: 'Chapter not found' });
        }

        if (req.user.role === 'teacher' && req.user.subject !== chapter.subject) {
            return res.status(403).json({
                success: false,
                message: `Teachers can only remove chapters for their assigned subject (${req.user.subject})`,
            });
        }

        const { error } = await supabase.from('syllabus').delete().eq('id', id);

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Chapter removed successfully from completed syllabus',
        });
    } catch (err) {
        next(err);
    }
};
