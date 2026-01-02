const express = require('express');
const router = express.Router();
const { getStoreSettings, updateStoreSettings } = require('../controllers/settingsController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get store settings - accessible by all authenticated users
router.get('/', authenticateToken, getStoreSettings);

// Update store settings - Admin only
router.put('/', authenticateToken, authorizeRole('Admin'), updateStoreSettings);

module.exports = router;
