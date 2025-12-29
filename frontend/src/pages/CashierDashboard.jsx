import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
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
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        INV-{Date.now() + item}
                      </p>
                      <p className="text-xs text-white/60">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        ${(Math.random() * 200 + 50).toFixed(2)}
                      </p>
                      <span className="badge badge-success text-xs">Completed</span>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;
