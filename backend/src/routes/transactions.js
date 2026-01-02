const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  getTransactionsByDateRange
} = require('../controllers/transactionsController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all transactions - Admin and Cashier
router.get('/', authorizeRole('Admin', 'Cashier'), getAllTransactions);

// Get transactions by date range - Admin and Cashier
router.get('/date-range', authorizeRole('Admin', 'Cashier'), getTransactionsByDateRange);

// Get transaction by ID
router.get('/:id', authorizeRole('Admin', 'Cashier'), getTransactionById);

// Create transaction - Cashier and Admin
router.post('/', authorizeRole('Admin', 'Cashier'), createTransaction);

module.exports = router;
