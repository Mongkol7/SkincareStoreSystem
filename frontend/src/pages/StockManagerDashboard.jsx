import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const StockManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    { id: 1, po_number: 'PO-001', supplier: 'BeautySupply Co', items: 5, total: 1250.00, status: 'Pending', date: '2023-12-20' },
    { id: 2, po_number: 'PO-002', supplier: 'SkinCare Inc', items: 3, total: 850.00, status: 'Approved', date: '2023-12-22' },
    { id: 3, po_number: 'PO-003', supplier: 'Global Cosmetics', items: 8, total: 2100.00, status: 'Received', date: '2023-12-25' },
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
      render: (value) => (
        <Button variant="primary" size="sm">
          Create PO
        </Button>
      ),
    },
  ];

  const poColumns = [
    { field: 'po_number', label: 'PO Number' },
    { field: 'supplier', label: 'Supplier' },
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
                  <Button variant="warning" size="sm">
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
                    onClick={() => navigate('/stock-manager/create-po')}
                  >
                    Create New PO
                  </Button>
                }
              />
              <Table
                columns={poColumns}
                data={purchaseOrders}
                onRowClick={(row) => navigate(`/stock-manager/po/${row.id}`)}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagerDashboard;
