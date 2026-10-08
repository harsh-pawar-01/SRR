/**
 * validate.js
 * Zod schema validation middleware for Express routes.
 */

const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Assign sanitized & validated data back
        if (parsed.body) req.body = parsed.body;
        if (parsed.query) req.query = parsed.query;
        if (parsed.params) req.params = parsed.params;

        next();
    } catch (err) {
        if (err.errors) {
            const errorDetails = err.errors.map((e) => ({
                field: e.path.filter((p) => p !== 'body' && p !== 'query' && p !== 'params').join('.') || e.path.join('.'),
                message: e.message,
            }));
            return res.status(400).json({
                success: false,
                message: errorDetails[0]?.message || 'Validation error',
                errors: errorDetails,
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Invalid request data',
        });
    }
};

module.exports = validate;
