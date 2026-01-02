const FileStorage = require('../utils/fileStorage');

const productsStorage = new FileStorage('products');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await productsStorage.findAll();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await productsStorage.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const newProduct = await productsStorage.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productsStorage.update(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deleted = await productsStorage.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
  try {
    const products = await productsStorage.findAll();
    const lowStockProducts = products.filter(p => p.stock < p.min_stock);
    res.json(lowStockProducts);
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};
