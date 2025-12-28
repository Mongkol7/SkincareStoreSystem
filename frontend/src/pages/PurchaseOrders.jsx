import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const PurchaseOrders = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock purchase order data
  const purchaseOrders = [
    {
      id: 1,
      poNumber: 'PO-2025-001',
      supplier: 'GlowSkin Supplies',
      date: '2025-12-28',
      items: 15,
      totalAmount: 2450.00,
      status: 'Pending',
      expectedDelivery: '2025-12-30'
    },
    {
      id: 2,
      poNumber: 'PO-2025-002',
      supplier: 'PureGlow Wholesale',
      date: '2025-12-27',
      items: 22,
      totalAmount: 3780.50,
      status: 'Approved',
      expectedDelivery: '2025-12-29'
    },
    {
      id: 3,
      poNumber: 'PO-2025-003',
      supplier: 'SunShield Distributors',
      date: '2025-12-26',
      items: 18,
      totalAmount: 1995.00,
      status: 'Delivered',
      expectedDelivery: '2025-12-28'
    },
    {
      id: 4,
      poNumber: 'PO-2025-004',
      supplier: 'HydraPlus Corp',
      date: '2025-12-25',
      items: 30,
      totalAmount: 5240.75,
      status: 'In Transit',
      expectedDelivery: '2025-12-31'
    },
    {
      id: 5,
      poNumber: 'PO-2025-005',
      supplier: 'YouthGlow International',
      date: '2025-12-24',
      items: 12,
      totalAmount: 1680.00,
      status: 'Cancelled',
      expectedDelivery: '-'
    },
  ];

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
          <Button variant="secondary" size="sm">
            View
          </Button>
          {row.status === 'Pending' && (
            <Button variant="primary" size="sm">
              Approve
            </Button>
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
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            userRole={user?.roles?.[0]?.name}
          />

          <div className="flex-1 min-w-0">
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
                action={
                  <div className="flex gap-3">
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
                    <Button variant="primary" size="sm">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create PO
                    </Button>
                  </div>
                }
              />
              <Table columns={columns} data={purchaseOrders} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrders;
