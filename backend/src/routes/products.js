const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../controllers/productsController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all products - accessible by Admin, Stock Manager
router.get('/', authorizeRole('Admin', 'Stock Manager', 'Cashier'), getAllProducts);

// Get low stock products - accessible by Admin, Stock Manager
router.get('/low-stock', authorizeRole('Admin', 'Stock Manager'), getLowStockProducts);

// Get product by ID
router.get('/:id', authorizeRole('Admin', 'Stock Manager', 'Cashier'), getProductById);

// Create product - Admin and Stock Manager only
router.post('/', authorizeRole('Admin', 'Stock Manager'), createProduct);

// Update product - Admin and Stock Manager only
router.put('/:id', authorizeRole('Admin', 'Stock Manager'), updateProduct);

// Delete product - Admin only
router.delete('/:id', authorizeRole('Admin'), deleteProduct);

module.exports = router;
