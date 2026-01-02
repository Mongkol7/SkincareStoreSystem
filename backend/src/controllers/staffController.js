const FileStorage = require('../utils/fileStorage');

const staffStorage = new FileStorage('staff');
const usersStorage = new FileStorage('users');

// Get all staff
const getAllStaff = async (req, res) => {
  try {
    const staff = await staffStorage.findAll();
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get staff by ID
const getStaffById = async (req, res) => {
  try {
    const staff = await staffStorage.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new staff member
const createStaff = async (req, res) => {
  try {
    // Generate employee ID
    const allStaff = await staffStorage.findAll();
    const nextEmpNum = allStaff.length + 1;
    const employeeId = `EMP${String(nextEmpNum).padStart(3, '0')}`;

    const newStaff = {
      ...req.body,
      employeeId,
      status: req.body.status || 'Active'
    };

    const createdStaff = await staffStorage.create(newStaff);
    res.status(201).json(createdStaff);
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update staff member
const updateStaff = async (req, res) => {
  try {
    const updatedStaff = await staffStorage.update(req.params.id, req.body);
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(updatedStaff);
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete staff member
const deleteStaff = async (req, res) => {
  try {
    const deleted = await staffStorage.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (for HR User Accounts)
const getAllUsers = async (req, res) => {
  try {
    const users = await usersStorage.findAll();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new user (for HR User Accounts)
const createUser = async (req, res) => {
  try {
    const newUser = {
      ...req.body,
      password: '$2a$10$rQZ8qNqZ5Y5YZ5YZ5YZ5YeO5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y' // Default hashed password
    };

    const createdUser = await usersStorage.create(newUser);
    const { password, ...userWithoutPassword } = createdUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await usersStorage.update(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const deleted = await usersStorage.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
