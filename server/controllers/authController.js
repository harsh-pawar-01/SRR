/**
 * authController.js
 * Supabase-backed authentication handling login and session identity.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const supabase = require('../config/supabase');

// Generate 7-day JWT token
const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing from environment variables');
    }
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Zod schema for login
exports.loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required').trim(),
        password: z.string().min(1, 'Password is required'),
    }),
});

/**
 * @desc    Authenticate user & return 7-day JWT
 * @route   POST /api/auth/login
 * @access  Public (Rate-limited)
 */
exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Query user with password_hash
        const { data: user, error } = await supabase
            .from('users')
            .select('id, username, password_hash, name, role, subject, phone, email, is_active')
            .eq('username', username.trim())
            .maybeSingle();

        // Use the exact same generic error for wrong username, missing user, or inactive account
        if (error || !user || !user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password',
            });
        }

        // Compare password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password',
            });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.role);

        // If user is a student, attach their student record details
        let studentDetails = null;
        if (user.role === 'student') {
            const { data: studentRecord } = await supabase
                .from('students')
                .select('id, class_grade, admission_date')
                .eq('user_id', user.id)
                .maybeSingle();
            studentDetails = studentRecord;
        }

        // Sanitize output (never leak password_hash)
        const safeUser = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            subject: user.subject,
            phone: user.phone,
            email: user.email,
            studentId: studentDetails?.id || null,
            classGrade: studentDetails?.class_grade || null,
        };

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: safeUser,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private (Authenticated)
 */
exports.getMe = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            data: req.user,
        });
    } catch (err) {
        next(err);
    }
};