/**
 * authRoutes.js
 * Authentication routing for SRR Academy API.
 */

const express = require('express');
const router = express.Router();
const { loginUser, getMe, loginSchema } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// Public route: Login (rate-limited via server.js limiter)
router.post('/login', validate(loginSchema), loginUser);

// Protected route: Current user info
router.get('/me', protect, getMe);

module.exports = router;