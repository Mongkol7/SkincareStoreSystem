const express = require('express');
const router = express.Router();
const {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  approvePurchaseOrder,
  deletePurchaseOrder
} = require('../controllers/purchaseOrdersController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all purchase orders - Admin and Stock Manager
router.get('/', authorizeRole('Admin', 'Stock Manager'), getAllPurchaseOrders);

// Get purchase order by ID
router.get('/:id', authorizeRole('Admin', 'Stock Manager'), getPurchaseOrderById);

// Create purchase order - Admin and Stock Manager
router.post('/', authorizeRole('Admin', 'Stock Manager'), createPurchaseOrder);

// Approve purchase order - Admin only
router.patch('/:id/approve', authorizeRole('Admin'), approvePurchaseOrder);

// Update purchase order
router.put('/:id', authorizeRole('Admin', 'Stock Manager'), updatePurchaseOrder);

// Delete purchase order - Admin only
router.delete('/:id', authorizeRole('Admin'), deletePurchaseOrder);

module.exports = router;
