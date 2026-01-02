const FileStorage = require('../utils/fileStorage');

const poStorage = new FileStorage('purchaseOrders');

// Get all purchase orders
const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await poStorage.findAll();
    res.json(purchaseOrders);
  } catch (error) {
    console.error('Get purchase orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get purchase order by ID
const getPurchaseOrderById = async (req, res) => {
  try {
    const po = await poStorage.findById(req.params.id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json(po);
  } catch (error) {
    console.error('Get purchase order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new purchase order
const createPurchaseOrder = async (req, res) => {
  try {
    const { user } = req;
    const userRole = user.roles[0]?.name;

    // Generate PO number
    const allPOs = await poStorage.findAll();
    const nextPONum = allPOs.length + 1;
    const poNumber = `PO-2025-${String(nextPONum).padStart(3, '0')}`;

    // Auto-approve if created by Admin
    const status = userRole === 'Admin' ? 'Approved' : 'Pending';
    const approvedBy = userRole === 'Admin' ? user.username : null;

    const newPO = {
      ...req.body,
      poNumber,
      status,
      approvedBy,
      createdBy: user.username || user.name,
      date: new Date().toISOString().split('T')[0]
    };

    const createdPO = await poStorage.create(newPO);
    res.status(201).json(createdPO);
  } catch (error) {
    console.error('Create purchase order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update purchase order
const updatePurchaseOrder = async (req, res) => {
  try {
    const updatedPO = await poStorage.update(req.params.id, req.body);
    if (!updatedPO) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json(updatedPO);
  } catch (error) {
    console.error('Update purchase order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve purchase order
const approvePurchaseOrder = async (req, res) => {
  try {
    const { user } = req;
    const updatedPO = await poStorage.update(req.params.id, {
      status: 'Approved',
      approvedBy: user.username || user.name
    });
    if (!updatedPO) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json(updatedPO);
  } catch (error) {
    console.error('Approve purchase order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete purchase order
const deletePurchaseOrder = async (req, res) => {
  try {
    const deleted = await poStorage.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error('Delete purchase order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  approvePurchaseOrder,
  deletePurchaseOrder
};
