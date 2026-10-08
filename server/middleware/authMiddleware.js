/**
 * authMiddleware.js
 * JWT authentication and role-based authorization using Supabase.
 */

const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided',
        });
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured on the server');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from Supabase (excluding password_hash)
        const { data: user, error } = await supabase
            .from('users')
            .select('id, username, name, role, subject, phone, email, is_active')
            .eq('id', decoded.id)
            .maybeSingle();

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found',
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact administration.',
            });
        }

        // If user is a student, attach their student record ID for fast ownership checks
        if (user.role === 'student') {
            const { data: studentRecord } = await supabase
                .from('students')
                .select('id, class_grade')
                .eq('user_id', user.id)
                .maybeSingle();

            if (studentRecord) {
                user.studentId = studentRecord.id;
                user.classGrade = studentRecord.class_grade;
            }
        }

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token invalid or expired',
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this route`,
            });
        }
        return next();
    };
};