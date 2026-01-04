import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePO } from '../context/POContext';
import { useProducts } from '../context/ProductContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { MagnifyingGlassIcon, PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PurchaseOrders = () => {
  const { user } = useAuth();
  const { openCreatePOModal, purchaseOrders, setPurchaseOrders, updatePurchaseOrder } = usePO();
  const { products, updateProduct } = useProducts();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);



  // Filter and sort purchase orders (latest on top)
  const filteredPOs = useMemo(() => {
    return purchaseOrders
      .filter(po => {
        const matchesSearch =
          po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || po.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)); // Latest first
  }, [purchaseOrders, searchTerm, filterStatus]);

  // Handle view PO
  const handleViewPO = (po) => {
    setSelectedPO(po);
    setIsViewModalOpen(true);
  };

  // Handle approve PO
  const handleApprovePO = async (po) => {
    if (window.confirm(`Approve Purchase Order ${po.poNumber}?\n\nThis will authorize the order for ${po.supplier} with total amount of $${po.totalAmount.toFixed(2)}.`)) {
      try {
        const updatedPO = await updatePurchaseOrder(po.id, {
          status: 'Approved',
          approvedBy: user?.username || 'Current User'
        });
        // Update modal if open
        if (selectedPO?.id === po.id) {
          setSelectedPO(updatedPO);
        }
        alert(`✓ Purchase Order ${po.poNumber} has been approved!`);
      } catch (error) {
        alert('Failed to approve purchase order. Please try again.');
      }
    }
  };

  // Handle cancel PO
  const handleCancelPO = async (po) => {
    if (window.confirm(`Cancel Purchase Order ${po.poNumber}?\n\nThis action cannot be undone.`)) {
      try {
        await updatePurchaseOrder(po.id, { status: 'Cancelled' });
        // Close modal if open
        if (selectedPO?.id === po.id) {
          setIsViewModalOpen(false);
          setSelectedPO(null);
        }
        alert(`✓ Purchase Order ${po.poNumber} has been cancelled.`);
      } catch (error) {
        alert('Failed to cancel purchase order. Please try again.');
      }
    }
  };

  // Handle mark as received
  const handleMarkAsReceived = async (po) => {
    if (window.confirm(`Mark Purchase Order ${po.poNumber} as Received?\n\nThis confirms that all items have been received and added to inventory.`)) {
      try {
        // Mark PO as received
        const updatedPO = await updatePurchaseOrder(po.id, { status: 'Received' });

        // Auto-restock: Update product stock for each item in the PO
        for (const item of po.itemsList) {
          // Find product by name
          const product = products.find(p => p.name === item.product);

          if (product) {
            // Calculate new stock
            const newStock = product.stock + item.quantity;

            // Determine new status based on stock levels
            let newStatus = 'Active';
            if (newStock <= 0) {
              newStatus = 'Out of Stock';
            } else if (newStock < product.min_stock) {
              newStatus = 'Low Stock';
            }

            // Update product
            await updateProduct({
              ...product,
              stock: newStock,
              status: newStatus
            });
          }
        }

        // Update modal if open
        if (selectedPO?.id === po.id) {
          setSelectedPO(updatedPO);
        }

        alert(`✓ Purchase Order ${po.poNumber} has been marked as received!\n✓ Product stock has been updated automatically.`);
      } catch (error) {
        console.error('Error marking PO as received:', error);
        alert('Failed to mark purchase order as received. Please try again.');
      }
    }
  };

  const columns = [
    {
      field: 'actions',
      label: 'Actions',
      render: (_, row) => {
        const isAdmin = user?.roles?.some(role => role.name === 'Admin');

        return (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleViewPO(row)} title="View Details">
              View
            </Button>
            {/* Only Admin can approve/reject pending POs */}
            {isAdmin && row.status === 'Pending' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprovePO(row)}
                  title="Approve Purchase Order"
                >
                  <CheckIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleCancelPO(row)}
                  title="Reject Purchase Order"
                >
                  <XMarkIcon className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
    { field: 'poNumber', label: 'PO Number' },
    { field: 'supplier', label: 'Supplier' },
    {
      field: 'itemsList',
      label: 'Products',
      render: (itemsList) => (
        <div className="text-white/80 text-sm">
          {itemsList && itemsList.length > 0 ? (
            itemsList.length === 1 ? (
              <span>{itemsList[0].product}</span>
            ) : (
              <span>{itemsList[0].product} +{itemsList.length - 1} more</span>
            )
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    { field: 'date', label: 'Order Date' },
    {
      field: 'itemsList',
      label: 'Qty',
      render: (itemsList) => {
        const totalQty = (itemsList || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
        return <span className="text-white/80">{totalQty}</span>;
      }
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
          value === 'Received' ? 'badge-success' :
          value === 'Approved' || value === 'In Transit' ? 'badge-primary' :
          value === 'Pending' ? 'badge-warning' :
          'badge-danger'
        }`}>
          {value}
        </span>
      ),
    },
    {
      field: 'markReceived',
      label: 'Receive',
      render: (_, row) => {
        // Show Mark as Received button only for Approved POs
        if (row.status === 'Approved') {
          return (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleMarkAsReceived(row)}
              title="Mark as Received"
            >
              Mark Received
            </Button>
          );
        }
        return <span className="text-white/40 text-sm">-</span>;
      },
    },
  ];

  // Calculate summary stats
  const pendingPOs = purchaseOrders.filter(po => po.status === 'Pending').length;
  const inTransitPOs = purchaseOrders.filter(po => po.status === 'In Transit').length;
  const totalValue = purchaseOrders
    .filter(po => po.status !== 'Cancelled')
    .reduce((sum, po) => sum + po.totalAmount, 0);

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
                    <Button variant="primary" size="sm" onClick={() => openCreatePOModal()}>
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
              {/* Only Admin can approve/reject pending POs */}
              {user?.roles?.some(role => role.name === 'Admin') && selectedPO.status === 'Pending' && (
                <>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleApprovePO(selectedPO)}
                  >
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Approve PO
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleCancelPO(selectedPO)}
                  >
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Reject PO
                  </Button>
                </>
              )}
              {/* Stock Manager can mark approved POs as received */}
              {selectedPO.status === 'Approved' && (
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={() => handleMarkAsReceived(selectedPO)}
                >
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Mark as Received
                </Button>
              )}
              <Button
                variant="secondary"
                className={selectedPO.status === 'Pending' || selectedPO.status === 'Approved' ? '' : 'flex-1'}
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PurchaseOrders;
