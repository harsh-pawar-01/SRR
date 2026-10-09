/**
 * userRoutes.js
 * Admin-only user management routing.
 */

const express = require('express');
const router = express.Router();
const {
    getUsers,
    createUser,
    updateUser,
    deactivateUser,
    createUserSchema,
    updateUserSchema,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// All user management routes require admin role
router.use(protect, authorize('admin'));

router.route('/')
    .get(getUsers)
    .post(validate(createUserSchema), createUser);

router.route('/:id')
    .patch(validate(updateUserSchema), updateUser)
    .delete(deactivateUser);

module.exports = router;
