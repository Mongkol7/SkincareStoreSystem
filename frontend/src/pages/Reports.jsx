import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import StatsCard from '../components/common/StatsCard';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Tabs from '../components/common/Tabs';
import Table from '../components/common/Table';
import ExportDropdown from '../components/common/ExportDropdown';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  formatSalesReportForExport,
  formatProductPerformanceForExport,
  formatDailySalesForExport,
  formatMonthlySalesForExport,
  formatCategoryDataForExport,
} from '../utils/exportUtils';
import api from '../services/api';

const Reports = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Export menu states
  const [showSalesExportMenu, setShowSalesExportMenu] = useState(false);
  const [showProductExportMenu, setShowProductExportMenu] = useState(false);
  const [showAnalyticsExportMenu, setShowAnalyticsExportMenu] = useState(false);

  // Refs for export menus
  const salesExportMenuRef = useRef(null);
  const salesExportButtonRef = useRef(null);
  const productExportMenuRef = useRef(null);
  const productExportButtonRef = useRef(null);
  const analyticsExportMenuRef = useRef(null);
  const analyticsExportButtonRef = useRef(null);

  // Load transactions and products from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [txnResponse, prodResponse] = await Promise.all([
          api.get('/transactions'),
          api.get('/products')
        ]);
        setTransactions(txnResponse.data);
        setProducts(prodResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate daily sales from real transactions (last 7 days)
  const dailySalesData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTransactions = transactions.filter(t => {
        const txnDate = new Date(t.date).toISOString().split('T')[0];
        return txnDate === dateStr && t.status === 'Completed';
      });

      const sales = dayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);

      last7Days.push({
        day: dayNames[date.getDay()],
        sales: Math.round(sales * 100) / 100,
        transactions: dayTransactions.length
      });
    }

    return last7Days;
  }, [transactions]);

  // Calculate monthly sales from real transactions (last 6 months)
  const monthlySalesData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      months.push({ month: monthNames[monthIndex], monthIndex, year });
    }

    return months.map(({ month, monthIndex, year }) => {
      const monthTransactions = transactions.filter(t => {
        const txnDate = new Date(t.date);
        return txnDate.getMonth() === monthIndex &&
               txnDate.getFullYear() === year &&
               t.status === 'Completed';
      });

      const sales = monthTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
      const target = sales > 0 ? Math.round(sales * 0.85) : 40000;

      return { month, sales: Math.round(sales * 100) / 100, target };
    });
  }, [transactions]);

  // Calculate category sales from real transactions
  const categoryData = useMemo(() => {
    const categorySales = {};

    transactions.forEach(t => {
      if (t.status === 'Completed' && t.items) {
        t.items.forEach(item => {
          const product = products.find(p => p.name === item.name);
          const category = product?.category || 'Other';
          const itemTotal = (item.price || 0) * (item.quantity || 0);

          if (!categorySales[category]) {
            categorySales[category] = 0;
          }
          categorySales[category] += itemTotal;
        });
      }
    });

    const totalSales = Object.values(categorySales).reduce((sum, val) => sum + val, 0);

    return Object.entries(categorySales)
      .map(([category, sales]) => ({
        category,
        sales: Math.round(sales * 100) / 100,
        percentage: totalSales > 0 ? Math.round((sales / totalSales) * 100) : 0
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);
  }, [transactions, products]);

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

  // Calculate max values for scaling
  const maxDailySales = Math.max(...dailySalesData.map(d => d.sales), 1);
  const maxMonthlySales = Math.max(...monthlySalesData.map(d => Math.max(d.sales, d.target)), 1);
  const totalCategorySales = categoryData.reduce((sum, cat) => sum + cat.sales, 0);

  // Calculate Month-to-Date stats from real transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const mtdTransactions = transactions.filter(t => {
    const txnDate = new Date(t.date);
    return txnDate.getMonth() === currentMonth &&
           txnDate.getFullYear() === currentYear &&
           t.status === 'Completed';
  });

  const mtdRevenue = mtdTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const mtdTransactionCount = mtdTransactions.length;
  const avgTransaction = mtdTransactionCount > 0 ? mtdRevenue / mtdTransactionCount : 0;

  // Calculate best-selling product from transactions
  const productSales = {};
  transactions.forEach(t => {
    if (t.status === 'Completed' && t.items) {
      t.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = 0;
        }
        productSales[item.name] += item.quantity || 0;
      });
    }
  });

  const bestSeller = Object.entries(productSales).length > 0
    ? Object.entries(productSales).reduce((max, [name, qty]) =>
        qty > max.qty ? { name, qty } : max,
        { name: 'N/A', qty: 0 }
      ).name
    : 'N/A';

  // Close export menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Sales export menu
      if (
        showSalesExportMenu &&
        salesExportMenuRef.current &&
        !salesExportMenuRef.current.contains(event.target) &&
        salesExportButtonRef.current &&
        !salesExportButtonRef.current.contains(event.target)
      ) {
        setShowSalesExportMenu(false);
      }

      // Product export menu
      if (
        showProductExportMenu &&
        productExportMenuRef.current &&
        !productExportMenuRef.current.contains(event.target) &&
        productExportButtonRef.current &&
        !productExportButtonRef.current.contains(event.target)
      ) {
        setShowProductExportMenu(false);
      }

      // Analytics export menu
      if (
        showAnalyticsExportMenu &&
        analyticsExportMenuRef.current &&
        !analyticsExportMenuRef.current.contains(event.target) &&
        analyticsExportButtonRef.current &&
        !analyticsExportButtonRef.current.contains(event.target)
      ) {
        setShowAnalyticsExportMenu(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSalesExportMenu, showProductExportMenu, showAnalyticsExportMenu]);

  // Export handlers for Sales Report
  const handleExportSalesCSV = () => {
    const formattedData = formatSalesReportForExport(salesData);
    const filename = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(formattedData, filename);
    setShowSalesExportMenu(false);
  };

  const handleExportSalesExcel = () => {
    const formattedData = formatSalesReportForExport(salesData);
    const filename = `sales_report_${new Date().toISOString().split('T')[0]}.xls`;
    exportToExcel(formattedData, filename);
    setShowSalesExportMenu(false);
  };

  const handleExportSalesPDF = () => {
    const formattedData = formatSalesReportForExport(salesData);
    exportToPDF(formattedData, 'sales_report.pdf', 'Monthly Sales Performance Report');
    setShowSalesExportMenu(false);
  };

  // Export handlers for Product Performance
  const handleExportProductCSV = () => {
    const formattedData = formatProductPerformanceForExport(productPerformance);
    const filename = `product_performance_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(formattedData, filename);
    setShowProductExportMenu(false);
  };

  const handleExportProductExcel = () => {
    const formattedData = formatProductPerformanceForExport(productPerformance);
    const filename = `product_performance_${new Date().toISOString().split('T')[0]}.xls`;
    exportToExcel(formattedData, filename);
    setShowProductExportMenu(false);
  };

  const handleExportProductPDF = () => {
    const formattedData = formatProductPerformanceForExport(productPerformance);
    exportToPDF(formattedData, 'product_performance.pdf', 'Top Selling Products Report');
    setShowProductExportMenu(false);
  };

  // Export handlers for Analytics (Daily Sales)
  const handleExportAnalyticsCSV = () => {
    const formattedData = formatDailySalesForExport(dailySalesData);
    const filename = `daily_sales_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(formattedData, filename);
    setShowAnalyticsExportMenu(false);
  };

  const handleExportAnalyticsExcel = () => {
    const formattedData = formatDailySalesForExport(dailySalesData);
    const filename = `daily_sales_analytics_${new Date().toISOString().split('T')[0]}.xls`;
    exportToExcel(formattedData, filename);
    setShowAnalyticsExportMenu(false);
  };

  const handleExportAnalyticsPDF = () => {
    const formattedData = formatDailySalesForExport(dailySalesData);
    exportToPDF(formattedData, 'daily_sales_analytics.pdf', 'Daily Sales Trend Report');
    setShowAnalyticsExportMenu(false);
  };

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
              <ExportDropdown
                isOpen={showSalesExportMenu}
                onToggle={() => setShowSalesExportMenu(!showSalesExportMenu)}
                onExportCSV={handleExportSalesCSV}
                onExportExcel={handleExportSalesExcel}
                onExportPDF={handleExportSalesPDF}
                buttonRef={salesExportButtonRef}
                menuRef={salesExportMenuRef}
                variant="primary"
              />
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
              <ExportDropdown
                isOpen={showProductExportMenu}
                onToggle={() => setShowProductExportMenu(!showProductExportMenu)}
                onExportCSV={handleExportProductCSV}
                onExportExcel={handleExportProductExcel}
                onExportPDF={handleExportProductPDF}
                buttonRef={productExportButtonRef}
                menuRef={productExportMenuRef}
                variant="primary"
              />
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
        <div className="space-y-6">
          {/* Period Selector */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Sales Analytics</h3>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-48"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </Select>
          </div>

          {/* Daily Sales Trend - Bar Chart */}
          <Card>
            <CardHeader
              title="Daily Sales Trend"
              subtitle="Last 7 days performance"
              action={
                <ExportDropdown
                  isOpen={showAnalyticsExportMenu}
                  onToggle={() => setShowAnalyticsExportMenu(!showAnalyticsExportMenu)}
                  onExportCSV={handleExportAnalyticsCSV}
                  onExportExcel={handleExportAnalyticsExcel}
                  onExportPDF={handleExportAnalyticsPDF}
                  buttonRef={analyticsExportButtonRef}
                  menuRef={analyticsExportMenuRef}
                  variant="secondary"
                />
              }
            />
            <div className="p-6">
              <div className="flex items-end justify-between gap-4 h-64">
                {dailySalesData.map((data, index) => {
                  const heightPercentage = (data.sales / maxDailySales) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center justify-end flex-1">
                        <div className="text-xs text-white/60 mb-1">${(data.sales / 1000).toFixed(1)}k</div>
                        <div
                          className="w-full bg-white/80 hover:bg-white transition-all cursor-pointer rounded-t-lg relative group"
                          style={{ height: `${heightPercentage}%`, minHeight: '20px' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                            ${data.sales.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-white/80 font-medium">{data.day}</div>
                      <div className="text-xs text-white/50">{data.transactions} txns</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Monthly Sales vs Target - Grouped Bar Chart */}
          <Card>
            <CardHeader
              title="Monthly Sales vs Target"
              subtitle="6-month comparison"
            />
            <div className="p-6">
              <div className="flex items-end justify-between gap-6 h-72">
                {monthlySalesData.map((data, index) => {
                  const salesHeight = (data.sales / maxMonthlySales) * 100;
                  const targetHeight = (data.target / maxMonthlySales) * 100;
                  const isAboveTarget = data.sales >= data.target;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center gap-1 flex-1">
                        <div className="flex-1 flex flex-col items-center justify-end">
                          <div className="text-xs text-white/60 mb-1">${(data.sales / 1000).toFixed(0)}k</div>
                          <div
                            className={`w-full ${isAboveTarget ? 'bg-white/80' : 'bg-white/50'} hover:bg-white transition-all cursor-pointer rounded-t-lg relative group`}
                            style={{ height: `${salesHeight}%`, minHeight: '20px' }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                              Actual: ${data.sales.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-end">
                          <div className="text-xs text-white/40 mb-1">${(data.target / 1000).toFixed(0)}k</div>
                          <div
                            className="w-full bg-white/20 border border-white/40 border-dashed hover:bg-white/30 transition-all cursor-pointer rounded-t-lg relative group"
                            style={{ height: `${targetHeight}%`, minHeight: '20px' }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                              Target: ${data.target.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-white/80 font-medium">{data.month}</div>
                      {isAboveTarget && (
                        <ArrowTrendingUpIcon className="w-4 h-4 text-white/60" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/80 rounded"></div>
                  <span className="text-sm text-white/60">Actual Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/20 border border-white/40 border-dashed rounded"></div>
                  <span className="text-sm text-white/60">Target</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Sales by Category - Horizontal Bar Chart */}
          <Card>
            <CardHeader title="Sales by Category" subtitle="Product category breakdown" />
            <div className="p-6 space-y-4">
              {categoryData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">{data.category}</span>
                    <span className="text-sm text-white/60">${data.sales.toLocaleString()} ({data.percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-white/80 rounded-full transition-all duration-500 ease-out relative group cursor-pointer hover:bg-white"
                      style={{ width: `${data.percentage}%` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-end pr-2">
                        <span className="text-xs font-semibold text-black/60">{data.percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Total Sales</span>
                  <span className="text-lg font-bold text-white">${totalCategorySales.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Avg. Daily Sales</span>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-3xl font-bold text-white">
                  ${dailySalesData.length > 0 ? (dailySalesData.reduce((sum, d) => sum + d.sales, 0) / dailySalesData.length / 1000).toFixed(1) : '0.0'}k
                </div>
                <div className="text-xs text-white/60">Last 7 days average</div>
              </div>
            </Card>

            <Card>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Best Selling Day</span>
                  <ChartBarIcon className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {dailySalesData.length > 0
                    ? dailySalesData.reduce((max, d) => d.sales > max.sales ? d : max, dailySalesData[0]).day
                    : 'N/A'}
                </div>
                <div className="text-xs text-white/60">
                  {dailySalesData.length > 0
                    ? `$${dailySalesData.reduce((max, d) => d.sales > max.sales ? d : max, dailySalesData[0]).sales.toLocaleString()} in sales`
                    : 'No data available'}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Target Achievement</span>
                  <CurrencyDollarIcon className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {monthlySalesData.length > 0 && monthlySalesData.reduce((sum, d) => sum + d.target, 0) > 0
                    ? ((monthlySalesData.reduce((sum, d) => sum + d.sales, 0) / monthlySalesData.reduce((sum, d) => sum + d.target, 0)) * 100).toFixed(0)
                    : '0'}%
                </div>
                <div className="text-xs text-white/60">6-month average vs target</div>
              </div>
            </Card>
          </div>
        </div>
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
                value={`$${mtdRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              />
              <StatsCard
                icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
                label="Transactions (MTD)"
                value={mtdTransactionCount}
              />
              <StatsCard
                icon={<ChartBarIcon className="w-6 h-6 text-white" />}
                label="Avg. Transaction"
                value={`$${avgTransaction.toFixed(2)}`}
              />
              <StatsCard
                icon={<ShoppingCartIcon className="w-6 h-6 text-white" />}
                label="Best Seller"
                value={bestSeller}
              />
            </div>

            {/* Report Tabs */}
          <Tabs tabs={tabContent} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
