/**
 * studentController.js
 * Student management, admissions, promotions, and academic record retrieval.
 */

const bcrypt = require('bcryptjs');
const { z } = require('zod');
const supabase = require('../config/supabase');

// Schema for student admission
exports.admitStudentSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Student full name is required').trim(),
        username: z.string().min(3, 'Username must be at least 3 characters').trim(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        mobileNo: z.string().min(10, 'Student mobile number is required').trim(),
        parentName: z.string().min(2, 'Parent name is required').trim(),
        parentMobNo: z.string().min(10, 'Parent mobile number is required').trim(),
        address: z.string().min(3, 'Address is required').trim(),
        collegeName: z.string().min(2, 'College name is required').trim(),
        classGrade: z.enum(['11th', '12th'], {
            errorMap: () => ({ message: "Class grade must be '11th' or '12th'" }),
        }),
        email: z.string().email().optional().nullable(),
    }),
});

/**
 * @desc    Admit a new student (Reception / Admin)
 * @route   POST /api/students/admit
 * @access  Private (Admin, Reception)
 */
exports.admitStudent = async (req, res, next) => {
    try {
        const {
            name,
            username,
            password,
            mobileNo,
            parentName,
            parentMobNo,
            address,
            collegeName,
            classGrade,
            email,
        } = req.body;

        // Check if username already taken
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('username', username.trim())
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `Username '${username}' is already in use`,
            });
        }

        // Hash student password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Step 1: Create user record
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                username: username.trim(),
                password_hash: passwordHash,
                name: name.trim(),
                role: 'student',
                phone: mobileNo.trim(),
                email: email ? email.trim() : null,
                is_active: true,
            })
            .select('id, username, name, role, phone, email')
            .single();

        if (userError) {
            return res.status(400).json({ success: false, message: userError.message });
        }

        // Step 2: Create student profile record
        const { data: student, error: studentError } = await supabase
            .from('students')
            .insert({
                user_id: user.id,
                mobile_no: mobileNo.trim(),
                parent_name: parentName.trim(),
                parent_mobile_no: parentMobNo.trim(),
                address: address.trim(),
                college_name: collegeName.trim(),
                class_grade: classGrade,
            })
            .select('*')
            .single();

        if (studentError) {
            // Rollback user creation
            await supabase.from('users').delete().eq('id', user.id);
            return res.status(400).json({ success: false, message: studentError.message });
        }

        return res.status(201).json({
            success: true,
            message: `Student '${name}' admitted successfully`,
            data: {
                ...student,
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get all students (Admin, Reception, Teacher)
 * @route   GET /api/students
 * @access  Private (Admin, Reception, Teacher)
 */
exports.getStudents = async (req, res, next) => {
    try {
        const { class_grade, search } = req.query;

        let query = supabase
            .from('students')
            .select(`
                id,
                user_id,
                mobile_no,
                parent_name,
                parent_mobile_no,
                address,
                college_name,
                class_grade,
                admission_date,
                users (
                    id,
                    username,
                    name,
                    phone,
                    email,
                    is_active
                ),
                marks (
                    id,
                    test_name,
                    subject,
                    marks_obtained,
                    total_marks,
                    date
                ),
                attendance (
                    id,
                    date,
                    status
                ),
                fees (
                    id,
                    total_amount,
                    paid_amount,
                    status,
                    due_date
                )
            `)
            .order('admission_date', { ascending: false });

        if (class_grade) {
            query = query.eq('class_grade', class_grade);
        }

        const { data: students, error } = await query;

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        let filtered = students || [];

        // Apply text search if provided
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(
                (item) =>
                    item.users?.name?.toLowerCase().includes(s) ||
                    item.users?.username?.toLowerCase().includes(s) ||
                    item.college_name?.toLowerCase().includes(s) ||
                    item.mobile_no?.includes(s)
            );
        }

        return res.status(200).json({
            success: true,
            count: filtered.length,
            data: filtered,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get single student profile (Student reads ONLY own; staff reads by ID)
 * @route   GET /api/students/:id
 * @access  Private
 */
exports.getStudentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // If client sends 'me', resolve to current student's ID
        let studentId = id;
        if (id === 'me') {
            if (req.user.role !== 'student') {
                return res.status(400).json({ success: false, message: "'/students/me' is only accessible to students" });
            }
            studentId = req.user.studentId;
        }

        const { data: student, error } = await supabase
            .from('students')
            .select(`
                id,
                user_id,
                mobile_no,
                parent_name,
                parent_mobile_no,
                address,
                college_name,
                class_grade,
                admission_date,
                users (
                    id,
                    username,
                    name,
                    phone,
                    email,
                    is_active
                ),
                marks (
                    id,
                    test_name,
                    subject,
                    marks_obtained,
                    total_marks,
                    date
                ),
                attendance (
                    id,
                    date,
                    status
                ),
                fees (
                    id,
                    total_amount,
                    paid_amount,
                    status,
                    due_date,
                    fee_payments (
                        id,
                        amount,
                        method,
                        razorpay_payment_id,
                        paid_at
                    )
                )
            `)
            .eq('id', studentId)
            .maybeSingle();

        if (error || !student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Ownership enforcement: students can only read their own record!
        if (req.user.role === 'student' && student.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only view your own student record',
            });
        }

        return res.status(200).json({
            success: true,
            data: student,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Update student profile (Admin, Reception)
 * @route   PATCH /api/students/:id
 * @access  Private (Admin, Reception)
 */
exports.updateStudent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name,
            mobileNo,
            parentName,
            parentMobNo,
            address,
            collegeName,
            classGrade,
            email,
        } = req.body;

        const studentUpdates = {};
        if (mobileNo) studentUpdates.mobile_no = mobileNo.trim();
        if (parentName) studentUpdates.parent_name = parentName.trim();
        if (parentMobNo) studentUpdates.parent_mobile_no = parentMobNo.trim();
        if (address) studentUpdates.address = address.trim();
        if (collegeName) studentUpdates.college_name = collegeName.trim();
        if (classGrade) studentUpdates.class_grade = classGrade;

        const { data: updatedStudent, error } = await supabase
            .from('students')
            .update(studentUpdates)
            .eq('id', id)
            .select('*')
            .maybeSingle();

        if (error || !updatedStudent) {
            return res.status(400).json({ success: false, message: error?.message || 'Student not found' });
        }

        // Update associated user fields if provided
        if (name || mobileNo || email !== undefined) {
            const userUpdates = {};
            if (name) userUpdates.name = name.trim();
            if (mobileNo) userUpdates.phone = mobileNo.trim();
            if (email !== undefined) userUpdates.email = email ? email.trim() : null;

            await supabase
                .from('users')
                .update(userUpdates)
                .eq('id', updatedStudent.user_id);
        }

        return res.status(200).json({
            success: true,
            message: 'Student record updated successfully',
            data: updatedStudent,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Delete/exit student record (Admin, Reception)
 * @route   DELETE /api/students/:id
 * @access  Private (Admin, Reception)
 */
exports.deleteStudent = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fetch student to get user_id
        const { data: student } = await supabase
            .from('students')
            .select('id, user_id')
            .eq('id', id)
            .maybeSingle();

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Deleting the user will cascade delete the student record via foreign key
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', student.user_id);

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Student record and associated account removed successfully',
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Bulk promote 11th standard students to 12th standard (Admin, Reception)
 * @route   POST /api/students/swap-11-to-12
 * @access  Private (Admin, Reception)
 */
exports.swap11to12 = async (req, res, next) => {
    try {
        const { studentIds } = req.body || {};

        let query = supabase
            .from('students')
            .update({ class_grade: '12th' })
            .eq('class_grade', '11th');

        if (Array.isArray(studentIds) && studentIds.length > 0) {
            query = query.in('id', studentIds);
        }

        const { data: updated, error } = await query.select('id');

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            message: `Successfully promoted ${updated.length} students to 12th standard`,
            count: updated.length,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Bulk archive / remove passed 12th standard batch (Admin, Reception)
 * @route   POST /api/students/bulk-archive-12th
 * @access  Private (Admin, Reception)
 */
exports.bulkArchive12th = async (req, res, next) => {
    try {
        // Fetch all 12th standard student user_ids
        const { data: students, error: fetchErr } = await supabase
            .from('students')
            .select('user_id')
            .eq('class_grade', '12th');

        if (fetchErr) {
            return res.status(500).json({ success: false, message: fetchErr.message });
        }

        if (!students || students.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No 12th standard students found to archive',
                count: 0,
            });
        }

        const userIds = students.map((s) => s.user_id);

        // Deleting users cascades to students, marks, attendance, fees
        const { error: delErr } = await supabase
            .from('users')
            .delete()
            .in('id', userIds);

        if (delErr) {
            return res.status(500).json({ success: false, message: delErr.message });
        }

        return res.status(200).json({
            success: true,
            message: `Successfully archived and removed ${userIds.length} completed 12th standard students`,
            count: userIds.length,
        });
    } catch (err) {
        next(err);
    }
};
