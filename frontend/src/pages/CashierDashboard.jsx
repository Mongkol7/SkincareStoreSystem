import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const CashierDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock data - replace with actual API calls
  const currentBatch = {
    batch_id: 1,
    batch_code: 'BTH-20231228-001',
    status: 'Open',
    opening_cash: 500.00,
    total_sales: 2450.50,
    transaction_count: 15,
  };

  const todayStats = {
    sales: 2450.50,
    transactions: 15,
    avgTransaction: 163.37,
  };

  // Mock recent transactions
  const recentTransactions = [
    {
      id: 1,
      invoice_number: 'INV-2025-001',
      date: '2025-12-30',
      time: '10:30 AM',
      customer: 'Walk-in Customer',
      payment_method: 'Cash',
      total: 156.50,
      items: [
        { name: 'Hydrating Cleanser', quantity: 2, price: 24.99 },
        { name: 'Vitamin C Serum', quantity: 1, price: 45.00 },
        { name: 'Moisturizing Cream', quantity: 2, price: 32.50 },
      ],
      status: 'Completed',
    },
    {
      id: 2,
      invoice_number: 'INV-2025-002',
      date: '2025-12-30',
      time: '11:15 AM',
      customer: 'Sarah Johnson',
      payment_method: 'Card',
      total: 89.99,
      items: [
        { name: 'Sunscreen SPF 50', quantity: 2, price: 28.00 },
        { name: 'Face Mask Pack', quantity: 2, price: 15.99 },
      ],
      status: 'Completed',
    },
    {
      id: 3,
      invoice_number: 'INV-2025-003',
      date: '2025-12-30',
      time: '12:45 PM',
      customer: 'Walk-in Customer',
      payment_method: 'Cash',
      total: 67.00,
      items: [
        { name: 'Toner Essence', quantity: 2, price: 22.00 },
        { name: 'Hydrating Cleanser', quantity: 1, price: 24.99 },
      ],
      status: 'Completed',
    },
    {
      id: 4,
      invoice_number: 'INV-2025-004',
      date: '2025-12-30',
      time: '02:20 PM',
      customer: 'Michael Chen',
      payment_method: 'Mobile',
      total: 122.50,
      items: [
        { name: 'Vitamin C Serum', quantity: 1, price: 45.00 },
        { name: 'Moisturizing Cream', quantity: 1, price: 32.50 },
        { name: 'Sunscreen SPF 50', quantity: 1, price: 28.00 },
        { name: 'Toner Essence', quantity: 1, price: 22.00 },
      ],
      status: 'Completed',
    },
    {
      id: 5,
      invoice_number: 'INV-2025-005',
      date: '2025-12-30',
      time: '03:50 PM',
      customer: 'Walk-in Customer',
      payment_method: 'Cash',
      total: 75.98,
      items: [
        { name: 'Face Mask Pack', quantity: 3, price: 15.99 },
        { name: 'Sunscreen SPF 50', quantity: 1, price: 28.00 },
      ],
      status: 'Completed',
    },
  ];

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

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

          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h2>
            <p className="text-white/60 text-sm">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

          {/* Current Batch Status */}
            {currentBatch.status === 'Open' ? (
              <div className="glass-card p-6 mb-6 border-2 border-success-500/30">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-success-300">
                        Batch Active
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {currentBatch.batch_code}
                    </h3>
                    <p className="text-white/60 text-sm">
                      Opening Cash: ${currentBatch.opening_cash.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="glass"
                      onClick={() => navigate('/cashier/sales')}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      New Sale
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => navigate('/cashier/close-batch')}
                      size="sm"
                    >
                      Close Batch
                    </Button>
                  </div>
              </div>
              </div>
            ) : (
              <div className="glass-card p-6 mb-6 text-center">
                <ClockIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  No Active Batch
                </h3>
                <p className="text-white/60 mb-4 text-sm">
                  Start a new batch to begin processing sales
              </p>
                <Button
                  variant="success"
                  onClick={() => navigate('/cashier/open-batch')}
                  className="mx-auto"
                >
                  Open New Batch
                </Button>
              </div>
            )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard
                icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
                label="Today's Sales"
                value={`$${todayStats.sales.toFixed(2)}`}
                trend="up"
                trendValue="12%"
              />
            <StatsCard
                icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
                label="Transactions"
                value={todayStats.transactions}
                trend="up"
                trendValue="8%"
              />
            <StatsCard
                icon={<ChartBarIcon className="w-6 h-6 text-white" />}
                label="Avg Transaction"
                value={`$${todayStats.avgTransaction.toFixed(2)}`}
              />
            </div>

          {/* Recent Transactions */}
          <Card>
              <div className="card-header">
                <h3 className="card-title">Recent Transactions</h3>
              </div>

              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-medium text-white">
                          {transaction.invoice_number}
                        </p>
                        <Badge variant="glass" className="text-xs">
                          {transaction.payment_method}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/60">
                        {transaction.time} • {transaction.customer}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">
                          ${transaction.total.toFixed(2)}
                        </p>
                        <Badge variant="success" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>

      {/* View Transaction Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Transaction Details"
        size="lg"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Transaction Info */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Transaction Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Invoice Number</p>
                  <p className="text-sm text-white font-medium">{selectedTransaction.invoice_number}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Date & Time</p>
                  <p className="text-sm text-white font-medium">{selectedTransaction.date} at {selectedTransaction.time}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Customer</p>
                  <p className="text-sm text-white font-medium">{selectedTransaction.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Payment Method</p>
                  <Badge variant="glass">{selectedTransaction.payment_method}</Badge>
                </div>
              </div>
            </div>

            {/* Items Purchased */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Items Purchased</h3>
              <div className="space-y-3">
                {selectedTransaction.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-sm text-white font-medium">{item.name}</p>
                      <p className="text-xs text-white/60">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-bold text-white">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/80">
                  <span>Subtotal:</span>
                  <span>${selectedTransaction.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/80">
                  <span>Tax:</span>
                  <span>$0.00</span>
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total Paid:</span>
                  <span>${selectedTransaction.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-white/60">Status:</span>
                  <Badge variant="success">{selectedTransaction.status}</Badge>
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

export default CashierDashboard;
