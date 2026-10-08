/**
 * consultationController.js
 * Public consultation inquiries, lead collection, and front-desk review.
 */

const { z } = require('zod');
const supabase = require('../config/supabase');

// Validation schema for public admission inquiries
exports.createConsultationSchema = z.object({
    body: z.object({
        studentName: z.string().min(2, 'Student name is required').trim(),
        parentName: z.string().min(2, 'Parent name is required').trim(),
        admissionYear: z.string().min(2, 'Admission year / standard is required').trim(),
        stream: z.string().min(2, 'Target stream is required').trim(),
        contactNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9').trim(),
        email: z.string().email('Please enter a valid email address').trim(),
        address: z.string().min(3, 'Address is required').trim(),
        message: z.string().optional().nullable(),
    }),
});

exports.updateStatusSchema = z.object({
    body: z.object({
        status: z.enum(['Pending', 'Followed Up', 'Enrolled', 'Closed'], {
            errorMap: () => ({ message: "Status must be 'Pending', 'Followed Up', 'Enrolled', or 'Closed'" }),
        }),
    }),
});

/**
 * @desc    Submit admission consultation inquiry
 * @route   POST /api/consultations
 * @access  Public (Rate-limited)
 */
exports.createConsultation = async (req, res, next) => {
    try {
        const {
            studentName,
            parentName,
            admissionYear,
            stream,
            contactNumber,
            email,
            address,
            message,
        } = req.body;

        const { data: consultation, error } = await supabase
            .from('consultations')
            .insert({
                student_name: studentName.trim(),
                parent_name: parentName.trim(),
                admission_year: admissionYear.trim(),
                stream: stream.trim(),
                contact_number: contactNumber.trim(),
                email: email.trim().toLowerCase(),
                address: address.trim(),
                message: message ? message.trim() : null,
                status: 'Pending',
            })
            .select('*')
            .single();

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(201).json({
            success: true,
            message: 'Consultation request submitted successfully',
            data: consultation,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get all consultation inquiries (Admin, Reception)
 * @route   GET /api/consultations
 * @access  Private (Admin, Reception)
 */
exports.getConsultations = async (req, res, next) => {
    try {
        const { status } = req.query;

        let query = supabase
            .from('consultations')
            .select('*')
            .order('submitted_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data: consultations, error } = await query;

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res.status(200).json({
            success: true,
            count: consultations.length,
            data: consultations,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Update consultation status (Admin, Reception)
 * @route   PATCH /api/consultations/:id
 * @access  Private (Admin, Reception)
 */
exports.updateConsultationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data: consultation, error } = await supabase
            .from('consultations')
            .update({ status })
            .eq('id', id)
            .select('*')
            .maybeSingle();

        if (error || !consultation) {
            return res.status(400).json({ success: false, message: error?.message || 'Consultation lead not found' });
        }

        return res.status(200).json({
            success: true,
            message: `Consultation status updated to '${status}'`,
            data: consultation,
        });
    } catch (err) {
        next(err);
    }
};
