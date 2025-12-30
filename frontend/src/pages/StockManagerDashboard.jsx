import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const StockManagerDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isViewPOModalOpen, setIsViewPOModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reorderForm, setReorderForm] = useState({
    quantity: '',
    supplier: '',
    expectedDelivery: '',
  });
  const [poForm, setPOForm] = useState({
    supplier: '',
    expectedDelivery: '',
    notes: '',
  });
  const [poItems, setPOItems] = useState([
    { product: '', quantity: '', unitPrice: '' }
  ]);

  const stats = {
    totalProducts: 156,
    lowStock: 8,
    pendingPO: 3,
    receivedToday: 2,
  };

  const lowStockProducts = [
    { id: 1, name: 'Vitamin C Serum', stock: 5, min_stock: 20, category: 'Serum', supplier: 'BeautySupply Co' },
    { id: 2, name: 'Hydrating Cleanser', stock: 3, min_stock: 15, category: 'Cleanser', supplier: 'SkinCare Inc' },
    { id: 3, name: 'Sunscreen SPF 50', stock: 8, min_stock: 25, category: 'Sunscreen', supplier: 'BeautySupply Co' },
    { id: 4, name: 'Face Mask Pack', stock: 12, min_stock: 30, category: 'Mask', supplier: 'Global Cosmetics' },
  ];

  const purchaseOrders = [
    {
      id: 1,
      po_number: 'PO-001',
      supplier: 'BeautySupply Co',
      items: 5,
      total: 1250.00,
      status: 'Pending',
      date: '2023-12-20',
      products: ['Vitamin C Serum', 'Sunscreen SPF 50', 'Anti-Aging Cream'],
      itemsList: [
        { product: 'Vitamin C Serum', quantity: 30, unitPrice: 25.00 },
        { product: 'Sunscreen SPF 50', quantity: 50, unitPrice: 15.00 },
        { product: 'Anti-Aging Cream', quantity: 10, unitPrice: 50.00 },
      ]
    },
    {
      id: 2,
      po_number: 'PO-002',
      supplier: 'SkinCare Inc',
      items: 3,
      total: 850.00,
      status: 'Approved',
      date: '2023-12-22',
      products: ['Hydrating Cleanser', 'Toner Essence'],
      itemsList: [
        { product: 'Hydrating Cleanser', quantity: 40, unitPrice: 12.50 },
        { product: 'Toner Essence', quantity: 25, unitPrice: 14.00 },
      ]
    },
    {
      id: 3,
      po_number: 'PO-003',
      supplier: 'Global Cosmetics',
      items: 8,
      total: 2100.00,
      status: 'Received',
      date: '2023-12-25',
      products: ['Face Mask Pack', 'Eye Cream', 'Moisturizing Cream'],
      itemsList: [
        { product: 'Face Mask Pack', quantity: 100, unitPrice: 8.00 },
        { product: 'Eye Cream', quantity: 30, unitPrice: 35.00 },
        { product: 'Moisturizing Cream', quantity: 20, unitPrice: 22.50 },
      ]
    },
  ];

  const productColumns = [
    { field: 'name', label: 'Product' },
    { field: 'category', label: 'Category' },
    {
      field: 'stock',
      label: 'Current / Min Stock',
      render: (value, row) => (
        <span className="text-danger-400 font-semibold">
          {value} / {row.min_stock}
        </span>
      ),
    },
    { field: 'supplier', label: 'Supplier' },
    {
      field: 'id',
      label: 'Action',
      render: (value, row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSelectedProduct(row);
            setReorderForm({
              quantity: row.min_stock,
              supplier: row.supplier,
              expectedDelivery: '',
            });
            setIsReorderModalOpen(true);
          }}
        >
          <ArrowPathIcon className="w-4 h-4 mr-1" />
          Reorder
        </Button>
      ),
    },
  ];

  // Handler functions
  const handleReorder = (e) => {
    e.preventDefault();
    console.log('Reorder product:', {
      product: selectedProduct,
      ...reorderForm,
    });
    setIsReorderModalOpen(false);
    setReorderForm({
      quantity: '',
      supplier: '',
      expectedDelivery: '',
    });
  };

  const handleCreatePO = (e) => {
    e.preventDefault();
    console.log('Create PO:', {
      ...poForm,
      items: poItems,
    });
    setIsCreatePOModalOpen(false);
    setPOForm({
      supplier: '',
      expectedDelivery: '',
      notes: '',
    });
    setPOItems([{ product: '', quantity: '', unitPrice: '' }]);
  };

  const addPOItem = () => {
    setPOItems([...poItems, { product: '', quantity: '', unitPrice: '' }]);
  };

  const removePOItem = (index) => {
    const newItems = poItems.filter((_, i) => i !== index);
    setPOItems(newItems);
  };

  const updatePOItem = (index, field, value) => {
    const newItems = [...poItems];
    newItems[index][field] = value;
    setPOItems(newItems);
  };

  const calculatePOTotal = () => {
    return poItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + (qty * price);
    }, 0);
  };

  const poColumns = [
    { field: 'po_number', label: 'PO Number' },
    { field: 'supplier', label: 'Supplier' },
    {
      field: 'products',
      label: 'Products',
      render: (value) => (
        <span className="text-white/80 text-sm">
          {value.join(', ')}
        </span>
      ),
    },
    { field: 'items', label: 'Items' },
    {
      field: 'total',
      label: 'Total',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      field: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          Pending: 'warning',
          Approved: 'primary',
          Received: 'success',
        };
        return <Badge variant={variants[value]}>{value}</Badge>;
      },
    },
    { field: 'date', label: 'Date' },
    {
      field: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPO(row);
            setIsViewPOModalOpen(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
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
              Inventory Management
            </h2>
            <p className="text-white/60 text-sm">
              Monitor stock levels and manage purchase orders
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              icon={<CubeIcon className="w-6 h-6 text-white" />}
              label="Total Products"
              value={stats.totalProducts}
            />
            <StatsCard
              icon={<ExclamationTriangleIcon className="w-6 h-6 text-white" />}
              label="Low Stock Alert"
              value={stats.lowStock}
              trend="down"
              trendValue="2"
            />
            <StatsCard
              icon={<ShoppingBagIcon className="w-6 h-6 text-white" />}
              label="Pending POs"
              value={stats.pendingPO}
            />
            <StatsCard
              icon={<CheckCircleIcon className="w-6 h-6 text-white" />}
              label="Received Today"
              value={stats.receivedToday}
            />
          </div>

          {/* Low Stock Alert */}
          <Card className="mb-6 border-2 border-warning-500/30">
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-warning-400" />
                  Low Stock Alert
                </div>
              }
              action={
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => setIsCreatePOModalOpen(true)}
                >
                  Create Bulk PO
                </Button>
              }
            />
            <Table columns={productColumns} data={lowStockProducts} />
          </Card>

          {/* Purchase Orders */}
          <Card>
            <CardHeader
              title="Recent Purchase Orders"
              action={
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => setIsCreatePOModalOpen(true)}
                >
                  Create New PO
                </Button>
              }
            />
            <Table
              columns={poColumns}
              data={purchaseOrders}
            />
          </Card>
        </div>
      </div>

      {/* View PO Details Modal */}
      <Modal
        isOpen={isViewPOModalOpen}
        onClose={() => setIsViewPOModalOpen(false)}
        title="Purchase Order Details"
        size="lg"
      >
        {selectedPO && (
          <div className="space-y-6">
            {/* PO Information */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">PO Number</p>
                  <p className="text-sm text-white font-medium">{selectedPO.po_number}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Supplier</p>
                  <p className="text-sm text-white font-medium">{selectedPO.supplier}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Order Date</p>
                  <p className="text-sm text-white font-medium">{selectedPO.date}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Status</p>
                  <Badge variant={
                    selectedPO.status === 'Pending' ? 'warning' :
                    selectedPO.status === 'Approved' ? 'primary' : 'success'
                  }>
                    {selectedPO.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedPO.itemsList.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{item.product}</p>
                      <p className="text-xs text-white/60">Unit Price: ${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-white">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">Total Amount</span>
                <span className="text-2xl font-bold text-success-400">
                  ${selectedPO.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="secondary" onClick={() => setIsViewPOModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reorder Product Modal */}
      <Modal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        title="Create Reorder / Purchase Order"
        size="md"
      >
        {selectedProduct && (
          <form onSubmit={handleReorder} className="space-y-4">
            <div className="glass-card p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Product</p>
                  <p className="text-sm text-white font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Current Stock</p>
                  <p className="text-sm font-bold text-danger-400">{selectedProduct.stock}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Min Stock</p>
                  <p className="text-sm text-white/80">{selectedProduct.min_stock}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Category</p>
                  <p className="text-sm text-white/80">{selectedProduct.category}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Order Quantity *</label>
              <Input
                type="number"
                value={reorderForm.quantity}
                onChange={(e) => setReorderForm({ ...reorderForm, quantity: e.target.value })}
                placeholder="Enter quantity to order"
                min="1"
                required
              />
              <p className="text-xs text-white/60 mt-1">Suggested: {selectedProduct.min_stock} units</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Supplier *</label>
              <select
                className="select w-full"
                value={reorderForm.supplier}
                onChange={(e) => setReorderForm({ ...reorderForm, supplier: e.target.value })}
                required
              >
                <option value="">Select Supplier</option>
                <option value="BeautySupply Co">BeautySupply Co</option>
                <option value="SkinCare Inc">SkinCare Inc</option>
                <option value="Global Cosmetics">Global Cosmetics</option>
                <option value="PureGlow Wholesale">PureGlow Wholesale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Expected Delivery *</label>
              <Input
                type="date"
                value={reorderForm.expectedDelivery}
                onChange={(e) => setReorderForm({ ...reorderForm, expectedDelivery: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsReorderModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Purchase Order
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create New PO Modal */}
      <Modal
        isOpen={isCreatePOModalOpen}
        onClose={() => setIsCreatePOModalOpen(false)}
        title="Create New Purchase Order"
        size="lg"
      >
        <form onSubmit={handleCreatePO} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Supplier *</label>
              <select
                className="select w-full"
                value={poForm.supplier}
                onChange={(e) => setPOForm({ ...poForm, supplier: e.target.value })}
                required
              >
                <option value="">Select Supplier</option>
                <option value="BeautySupply Co">BeautySupply Co</option>
                <option value="SkinCare Inc">SkinCare Inc</option>
                <option value="Global Cosmetics">Global Cosmetics</option>
                <option value="PureGlow Wholesale">PureGlow Wholesale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Expected Delivery *</label>
              <Input
                type="date"
                value={poForm.expectedDelivery}
                onChange={(e) => setPOForm({ ...poForm, expectedDelivery: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-white/80">Order Items *</label>
              <Button type="button" variant="secondary" size="sm" onClick={addPOItem}>
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {poItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <Input
                    type="text"
                    placeholder="Product name"
                    value={item.product}
                    onChange={(e) => updatePOItem(index, 'product', e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updatePOItem(index, 'quantity', e.target.value)}
                    required
                    min="1"
                    className="w-24"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => updatePOItem(index, 'unitPrice', e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-28"
                  />
                  {poItems.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removePOItem(index)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white/80">Estimated Total</span>
              <span className="text-xl font-bold text-success-400">
                ${calculatePOTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Notes</label>
            <textarea
              className="textarea w-full"
              rows="3"
              value={poForm.notes}
              onChange={(e) => setPOForm({ ...poForm, notes: e.target.value })}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Create Purchase Order
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreatePOModalOpen(false);
                setPOForm({ supplier: '', expectedDelivery: '', notes: '' });
                setPOItems([{ product: '', quantity: '', unitPrice: '' }]);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StockManagerDashboard;
