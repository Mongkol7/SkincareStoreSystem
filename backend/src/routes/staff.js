const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/staffController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Staff routes - Admin and HR
router.get('/', authorizeRole('Admin', 'HR'), getAllStaff);
router.get('/:id', authorizeRole('Admin', 'HR'), getStaffById);
router.post('/', authorizeRole('Admin', 'HR'), createStaff);
router.put('/:id', authorizeRole('Admin', 'HR'), updateStaff);
router.delete('/:id', authorizeRole('Admin', 'HR'), deleteStaff);

// User routes - Admin and HR
router.get('/users/all', authorizeRole('Admin', 'HR'), getAllUsers);
router.post('/users', authorizeRole('Admin', 'HR'), createUser);
router.put('/users/:id', authorizeRole('Admin', 'HR'), updateUser);
router.delete('/users/:id', authorizeRole('Admin', 'HR'), deleteUser);

module.exports = router;
