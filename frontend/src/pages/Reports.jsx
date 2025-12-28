import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import StatsCard from '../components/common/StatsCard';
import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import Table from '../components/common/Table';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';

const Reports = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock data
  const salesData = [
    { id: 1, period: 'January 2025', sales: 45200, transactions: 342, avgSale: 132.16, growth: '+12%' },
    { id: 2, period: 'December 2024', sales: 40350, transactions: 315, avgSale: 128.10, growth: '+8%' },
    { id: 3, period: 'November 2024', sales: 37450, transactions: 298, avgSale: 125.67, growth: '+5%' },
    { id: 4, period: 'October 2024', sales: 35680, transactions: 285, avgSale: 125.19, growth: '+3%' },
  ];

  const productPerformance = [
    { id: 1, product: 'Vitamin C Serum', sold: 245, revenue: 11260.55, profit: 4504.22, margin: '40%' },
    { id: 2, product: 'Hyaluronic Acid Moisturizer', sold: 198, revenue: 10395.00, profit: 3118.50, margin: '30%' },
    { id: 3, product: 'Retinol Night Cream', sold: 156, revenue: 10608.00, profit: 4243.20, margin: '40%' },
    { id: 4, product: 'Sunscreen SPF 50', sold: 312, revenue: 10920.00, profit: 3276.00, margin: '30%' },
  ];

  const salesColumns = [
    { field: 'period', label: 'Period' },
    {
      field: 'sales',
      label: 'Total Sales',
      render: (value) => <span className="font-semibold text-white">${value.toLocaleString()}</span>,
    },
    { field: 'transactions', label: 'Transactions' },
    {
      field: 'avgSale',
      label: 'Avg. Sale',
      render: (value) => <span className="text-white/80">${value.toFixed(2)}</span>,
    },
    {
      field: 'growth',
      label: 'Growth',
      render: (value) => (
        <span className="text-success-400 font-semibold">{value}</span>
      ),
    },
  ];

  const productColumns = [
    { field: 'product', label: 'Product' },
    { field: 'sold', label: 'Units Sold' },
    {
      field: 'revenue',
      label: 'Revenue',
      render: (value) => <span className="font-semibold text-white">${value.toLocaleString()}</span>,
    },
    {
      field: 'profit',
      label: 'Profit',
      render: (value) => <span className="text-success-400">${value.toLocaleString()}</span>,
    },
    {
      field: 'margin',
      label: 'Margin',
      render: (value) => <span className="badge badge-success">{value}</span>,
    },
  ];

  const tabContent = [
    {
      label: 'Sales Report',
      icon: <CurrencyDollarIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader
            title="Monthly Sales Performance"
            action={
              <Button variant="primary" size="sm">
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Export
              </Button>
            }
          />
          <Table columns={salesColumns} data={salesData} />
        </Card>
      ),
    },
    {
      label: 'Product Performance',
      icon: <ShoppingCartIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader
            title="Top Selling Products"
            action={
              <Button variant="primary" size="sm">
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Export
              </Button>
            }
          />
          <Table columns={productColumns} data={productPerformance} />
        </Card>
      ),
    },
    {
      label: 'Analytics',
      icon: <ChartBarIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader title="Sales Analytics" />
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <ChartBarIcon className="w-20 h-20 text-white/20" />
            <p className="text-white/60 text-sm">Analytics charts coming soon...</p>
            <p className="text-white/40 text-xs">Advanced visualizations will be available here</p>
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
                Reports & Analytics
              </h2>
              <p className="text-white/60 text-sm">
                Track performance and generate business insights
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatsCard
                icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
                label="Total Revenue (MTD)"
                value="$45,200"
                trend="up"
                trendValue="12%"
              />
              <StatsCard
                icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
                label="Transactions (MTD)"
                value="342"
                trend="up"
                trendValue="8%"
              />
              <StatsCard
                icon={<ChartBarIcon className="w-6 h-6 text-white" />}
                label="Avg. Transaction"
                value="$132.16"
                trend="up"
                trendValue="5%"
              />
              <StatsCard
                icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
                label="Best Seller"
                value="Vitamin C Serum"
              />
            </div>

            {/* Report Tabs */}
            <Tabs tabs={tabContent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
