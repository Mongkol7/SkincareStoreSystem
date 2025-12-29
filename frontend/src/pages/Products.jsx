import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Products = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock product data with state
  const [products, setProducts] = useState([
    {
      id: 1,
      sku: 'SKU-001',
      name: 'Vitamin C Serum',
      category: 'Serum',
      brand: 'GlowSkin',
      price: 45.99,
      stock: 5,
      min_stock: 10,
      status: 'Low Stock'
    },
    {
      id: 2,
      sku: 'SKU-002',
      name: 'Hydrating Cleanser',
      category: 'Cleanser',
      brand: 'PureGlow',
      price: 29.99,
      stock: 3,
      min_stock: 15,
      status: 'Low Stock'
    },
    {
      id: 3,
      sku: 'SKU-003',
      name: 'Sunscreen SPF 50',
      category: 'Sunscreen',
      brand: 'SunShield',
      price: 35.00,
      stock: 25,
      min_stock: 20,
      status: 'In Stock'
    },
    {
      id: 4,
      sku: 'SKU-004',
      name: 'Hyaluronic Acid Moisturizer',
      category: 'Moisturizer',
      brand: 'HydraPlus',
      price: 52.50,
      stock: 18,
      min_stock: 10,
      status: 'In Stock'
    },
    {
      id: 5,
      sku: 'SKU-005',
      name: 'Retinol Night Cream',
      category: 'Night Cream',
      brand: 'YouthGlow',
      price: 68.00,
      stock: 12,
      min_stock: 8,
      status: 'In Stock'
    },
    {
      id: 6,
      sku: 'SKU-006',
      name: 'Gentle Exfoliating Scrub',
      category: 'Exfoliator',
      brand: 'SmoothSkin',
      price: 24.99,
      stock: 0,
      min_stock: 12,
      status: 'Out of Stock'
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    min_stock: '',
  });

  const [restockQuantity, setRestockQuantity] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...new Set(products.map(p => p.category))];
  }, [products]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || product.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, filterCategory, filterStatus]);

  // Handle Add Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: products.length + 1,
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      min_stock: parseInt(formData.min_stock),
      status: parseInt(formData.stock) === 0 ? 'Out of Stock' :
              parseInt(formData.stock) < parseInt(formData.min_stock) ? 'Low Stock' : 'In Stock'
    };

    setProducts([...products, newProduct]);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Handle Edit Product
  const handleEditProduct = (e) => {
    e.preventDefault();
    setProducts(products.map(p =>
      p.id === selectedProduct.id
        ? {
            ...p,
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            min_stock: parseInt(formData.min_stock),
            status: parseInt(formData.stock) === 0 ? 'Out of Stock' :
                    parseInt(formData.stock) < parseInt(formData.min_stock) ? 'Low Stock' : 'In Stock'
          }
        : p
    ));
    setIsEditModalOpen(false);
    resetForm();
  };

  // Handle Restock
  const handleRestock = (e) => {
    e.preventDefault();
    const quantity = parseInt(restockQuantity);
    setProducts(products.map(p =>
      p.id === selectedProduct.id
        ? {
            ...p,
            stock: p.stock + quantity,
            status: (p.stock + quantity) === 0 ? 'Out of Stock' :
                    (p.stock + quantity) < p.min_stock ? 'Low Stock' : 'In Stock'
          }
        : p
    ));
    setIsRestockModalOpen(false);
    setRestockQuantity('');
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price.toString(),
      stock: product.stock.toString(),
      min_stock: product.min_stock.toString(),
    });
    setIsEditModalOpen(true);
  };

  // Open Restock Modal
  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setRestockQuantity('');
    setIsRestockModalOpen(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      min_stock: '',
    });
    setSelectedProduct(null);
  };

  // Clear Filters
  const clearFilters = () => {
    setFilterCategory('all');
    setFilterStatus('all');
    setSearchTerm('');
  };

  const columns = [
    { field: 'sku', label: 'SKU' },
    { field: 'name', label: 'Product Name' },
    { field: 'category', label: 'Category' },
    { field: 'brand', label: 'Brand' },
    {
      field: 'price',
      label: 'Price',
      render: (value) => <span className="font-semibold text-white">${value.toFixed(2)}</span>,
    },
    {
      field: 'stock',
      label: 'Stock',
      render: (value, row) => (
        <span className={value < row.min_stock ? 'text-white/70 font-semibold' : 'text-white font-semibold'}>
          {value} / {row.min_stock}
        </span>
      ),
    },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${
          value === 'In Stock' ? 'badge-success' :
          value === 'Low Stock' ? 'badge-warning' :
          'badge-danger'
        }`}>
          {value}
        </span>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => openEditModal(row)}>
            Edit
          </Button>
          <Button variant="primary" size="sm" onClick={() => openRestockModal(row)}>
            Restock
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
    <div className="min-h-screen">
      <div className="flex gap-0">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userRole={user?.roles?.[0]?.name}
        />

        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            <Navbar user={user} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Products
              </h2>
              <p className="text-white/60 text-sm">
                Manage product inventory and pricing
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">In Stock</p>
                <p className="text-2xl font-bold text-white">
                  {products.filter(p => p.status === 'In Stock').length}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Low Stock</p>
                <p className="text-2xl font-bold text-white/80">
                  {products.filter(p => p.status === 'Low Stock').length}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Out of Stock</p>
                <p className="text-2xl font-bold text-white/70">
                  {products.filter(p => p.status === 'Out of Stock').length}
                </p>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <Card className="mb-4">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="text-white/60 hover:text-white">
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Category</label>
                      <select
                        className="select w-full"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat === 'all' ? 'All Categories' : cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Status</label>
                      <select
                        className="select w-full"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button variant="secondary" onClick={clearFilters} className="w-full">
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card>
              <CardHeader
                title="Product Inventory"
                action={
                  <div className="flex gap-3">
                    <div className="relative">
                      <MagnifyingGlassIcon className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
                      <FunnelIcon className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                }
              />
              <Table columns={columns} data={filteredProducts} />
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/60">No products found</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); resetForm(); }}
        title="Add New Product"
        size="lg"
      >
        <form onSubmit={handleAddProduct}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">SKU</label>
              <Input
                required
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                placeholder="e.g., SKU-007"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Product Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Facial Toner"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Category</label>
              <Input
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Toner"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Brand</label>
              <Input
                required
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="e.g., BrandName"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Price ($)</label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Current Stock</label>
              <Input
                required
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Minimum Stock</label>
              <Input
                required
                type="number"
                value={formData.min_stock}
                onChange={(e) => setFormData({...formData, min_stock: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); resetForm(); }}
        title="Edit Product"
        size="lg"
      >
        <form onSubmit={handleEditProduct}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">SKU</label>
              <Input
                required
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Product Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Category</label>
              <Input
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Brand</label>
              <Input
                required
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Price ($)</label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Current Stock</label>
              <Input
                required
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Minimum Stock</label>
              <Input
                required
                type="number"
                value={formData.min_stock}
                onChange={(e) => setFormData({...formData, min_stock: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => { setIsEditModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Restock Modal */}
      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => { setIsRestockModalOpen(false); setRestockQuantity(''); }}
        title={`Restock: ${selectedProduct?.name}`}
        size="sm"
      >
        <form onSubmit={handleRestock}>
          <div className="mb-6">
            <div className="glass-card p-4 mb-4">
              <p className="text-sm text-white/60 mb-1">Current Stock</p>
              <p className="text-2xl font-bold text-white">{selectedProduct?.stock} units</p>
            </div>
            <label className="block text-sm text-white/70 mb-2">Add Quantity</label>
            <Input
              required
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              placeholder="Enter quantity to add"
            />
            {restockQuantity && (
              <p className="text-sm text-white/60 mt-2">
                New stock will be: {parseInt(selectedProduct?.stock || 0) + parseInt(restockQuantity)} units
              </p>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => { setIsRestockModalOpen(false); setRestockQuantity(''); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Restock
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
