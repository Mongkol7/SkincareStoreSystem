import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import {
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const Batches = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock batch data
  const batches = [
    {
      id: 1,
      batchNumber: 'BATCH-001',
      date: '2025-12-28',
      openTime: '09:00 AM',
      closeTime: '05:00 PM',
      openingCash: 500.00,
      closingCash: 2450.75,
      totalSales: 1950.75,
      transactions: 45,
      status: 'Closed',
      cashier: 'John Doe'
    },
    {
      id: 2,
      batchNumber: 'BATCH-002',
      date: '2025-12-27',
      openTime: '09:00 AM',
      closeTime: '05:00 PM',
      openingCash: 500.00,
      closingCash: 2780.50,
      totalSales: 2280.50,
      transactions: 52,
      status: 'Closed',
      cashier: 'John Doe'
    },
    {
      id: 3,
      batchNumber: 'BATCH-003',
      date: '2025-12-26',
      openTime: '09:00 AM',
      closeTime: '05:00 PM',
      openingCash: 500.00,
      closingCash: 2156.25,
      totalSales: 1656.25,
      transactions: 38,
      status: 'Closed',
      cashier: 'John Doe'
    },
    {
      id: 4,
      batchNumber: 'BATCH-004',
      date: '2025-12-25',
      openTime: '09:00 AM',
      closeTime: '02:00 PM',
      openingCash: 500.00,
      closingCash: 1890.00,
      totalSales: 1390.00,
      transactions: 28,
      status: 'Closed',
      cashier: 'John Doe'
    },
  ];

  const columns = [
    { field: 'batchNumber', label: 'Batch #' },
    { field: 'date', label: 'Date' },
    {
      field: 'openTime',
      label: 'Open',
      render: (value) => (
        <span className="text-white/70 text-sm">{value}</span>
      ),
    },
    {
      field: 'closeTime',
      label: 'Close',
      render: (value) => (
        <span className="text-white/70 text-sm">{value}</span>
      ),
    },
    {
      field: 'openingCash',
      label: 'Opening Cash',
      render: (value) => (
        <span className="text-white/80">${value.toFixed(2)}</span>
      ),
    },
    {
      field: 'totalSales',
      label: 'Total Sales',
      render: (value) => (
        <span className="font-semibold text-success-400">${value.toFixed(2)}</span>
      ),
    },
    {
      field: 'closingCash',
      label: 'Closing Cash',
      render: (value) => (
        <span className="font-semibold text-white">${value.toFixed(2)}</span>
      ),
    },
    { field: 'transactions', label: 'Transactions' },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${value === 'Closed' ? 'badge-success' : 'badge-primary'}`}>
          {value}
        </span>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',
      render: () => (
        <Button variant="secondary" size="sm">
          View Details
        </Button>
      ),
    },
  ];

  // Calculate summary stats
  const totalSales = batches.reduce((sum, b) => sum + b.totalSales, 0);
  const totalTransactions = batches.reduce((sum, b) => sum + b.transactions, 0);
  const avgSalesPerBatch = totalSales / batches.length;

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
                My Batches
              </h2>
              <p className="text-white/60 text-sm">
                View your batch history and performance
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <ClockIcon className="w-5 h-5 text-primary-400" />
                  <p className="text-xs text-white/60">Total Batches</p>
                </div>
                <p className="text-2xl font-bold text-white">{batches.length}</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-success-400" />
                  <p className="text-xs text-white/60">Total Sales</p>
                </div>
                <p className="text-2xl font-bold text-success-400">${totalSales.toFixed(2)}</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircleIcon className="w-5 h-5 text-primary-400" />
                  <p className="text-xs text-white/60">Total Transactions</p>
                </div>
                <p className="text-2xl font-bold text-white">{totalTransactions}</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-warning-400" />
                  <p className="text-xs text-white/60">Avg. Sales/Batch</p>
                </div>
                <p className="text-2xl font-bold text-warning-400">${avgSalesPerBatch.toFixed(2)}</p>
              </div>
            </div>

            {/* Batches Table */}
            <Card>
              <CardHeader
                title="Batch History"
                action={
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      This Week
                    </Button>
                    <Button variant="secondary" size="sm">
                      This Month
                    </Button>
                  </div>
                }
              />
              <Table columns={columns} data={batches} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batches;
