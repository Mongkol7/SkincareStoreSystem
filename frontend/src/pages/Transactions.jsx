import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, PrinterIcon, ArrowDownTrayIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { exportToCSV, exportToExcel, exportToPDF, formatTransactionsForExport } from '../utils/exportUtils';
import api from '../services/api';

const Transactions = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);
  const exportButtonRef = useRef(null);
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchTransactions();
    }
  }, []);

  // Close export menu when clicking outside
  useEffect(() => {
    if (!showExportMenu) return;

    const handleClickOutside = (event) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target) &&
        exportButtonRef.current &&
        !exportButtonRef.current.contains(event.target)
      ) {
        setShowExportMenu(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // Filter, search, and sort transactions (latest on top)
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch =
          (transaction.transactionNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (transaction.cashier || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPayment = filterPayment === 'all' || transaction.paymentMethod === filterPayment;
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

        const txnDate = new Date(transaction.date).toISOString().split('T')[0];
        const matchesDateFrom = !dateFrom || txnDate >= dateFrom;
        const matchesDateTo = !dateTo || txnDate <= dateTo;

        return matchesSearch && matchesPayment && matchesStatus && matchesDateFrom && matchesDateTo;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Latest first
  }, [transactions, searchTerm, filterPayment, filterStatus, dateFrom, dateTo]);

  // Handle view transaction details
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  // Handle print receipt
  const handlePrintReceipt = (transaction) => {
    window.print();
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterPayment('all');
    setFilterStatus('all');
    setDateFrom('');
    setDateTo('');
    setSearchTerm('');
  };

  // Export handlers
  const handleExportCSV = () => {
    const formattedData = formatTransactionsForExport(filteredTransactions);
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(formattedData, filename);
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const formattedData = formatTransactionsForExport(filteredTransactions);
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.xls`;
    exportToExcel(formattedData, filename);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    const formattedData = formatTransactionsForExport(filteredTransactions);
    exportToPDF(formattedData, 'transactions.pdf', 'Transactions Report');
    setShowExportMenu(false);
  };

  const columns = [
    {
      field: 'transactionNumber',
      label: 'Transaction #',
      render: (value) => <span className="text-white font-medium">{value}</span>
    },
    {
      field: 'date',
      label: 'Date',
      render: (value) => <span className="text-white/80">{new Date(value).toLocaleDateString()}</span>
    },
    {
      field: 'date',
      label: 'Time',
      render: (value) => <span className="text-white/60 text-xs">{new Date(value).toLocaleTimeString()}</span>
    },
    { field: 'cashier', label: 'Cashier' },
    {
      field: 'items',
      label: 'Items',
      render: (value) => <span className="text-white/80">{value?.length || 0} items</span>
    },
    {
      field: 'total',
      label: 'Total',
      render: (value) => <span className="font-semibold text-white">${value?.toFixed(2) || '0.00'}</span>,
    },
    {
      field: 'paymentMethod',
      label: 'Payment',
      render: (value) => <span className="text-white/70 text-xs">{value}</span>,
    },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${
          value === 'Completed' ? 'badge-success' :
          value === 'Refunded' ? 'badge-danger' :
          'badge-warning'
        }`}>
          {value}
        </span>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button variant="secondary" size="sm" onClick={() => handleViewTransaction(row)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <>
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
                Transactions
              </h2>
              <p className="text-white/60 text-sm">
                View and manage all sales transactions
              </p>
            </div>

            <Card>
              <CardHeader
                title="All Transactions"
                subtitle={`${filteredTransactions.length} transactions found`}
                action={
                  <div className="flex gap-3">
                    <div className="relative">
                      <MagnifyingGlassIcon className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <FunnelIcon className="w-4 h-4 mr-2" />
                      Filters
                    </Button>

                    {/* Export Dropdown */}
                    <div className="relative">
                      <Button
                        ref={exportButtonRef}
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowExportMenu(!showExportMenu)}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Export
                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                      </Button>

                      {showExportMenu && (
                        <div
                          ref={exportMenuRef}
                          className="absolute right-0 mt-2 w-48 glass-card p-2 z-50 animate-scale-in"
                        >
                          <button
                            onClick={handleExportCSV}
                            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Export as CSV
                          </button>
                          <button
                            onClick={handleExportExcel}
                            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Export as Excel
                          </button>
                          <button
                            onClick={handleExportPDF}
                            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <PrinterIcon className="w-4 h-4" />
                            Export as PDF
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                }
              />

              {showFilters && (
                <div className="px-6 pb-6 border-b border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Payment Method</label>
                      <Select
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                      >
                        <option value="all">All Methods</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Status</label>
                      <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Refunded">Refunded</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Date From</label>
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Date To</label>
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}

              <Table columns={columns} data={filteredTransactions} />
            </Card>
          </div>
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
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
              <div>
                <p className="text-sm text-white/60 mb-1">Transaction Number</p>
                <p className="text-lg font-semibold text-white">{selectedTransaction.transactionNumber}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Status</p>
                <span className={`badge ${
                  selectedTransaction.status === 'Completed' ? 'badge-success' :
                  selectedTransaction.status === 'Refunded' ? 'badge-danger' :
                  'badge-warning'
                }`}>
                  {selectedTransaction.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Date & Time</p>
                <p className="text-white">{new Date(selectedTransaction.date).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Payment Method</p>
                <p className="text-white">{selectedTransaction.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Cashier</p>
                <p className="text-white">{selectedTransaction.cashier}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Amount Received</p>
                <p className="text-white">${selectedTransaction.amountReceived?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Items Purchased</h3>
              <div className="space-y-3">
                {(selectedTransaction.items || []).map((item, index) => (
                  <div key={index} className="p-4 glass-card">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-sm text-white/60">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-white/60">Total</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm pt-2 border-t border-white/10">
                      <div>
                        <p className="text-white/60">Selling Price</p>
                        <p className="text-white">${item.sellingPrice?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Discount</p>
                        <p className="text-success-400">{item.discount || 0}%</p>
                      </div>
                      <div>
                        <p className="text-white/60">After Discount</p>
                        <p className="text-white font-medium">${item.price?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between text-white/80">
                <span>Subtotal</span>
                <span>${selectedTransaction.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Tax (10%)</span>
                <span>${selectedTransaction.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/10">
                <span>Total</span>
                <span>${selectedTransaction.total?.toFixed(2) || '0.00'}</span>
              </div>
              {selectedTransaction.change > 0 && (
                <div className="flex justify-between text-success-400 pt-2">
                  <span>Change</span>
                  <span>${selectedTransaction.change?.toFixed(2) || '0.00'}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => handlePrintReceipt(selectedTransaction)}
              >
                <PrinterIcon className="w-5 h-5 mr-2" />
                Print Receipt
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Transactions;
