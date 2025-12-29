import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card, { CardHeader } from '../components/common/Card';
import Tabs from '../components/common/Tabs';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock data
  const stats = {
    todaySales: 12450.50,
    transactions: 89,
    activeStaff: 12,
    lowStockItems: 5,
  };

  const recentTransactions = [
    { id: 1, invoice: 'INV-001', cashier: 'John Doe', amount: 150.00, status: 'Completed', time: '10:30 AM' },
    { id: 2, invoice: 'INV-002', cashier: 'Jane Smith', amount: 250.50, status: 'Completed', time: '10:45 AM' },
    { id: 3, invoice: 'INV-003', cashier: 'John Doe', amount: 89.99, status: 'Completed', time: '11:00 AM' },
    { id: 4, invoice: 'INV-004', cashier: 'Mike Johnson', amount: 320.00, status: 'Refunded', time: '11:15 AM' },
  ];

  const lowStockProducts = [
    { id: 1, name: 'Vitamin C Serum', stock: 5, min_stock: 10, category: 'Serum' },
    { id: 2, name: 'Hydrating Cleanser', stock: 3, min_stock: 15, category: 'Cleanser' },
    { id: 3, name: 'Sunscreen SPF 50', stock: 8, min_stock: 20, category: 'Sunscreen' },
  ];

  const transactionColumns = [
    { field: 'invoice', label: 'Invoice' },
    { field: 'cashier', label: 'Cashier' },
    {
      field: 'amount',
      label: 'Amount',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${value === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
          {value}
        </span>
      ),
    },
    { field: 'time', label: 'Time' },
  ];

  const productColumns = [
    { field: 'name', label: 'Product' },
    { field: 'category', label: 'Category' },
    {
      field: 'stock',
      label: 'Stock',
      render: (value, row) => (
        <span className="text-danger-400 font-semibold">
          {value} / {row.min_stock}
        </span>
      ),
    },
  ];

  const tabContent = [
    {
      label: 'Transactions',
      icon: <ShoppingCartIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader title="Recent Transactions" />
          <Table columns={transactionColumns} data={recentTransactions} />
        </Card>
      ),
    },
    {
      label: 'Low Stock',
      icon: <CubeIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader
            title="Low Stock Products"
            action={
              <Button variant="warning" size="sm">
                Create PO
              </Button>
            }
          />
          <Table columns={productColumns} data={lowStockProducts} />
        </Card>
      ),
    },
    {
      label: 'Analytics',
      icon: <ChartBarIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader title="Sales Analytics" />
          <div className="h-64 flex items-center justify-center">
            <p className="text-white/60 text-sm">Analytics chart coming soon...</p>
          </div>
        </Card>
      ),
    },
  ];

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
                Admin Dashboard
              </h2>
              <p className="text-white/60 text-sm">
                Monitor and manage all system activities
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
                label="Today's Sales"
                value={`$${stats.todaySales.toLocaleString()}`}
                trend="up"
                trendValue="12%"
              />
              <StatsCard
                icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
                label="Transactions"
                value={stats.transactions}
                trend="up"
                trendValue="8%"
              />
              <StatsCard
                icon={<UsersIcon className="w-6 h-6 text-white" />}
                label="Active Staff"
                value={stats.activeStaff}
              />
              <StatsCard
                icon={<CubeIcon className="w-6 h-6 text-white" />}
                label="Low Stock Items"
                value={stats.lowStockItems}
                trend="down"
                trendValue="2"
              />
            </div>

            {/* Tabs */}
            <Tabs tabs={tabContent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
