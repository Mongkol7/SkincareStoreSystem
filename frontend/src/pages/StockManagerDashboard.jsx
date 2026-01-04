import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePO } from '../context/POContext';
import { useProducts } from '../context/ProductContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ReorderModal from '../components/stockManager/ReorderModal';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const StockManagerDashboard = () => {
  const { user } = useAuth();
  const { openCreatePOModal, purchaseOrders, handleReorder: createReorderPO, updatePurchaseOrder } = usePO();
  const { products, updateProduct } = useProducts();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isViewPOModalOpen, setIsViewPOModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reorderForm, setReorderForm] = useState({
    quantity: '',
    expectedDelivery: '',
  });

  // Get low stock products from real data
  const lowStockProducts = products.filter(p => p.stock < p.min_stock);

  const stats = {
    totalProducts: products.length,
    lowStock: lowStockProducts.length,
    pendingPO: purchaseOrders.filter(po => po.status === 'Pending').length,
    receivedToday: purchaseOrders.filter(po => {
      const today = new Date().toISOString().split('T')[0];
      return po.status === 'Received' && po.date?.startsWith(today);
    }).length,
  };

  // Check if a product has pending orders
  const getProductOrderStatus = (productName) => {
    const pendingOrders = purchaseOrders.filter(po =>
      (po.status === 'Pending' || po.status === 'Approved') &&
      po.itemsList?.some(item => item.product === productName)
    );

    if (pendingOrders.length > 0) {
      const nearestPO = pendingOrders.sort((a, b) =>
        new Date(a.expectedDelivery) - new Date(b.expectedDelivery)
      )[0];
      return {
        isOrdered: true,
        expectedDate: nearestPO.expectedDelivery,
        status: nearestPO.status
      };
    }
    return { isOrdered: false };
  };

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
    {
      field: 'supplier',
      label: 'Supplier',
      render: (value, row) => {
        const orderStatus = getProductOrderStatus(row.name);
        return (
          <div className="flex flex-col gap-1">
            <span className="text-white/80">{value}</span>
            {orderStatus.isOrdered && (
              <span className={`text-xs px-2 py-0.5 rounded-full inline-block w-fit ${
                orderStatus.status === 'Pending'
                  ? 'bg-warning-500/20 text-warning-400'
                  : 'bg-primary-500/20 text-primary-400'
              }`}>
                {orderStatus.status === 'Pending' ? '⏳ Pending' : '✓ Ordered'} - ETA: {orderStatus.expectedDate}
              </span>
            )}
          </div>
        );
      }
    },
    {
      field: 'id',
      label: 'Action',
      render: (value, row) => {
        const orderStatus = getProductOrderStatus(row.name);
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedProduct(row);
              setReorderForm({
                quantity: row.min_stock - row.stock,
                expectedDelivery: '',
              });
              setIsReorderModalOpen(true);
            }}
            disabled={orderStatus.isOrdered}
            title={orderStatus.isOrdered ? 'Product already ordered' : 'Reorder this product'}
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            {orderStatus.isOrdered ? 'Ordered' : 'Reorder'}
          </Button>
        );
      },
    },
  ];

  // Handler for REORDER - directly creates PO for existing products (no unit price needed)
  const handleReorderSubmit = (e) => {
    e.preventDefault();

    // Use POContext's handleReorder to create the PO
    const newPO = createReorderPO(
      selectedProduct,
      reorderForm.quantity,
      reorderForm.expectedDelivery
    );

    setIsReorderModalOpen(false);
    setReorderForm({
      quantity: '',
      expectedDelivery: '',
    });
    alert(`✓ Reorder created! PO ${newPO.poNumber} is pending Admin approval.`);
  };

  // Handler for CREATE BULK PO - opens modal for NEW products (requires unit price)
  const handleCreateBulkPO = () => {
    // This is for ordering NEW products - need to specify unit price
    const items = lowStockProducts.map(product => ({
      product: product.name,
      quantity: product.min_stock - product.stock,
      unitPrice: ''
    }));
    openCreatePOModal(items);
  };

  // Handle mark as received for Stock Manager
  const handleMarkAsReceived = async (po) => {
    if (window.confirm(`Mark Purchase Order ${po.poNumber} as Received?\n\nThis confirms that all items have been received and added to inventory.`)) {
      try {
        // Mark PO as received
        await updatePurchaseOrder(po.id, { status: 'Received' });

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

        alert(`✓ Purchase Order ${po.poNumber} has been marked as received!\n✓ Product stock has been updated automatically.`);
        // Refresh will happen automatically via POContext polling
      } catch (error) {
        console.error('Error marking PO as received:', error);
        alert('Failed to mark purchase order as received. Please try again.');
      }
    }
  };

  const poColumns = [
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
    {
      field: 'items',
      label: 'Qty',
      render: (value) => <span className="text-white/80">{value}</span>
    },
    {
      field: 'totalAmount',
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
      field: 'markReceived',
      label: 'Receive',
      render: (_, row) => {
        if (row.status === 'Approved') {
          return (
            <Button
              variant="success"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsReceived(row);
              }}
              title="Mark as Received"
            >
              Mark Received
            </Button>
          );
        }
        return <span className="text-white/40 text-sm">-</span>;
      },
    },
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
              Stock Manager Dashboard - Inventory Management
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
                  onClick={handleCreateBulkPO}
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
                  onClick={() => openCreatePOModal()}
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
                  <p className="text-sm text-white font-medium">{selectedPO.poNumber}</p>
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
                  <p className="text-xs text-white/60 mb-1">Expected Delivery</p>
                  <p className="text-sm text-white font-medium">{selectedPO.expectedDelivery}</p>
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
                <div>
                  <p className="text-xs text-white/60 mb-1">Created By</p>
                  <p className="text-sm text-white font-medium">{selectedPO.createdBy}</p>
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

            {/* Total and Notes */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Total Amount</span>
                <span className="text-2xl font-bold text-success-400">
                  ${selectedPO.totalAmount.toFixed(2)}
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


      {/* Reorder Product Modal - For RESTOCKING existing products */}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        product={selectedProduct}
        formData={reorderForm}
        onFormChange={setReorderForm}
        onSubmit={handleReorderSubmit}
      />
    </div>
  );
};

export default StockManagerDashboard;
