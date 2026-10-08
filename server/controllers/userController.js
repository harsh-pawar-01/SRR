/**
 * userController.js
 * Admin-only management for staff users (teachers, receptionists, administrators).
 */

const bcrypt = require('bcryptjs');
const { z } = require('zod');
const supabase = require('../config/supabase');

const VALID_ROLES = ['teacher', 'reception', 'admin'];
const VALID_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

// Schema for creating staff user
exports.createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters').trim(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        name: z.string().min(2, 'Name is required').trim(),
        role: z.enum(['teacher', 'reception', 'admin'], {
            errorMap: () => ({ message: "Role must be 'teacher', 'reception', or 'admin'" }),
        }),
        subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Biology']).optional().nullable(),
        phone: z.string().min(7, 'Valid phone number is required').trim(),
        email: z.string().email('Invalid email address').optional().nullable(),
    }).refine((data) => {
        if (data.role === 'teacher' && !data.subject) {
            return false;
        }
        return true;
    }, {
        message: 'Subject is required for teacher role (Physics, Chemistry, Mathematics, Biology)',
        path: ['subject'],
    }),
});

// Schema for updating user
exports.updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        subject: z.enum(['Physics', 'Chemistry', 'Mathematics', 'Biology']).optional().nullable(),
        phone: z.string().min(7).optional(),
        email: z.string().email().optional().nullable(),
        is_active: z.boolean().optional(),
        password: z.string().min(6).optional(),
    }),
});

/**
 * @desc    Get all staff users (admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res, next) => {
    try {
        const { role, is_active } = req.query;

        let query = supabase
            .from('users')
            .select('id, username, name, role, subject, phone, email, is_active, created_at')
            .order('created_at', { ascending: false });

        if (role) {
            query = query.eq('role', role);
        }
        if (is_active !== undefined) {
            query = query.eq('is_active', is_active === 'true');
        }

        const { data: users, error } = await query;

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Create new staff user (teacher, reception, admin)
 * @route   POST /api/users
 * @access  Private (Admin)
 */
exports.createUser = async (req, res, next) => {
    try {
        const { username, password, name, role, subject, phone, email } = req.body;

        // Check if username already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('username', username.trim())
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `Username '${username}' is already taken`,
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                username: username.trim(),
                password_hash: passwordHash,
                name: name.trim(),
                role,
                subject: role === 'teacher' ? subject : null,
                phone: phone.trim(),
                email: email ? email.trim() : null,
                is_active: true,
            })
            .select('id, username, name, role, subject, phone, email, is_active, created_at')
            .single();

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(201).json({
            success: true,
            message: `User '${newUser.username}' created successfully`,
            data: newUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Update staff user profile
 * @route   PATCH /api/users/:id
 * @access  Private (Admin)
 */
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // If password is being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password_hash = await bcrypt.hash(updates.password, salt);
            delete updates.password;
        }

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select('id, username, name, role, subject, phone, email, is_active, created_at')
            .maybeSingle();

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Deactivate user account
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
exports.deactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Prevent self-deactivation
        if (req.user.id === id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own admin account',
            });
        }

        const { data: user, error } = await supabase
            .from('users')
            .update({ is_active: false })
            .eq('id', id)
            .select('id, username, is_active')
            .maybeSingle();

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            message: `User '${user.username}' deactivated successfully`,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};
