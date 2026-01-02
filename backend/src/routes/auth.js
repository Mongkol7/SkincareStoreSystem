const express = require('express');
const router = express.Router();
const { login, getCurrentUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
