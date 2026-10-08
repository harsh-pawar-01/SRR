/**
 * server.js
 * Express application entrypoint for SRR / Royal Academy Portal API.
 */

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables before requiring database or services
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Critical Startup Validation
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is required.');
    process.exit(1);
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('FATAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
}

const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const supabase = require('./config/supabase');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const marksRoutes = require('./routes/marksRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const feeRoutes = require('./routes/feeRoutes');

// Supabase Connection Verification
(async () => {
    try {
        const { error } = await supabase.from('users').select('id').limit(1);
        if (error) {
            console.error('Supabase connection check failed:', error.message);
        } else {
            console.log('Supabase connected');
        }
    } catch (err) {
        console.error('Supabase connection exception:', err.message);
    }
})();

const app = express();

// Security Middlewares
app.use(helmet());

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching frontend
        if (!origin || origin === frontendUrl || origin === 'http://localhost:5173') {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
}));

// Request Body Parsing with Strict Size Limit
app.use(express.json({ limit: '10kb' }));

// Strict Rate Limiting on Login & Public Form Endpoints
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
    },
});

const consultationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many consultation requests. Please try again later.',
    },
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SRR / Royal Academy of Science API is running',
        timestamp: new Date().toISOString(),
    });
});

// Mount Routes under /api
app.use('/api/auth', (req, res, next) => {
    if (req.method === 'POST' && req.path === '/login') {
        return loginLimiter(req, res, next);
    }
    next();
}, authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/syllabus', syllabusRoutes);

app.use('/api/consultations', (req, res, next) => {
    if (req.method === 'POST' && req.path === '/') {
        return consultationLimiter(req, res, next);
    }
    next();
}, consultationRoutes);

app.use('/api/fees', feeRoutes);

// Centralized Error Handler (Never leak stack traces in production)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }),
    });
});

const PORT = process.env.PORT || 5000;

let server;
if (require.main === module) {
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = { app, server };