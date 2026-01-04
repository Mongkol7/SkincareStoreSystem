const express = require('express');
const router = express.Router();
const { getBatches, getBatchById, openBatch, closeBatch } = require('../controllers/batchController');
const { authenticateToken } = require('../middleware/auth');

// Get all batches
router.get('/', authenticateToken, getBatches);

// Get batch by ID
router.get('/:id', authenticateToken, getBatchById);

// Open new batch
router.post('/', authenticateToken, openBatch);

// Close batch
router.put('/:id/close', authenticateToken, closeBatch);

module.exports = router;
