import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import {
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const Batches = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'week', 'month'

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
      render: (_, row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBatch(row);
            setIsViewModalOpen(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  // Filter batches based on date
  const filterBatchesByDate = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (dateFilter === 'all') {
      return batches;
    }

    if (dateFilter === 'week') {
      // Get the start of the week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

      return batches.filter(batch => batch.date >= startOfWeekStr);
    }

    if (dateFilter === 'month') {
      // Get the start of the month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

      return batches.filter(batch => batch.date >= startOfMonthStr);
    }

    return batches;
  };

  const filteredBatches = filterBatchesByDate();

  // Calculate summary stats from filtered batches
  const totalSales = filteredBatches.reduce((sum, b) => sum + b.totalSales, 0);
  const totalTransactions = filteredBatches.reduce((sum, b) => sum + b.transactions, 0);
  const avgSalesPerBatch = filteredBatches.length > 0 ? totalSales / filteredBatches.length : 0;

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
              <p className="text-2xl font-bold text-white">{filteredBatches.length}</p>
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
                  <Button
                    variant={dateFilter === 'all' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setDateFilter('all')}
                  >
                    All Time
                  </Button>
                  <Button
                    variant={dateFilter === 'week' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setDateFilter('week')}
                  >
                    This Week
                  </Button>
                  <Button
                    variant={dateFilter === 'month' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setDateFilter('month')}
                  >
                    This Month
                  </Button>
                </div>
              }
            />
            <Table columns={columns} data={filteredBatches} />
          </Card>
        </div>
      </div>

      {/* View Batch Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Batch Details"
        size="lg"
      >
        {selectedBatch && (
          <div className="space-y-6">
            {/* Batch Information */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Batch Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Batch Number</p>
                  <p className="text-sm text-white font-medium">{selectedBatch.batchNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Date</p>
                  <p className="text-sm text-white font-medium">{selectedBatch.date}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Cashier</p>
                  <p className="text-sm text-white font-medium">{selectedBatch.cashier}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Status</p>
                  <span className={`badge ${selectedBatch.status === 'Closed' ? 'badge-success' : 'badge-primary'}`}>
                    {selectedBatch.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Information */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Operating Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Open Time</p>
                  <p className="text-sm text-white font-medium">{selectedBatch.openTime}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Close Time</p>
                  <p className="text-sm text-white font-medium">{selectedBatch.closeTime}</p>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Opening Cash</p>
                  <p className="text-lg text-white font-bold">${selectedBatch.openingCash.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Total Sales</p>
                  <p className="text-lg text-success-400 font-bold">${selectedBatch.totalSales.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Closing Cash</p>
                  <p className="text-lg text-white font-bold">${selectedBatch.closingCash.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Total Transactions</p>
                  <p className="text-lg text-white font-bold">{selectedBatch.transactions}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Average Transaction</p>
                  <p className="text-sm text-white font-medium">
                    ${(selectedBatch.totalSales / selectedBatch.transactions).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Cash Variance</p>
                  <p className="text-sm text-white font-medium">
                    ${(selectedBatch.closingCash - selectedBatch.openingCash - selectedBatch.totalSales).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Batches;
