import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePO } from '../context/POContext';
import { useProducts } from '../context/ProductContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card, { CardHeader } from '../components/common/Card';
import Tabs from '../components/common/Tabs';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {
  exportToCSV,
  exportToExcel,
  formatDailySalesForExport,
  formatMonthlySalesForExport,
  formatCategoryDataForExport,
} from '../utils/exportUtils';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { openCreatePOModal, purchaseOrders } = usePO();
  const { products } = useProducts();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('last7days');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    todaySales: 0,
    transactions: 0,
    activeStaff: 12,
    lowStockItems: 0,
  });

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data);

        // Calculate today's sales
        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = response.data.filter(t => {
          const txnDate = new Date(t.date).toISOString().split('T')[0];
          return txnDate === today && t.status === 'Completed';
        });

        const todaySales = todayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);

        // Calculate low stock items
        const lowStock = products.filter(p => p.stock < p.min_stock).length;

        setStats({
          todaySales: todaySales,
          transactions: todayTransactions.length,
          activeStaff: 12,
          lowStockItems: lowStock,
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchTransactions();
    }
  }, [products]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get recent transactions (last 5, sorted by latest first)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Latest first
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      invoice: t.transactionNumber,
      cashier: t.cashier,
      amount: t.total,
      status: t.status,
      time: new Date(t.date).toLocaleTimeString()
    }));

  // Get low stock products
  const lowStockProducts = products.filter(p => p.stock < p.min_stock).slice(0, 5);

  // Calculate monthly sales from transactions
  const monthlySalesData = React.useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Get last 6 months
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
      const target = sales > 0 ? sales * 0.85 : 40000; // Target is 85% of actual sales or base of 40k

      return { month, sales, target };
    });
  }, [transactions]);

  // Analytics chart data
  const dailySalesData = [
    { day: 'Mon', sales: 5200, transactions: 42 },
    { day: 'Tue', sales: 6800, transactions: 55 },
    { day: 'Wed', sales: 4500, transactions: 38 },
    { day: 'Thu', sales: 7200, transactions: 61 },
    { day: 'Fri', sales: 8900, transactions: 72 },
    { day: 'Sat', sales: 9500, transactions: 78 },
    { day: 'Sun', sales: 7100, transactions: 59 },
  ];

  const categoryData = [
    { category: 'Serums', sales: 15200, percentage: 34 },
    { category: 'Moisturizers', sales: 12800, percentage: 28 },
    { category: 'Sunscreens', sales: 9500, percentage: 21 },
    { category: 'Cleansers', sales: 7700, percentage: 17 },
  ];

  // Calculate max values for scaling
  const maxDailySales = Math.max(...dailySalesData.map(d => d.sales));
  const maxMonthlySales = Math.max(...monthlySalesData.map(d => Math.max(d.sales, d.target)));
  const totalCategorySales = categoryData.reduce((sum, cat) => sum + cat.sales, 0);

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
      label: 'Stock',
      render: (value, row) => (
        <div className="flex flex-col gap-1">
          <span className="text-danger-400 font-semibold">
            {value} / {row.min_stock}
          </span>
          {(() => {
            const orderStatus = getProductOrderStatus(row.name);
            return orderStatus.isOrdered ? (
              <span className={`text-xs px-2 py-0.5 rounded-full inline-block w-fit ${
                orderStatus.status === 'Pending'
                  ? 'bg-warning-500/20 text-warning-400'
                  : 'bg-primary-500/20 text-primary-400'
              }`}>
                {orderStatus.status === 'Pending' ? '⏳ Pending' : '✓ Ordered'} - ETA: {orderStatus.expectedDate}
              </span>
            ) : null;
          })()}
        </div>
      ),
    },
  ];

  const handleCreatePOFromLowStock = () => {
    const items = lowStockProducts.map(item => ({
      product: item.name,
      quantity: item.min_stock - item.stock,
      unitPrice: ''
    }));
    openCreatePOModal(items);
  };

  // Export handlers
  const handleExport = (format) => {
    const periodLabel = selectedPeriod === 'last7days' ? 'Last 7 Days' :
                       selectedPeriod === 'last30days' ? 'Last 30 Days' :
                       selectedPeriod === 'last6months' ? 'Last 6 Months' :
                       'Last Year';

    // Prepare all data for export
    const dailySalesExport = formatDailySalesForExport(dailySalesData);
    const monthlySalesExport = formatMonthlySalesForExport(monthlySalesData);
    const categoryExport = formatCategoryDataForExport(categoryData);

    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'csv') {
      // Export each section as separate CSV
      exportToCSV(dailySalesExport, `Daily_Sales_${timestamp}.csv`);
      exportToCSV(monthlySalesExport, `Monthly_Sales_${timestamp}.csv`);
      exportToCSV(categoryExport, `Category_Sales_${timestamp}.csv`);
    } else if (format === 'excel') {
      // For Excel, we can create a workbook with multiple sheets
      // Using the simple method - export each as separate file
      exportToExcel(dailySalesExport, `Daily_Sales_${timestamp}.xlsx`);
      exportToExcel(monthlySalesExport, `Monthly_Sales_${timestamp}.xlsx`);
      exportToExcel(categoryExport, `Category_Sales_${timestamp}.xlsx`);
    } else if (format === 'pdf') {
      // Export comprehensive PDF report
      exportAnalyticsToPDF(periodLabel, timestamp);
    }

    setShowExportMenu(false);
  };

  const exportAnalyticsToPDF = (periodLabel, timestamp) => {
    const { jsPDF } = require('jspdf');
    require('jspdf-autotable');

    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Sales Analytics Report', 14, yPosition);
    yPosition += 10;

    // Metadata
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, yPosition);
    doc.text(`Period: ${periodLabel}`, 14, yPosition + 5);
    yPosition += 15;

    doc.setTextColor(0);

    // Daily Sales Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Daily Sales Trend', 14, yPosition);
    yPosition += 8;

    doc.autoTable({
      head: [['Day', 'Sales ($)', 'Transactions']],
      body: dailySalesData.map(d => [
        d.day,
        d.sales.toLocaleString(),
        d.transactions
      ]),
      startY: yPosition,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Monthly Sales Section
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Monthly Sales vs Target', 14, yPosition);
    yPosition += 8;

    doc.autoTable({
      head: [['Month', 'Actual Sales ($)', 'Target ($)', 'Achievement (%)']],
      body: monthlySalesData.map(d => [
        d.month,
        d.sales.toLocaleString(),
        d.target.toLocaleString(),
        ((d.sales / d.target) * 100).toFixed(1) + '%'
      ]),
      startY: yPosition,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Category Sales Section
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Sales by Category', 14, yPosition);
    yPosition += 8;

    doc.autoTable({
      head: [['Category', 'Sales ($)', 'Percentage (%)']],
      body: categoryData.map(d => [
        d.category,
        d.sales.toLocaleString(),
        d.percentage + '%'
      ]),
      startY: yPosition,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Summary Section
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Summary', 14, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const avgDailySales = (dailySalesData.reduce((sum, d) => sum + d.sales, 0) / dailySalesData.length / 1000).toFixed(1);
    const bestDay = dailySalesData.reduce((max, d) => d.sales > max.sales ? d : max, dailySalesData[0]);
    const targetAchievement = ((monthlySalesData.reduce((sum, d) => sum + d.sales, 0) / monthlySalesData.reduce((sum, d) => sum + d.target, 0)) * 100).toFixed(0);

    doc.text(`Average Daily Sales: $${avgDailySales}k`, 14, yPosition);
    yPosition += 6;
    doc.text(`Best Selling Day: ${bestDay.day} ($${bestDay.sales.toLocaleString()})`, 14, yPosition);
    yPosition += 6;
    doc.text(`Target Achievement: ${targetAchievement}%`, 14, yPosition);

    // Save the PDF
    doc.save(`Sales_Analytics_Report_${timestamp}.pdf`);
  };

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
              <Button variant="warning" size="sm" onClick={handleCreatePOFromLowStock}>
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
                <div className="relative" ref={exportMenuRef}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                  >
                    <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                    Export
                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                  </Button>

                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                          onClick={() => handleExport('csv')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                          role="menuitem"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4 mr-3" />
                          Export to CSV
                        </button>
                        <button
                          onClick={() => handleExport('excel')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                          role="menuitem"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4 mr-3" />
                          Export to Excel
                        </button>
                        <button
                          onClick={() => handleExport('pdf')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                          role="menuitem"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4 mr-3" />
                          Export to PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                <div className="text-3xl font-bold text-white">${(dailySalesData.reduce((sum, d) => sum + d.sales, 0) / dailySalesData.length / 1000).toFixed(1)}k</div>
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
                  {dailySalesData.reduce((max, d) => d.sales > max.sales ? d : max, dailySalesData[0]).day}
                </div>
                <div className="text-xs text-white/60">
                  ${dailySalesData.reduce((max, d) => d.sales > max.sales ? d : max, dailySalesData[0]).sales.toLocaleString()} in sales
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
                  {((monthlySalesData.reduce((sum, d) => sum + d.sales, 0) / monthlySalesData.reduce((sum, d) => sum + d.target, 0)) * 100).toFixed(0)}%
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
  );
};

export default AdminDashboard;
