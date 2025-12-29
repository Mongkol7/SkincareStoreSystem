import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { MagnifyingGlassIcon, PlusIcon, CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

const PurchaseOrders = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [poItems, setPOItems] = useState([{ product: '', quantity: '', unitPrice: '' }]);

  // Mock purchase order data with detailed items
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 1,
      poNumber: 'PO-2025-001',
      supplier: 'GlowSkin Supplies',
      date: '2025-12-28',
      items: 15,
      totalAmount: 2450.00,
      status: 'Pending',
      expectedDelivery: '2025-12-30',
      itemsList: [
        { product: 'Moisturizing Cream 50ml', quantity: 10, unitPrice: 180.00 },
        { product: 'Sunscreen SPF 50 75ml', quantity: 5, unitPrice: 130.00 }
      ],
      notes: 'Urgent restock needed',
      createdBy: 'Admin User',
      approvedBy: null
    },
    {
      id: 2,
      poNumber: 'PO-2025-002',
      supplier: 'PureGlow Wholesale',
      date: '2025-12-27',
      items: 22,
      totalAmount: 3780.50,
      status: 'Approved',
      expectedDelivery: '2025-12-29',
      itemsList: [
        { product: 'Face Wash 200ml', quantity: 12, unitPrice: 95.00 },
        { product: 'Night Serum 30ml', quantity: 10, unitPrice: 264.05 }
      ],
      notes: '',
      createdBy: 'Admin User',
      approvedBy: 'Manager User'
    },
    {
      id: 3,
      poNumber: 'PO-2025-003',
      supplier: 'SunShield Distributors',
      date: '2025-12-26',
      items: 18,
      totalAmount: 1995.00,
      status: 'Delivered',
      expectedDelivery: '2025-12-28',
      itemsList: [
        { product: 'Eye Cream 15ml', quantity: 8, unitPrice: 120.00 },
        { product: 'Toner 150ml', quantity: 10, unitPrice: 75.50 }
      ],
      notes: 'Delivered on time',
      createdBy: 'Stock Manager',
      approvedBy: 'Admin User'
    },
    {
      id: 4,
      poNumber: 'PO-2025-004',
      supplier: 'HydraPlus Corp',
      date: '2025-12-25',
      items: 30,
      totalAmount: 5240.75,
      status: 'In Transit',
      expectedDelivery: '2025-12-31',
      itemsList: [
        { product: 'Anti-Aging Cream 50ml', quantity: 15, unitPrice: 285.00 },
        { product: 'Vitamin C Serum 30ml', quantity: 15, unitPrice: 64.05 }
      ],
      notes: 'Large order for year-end stock',
      createdBy: 'Stock Manager',
      approvedBy: 'Admin User'
    },
    {
      id: 5,
      poNumber: 'PO-2025-005',
      supplier: 'YouthGlow International',
      date: '2025-12-24',
      items: 12,
      totalAmount: 1680.00,
      status: 'Cancelled',
      expectedDelivery: '-',
      itemsList: [
        { product: 'Cleanser Set', quantity: 12, unitPrice: 140.00 }
      ],
      notes: 'Cancelled due to supplier unavailability',
      createdBy: 'Stock Manager',
      approvedBy: null
    },
  ]);

  const [formData, setFormData] = useState({
    supplier: '',
    expectedDelivery: '',
    notes: ''
  });

  // Filter purchase orders
  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter(po => {
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || po.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, searchTerm, filterStatus]);

  // Handle view PO
  const handleViewPO = (po) => {
    setSelectedPO(po);
    setIsViewModalOpen(true);
  };

  // Handle approve PO
  const handleApprovePO = (po) => {
    setPurchaseOrders(purchaseOrders.map(p =>
      p.id === po.id
        ? { ...p, status: 'Approved', approvedBy: user?.username || 'Current User' }
        : p
    ));
  };

  // Handle cancel PO
  const handleCancelPO = (po) => {
    if (window.confirm('Are you sure you want to cancel this purchase order?')) {
      setPurchaseOrders(purchaseOrders.map(p =>
        p.id === po.id ? { ...p, status: 'Cancelled' } : p
      ));
    }
  };

  // Handle create PO
  const handleCreatePO = (e) => {
    e.preventDefault();
    const totalItems = poItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    const totalAmount = poItems.reduce((sum, item) =>
      sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);

    const newPO = {
      id: purchaseOrders.length + 1,
      poNumber: `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplier: formData.supplier,
      date: new Date().toISOString().split('T')[0],
      items: totalItems,
      totalAmount: totalAmount,
      status: 'Pending',
      expectedDelivery: formData.expectedDelivery,
      itemsList: poItems.map(item => ({
        product: item.product,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice)
      })),
      notes: formData.notes,
      createdBy: user?.username || 'Current User',
      approvedBy: null
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({ supplier: '', expectedDelivery: '', notes: '' });
    setPOItems([{ product: '', quantity: '', unitPrice: '' }]);
  };

  // Add item to PO
  const addPOItem = () => {
    setPOItems([...poItems, { product: '', quantity: '', unitPrice: '' }]);
  };

  // Remove item from PO
  const removePOItem = (index) => {
    setPOItems(poItems.filter((_, i) => i !== index));
  };

  // Update item
  const updatePOItem = (index, field, value) => {
    const newItems = [...poItems];
    newItems[index][field] = value;
    setPOItems(newItems);
  };

  const columns = [
    { field: 'poNumber', label: 'PO Number' },
    { field: 'supplier', label: 'Supplier' },
    { field: 'date', label: 'Order Date' },
    {
      field: 'items',
      label: 'Items',
      render: (value) => <span className="text-white/80">{value} items</span>
    },
    {
      field: 'totalAmount',
      label: 'Total Amount',
      render: (value) => <span className="font-semibold text-white">${value.toFixed(2)}</span>,
    },
    {
      field: 'expectedDelivery',
      label: 'Expected Delivery',
      render: (value) => <span className="text-white/70 text-sm">{value}</span>,
    },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${
          value === 'Delivered' ? 'badge-success' :
          value === 'Approved' || value === 'In Transit' ? 'badge-primary' :
          value === 'Pending' ? 'badge-warning' :
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
          <Button variant="secondary" size="sm" onClick={() => handleViewPO(row)}>
            View
          </Button>
          {row.status === 'Pending' && (
            <>
              <Button variant="primary" size="sm" onClick={() => handleApprovePO(row)}>
                <CheckIcon className="w-4 h-4" />
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleCancelPO(row)}>
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Calculate summary stats
  const pendingPOs = purchaseOrders.filter(po => po.status === 'Pending').length;
  const inTransitPOs = purchaseOrders.filter(po => po.status === 'In Transit').length;
  const totalValue = purchaseOrders
    .filter(po => po.status !== 'Cancelled')
    .reduce((sum, po) => sum + po.totalAmount, 0);

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
                Purchase Orders
              </h2>
              <p className="text-white/60 text-sm">
                Manage supplier orders and inventory restocking
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Total POs</p>
                <p className="text-2xl font-bold text-white">{purchaseOrders.length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Pending Approval</p>
                <p className="text-2xl font-bold text-warning-400">{pendingPOs}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">In Transit</p>
                <p className="text-2xl font-bold text-primary-400">{inTransitPOs}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-success-400">${totalValue.toFixed(2)}</p>
              </div>
            </div>

            {/* Purchase Orders Table */}
            <Card>
              <CardHeader
                title="All Purchase Orders"
                subtitle={`${filteredPOs.length} purchase orders`}
                action={
                  <div className="flex gap-3">
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-40"
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </Select>
                    <div className="relative">
                      <MagnifyingGlassIcon className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Search purchase orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create PO
                    </Button>
                  </div>
                }
              />
              <Table columns={columns} data={filteredPOs} />
            </Card>
          </div>
        </div>
      </div>

      {/* Create PO Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); resetForm(); }}
        title="Create New Purchase Order"
        size="lg"
      >
        <form onSubmit={handleCreatePO} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Supplier *</label>
              <Input
                required
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Enter supplier name"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Expected Delivery *</label>
              <Input
                type="date"
                required
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm text-white/60">Order Items *</label>
              <Button type="button" variant="ghost" size="sm" onClick={addPOItem}>
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {poItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <Input
                    required
                    placeholder="Product name"
                    value={item.product}
                    onChange={(e) => updatePOItem(index, 'product', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    required
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updatePOItem(index, 'quantity', e.target.value)}
                    className="w-24"
                  />
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updatePOItem(index, 'unitPrice', e.target.value)}
                    className="w-32"
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

          <div>
            <label className="block text-sm text-white/60 mb-2">Notes</label>
            <textarea
              className="input-field w-full min-h-[80px] resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Create Purchase Order
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* View PO Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Purchase Order Details"
        size="lg"
      >
        {selectedPO && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
              <div>
                <p className="text-sm text-white/60 mb-1">PO Number</p>
                <p className="text-lg font-semibold text-white">{selectedPO.poNumber}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Status</p>
                <span className={`badge ${
                  selectedPO.status === 'Delivered' ? 'badge-success' :
                  selectedPO.status === 'Approved' || selectedPO.status === 'In Transit' ? 'badge-primary' :
                  selectedPO.status === 'Pending' ? 'badge-warning' :
                  'badge-danger'
                }`}>
                  {selectedPO.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Supplier</p>
                <p className="text-white">{selectedPO.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Order Date</p>
                <p className="text-white">{selectedPO.date}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Expected Delivery</p>
                <p className="text-white">{selectedPO.expectedDelivery}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Created By</p>
                <p className="text-white">{selectedPO.createdBy}</p>
              </div>
              {selectedPO.approvedBy && (
                <div>
                  <p className="text-sm text-white/60 mb-1">Approved By</p>
                  <p className="text-white">{selectedPO.approvedBy}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedPO.itemsList.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 glass-card">
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.product}</p>
                      <p className="text-sm text-white/60">Unit Price: ${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                      <p className="text-white font-semibold">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-white pt-6 border-t border-white/10">
              <span>Total Amount</span>
              <span>${selectedPO.totalAmount.toFixed(2)}</span>
            </div>

            {selectedPO.notes && (
              <div className="p-4 glass-card">
                <p className="text-sm text-white/60 mb-1">Notes</p>
                <p className="text-white">{selectedPO.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {selectedPO.status === 'Pending' && (
                <>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      handleApprovePO(selectedPO);
                      setIsViewModalOpen(false);
                    }}
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Approve PO
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      handleCancelPO(selectedPO);
                      setIsViewModalOpen(false);
                    }}
                  >
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Cancel PO
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseOrders;
