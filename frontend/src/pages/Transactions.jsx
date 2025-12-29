import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

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

  // Mock transaction data with detailed items
  const [transactions] = useState([
    {
      id: 1,
      invoice: 'INV-001',
      date: '2025-12-28',
      time: '10:30 AM',
      cashier: 'John Doe',
      customer: 'Sarah Johnson',
      items: 3,
      total: 150.00,
      subtotal: 135.00,
      tax: 13.50,
      discount: 0,
      payment: 'Cash',
      status: 'Completed',
      itemsList: [
        { name: 'Moisturizing Cream', sku: 'MC-001', qty: 1, price: 45.00 },
        { name: 'Sunscreen SPF 50', sku: 'SS-050', qty: 2, price: 45.00 }
      ],
      notes: 'Regular customer'
    },
    {
      id: 2,
      invoice: 'INV-002',
      date: '2025-12-28',
      time: '10:45 AM',
      cashier: 'Jane Smith',
      customer: 'Mike Wilson',
      items: 5,
      total: 250.50,
      subtotal: 225.00,
      tax: 22.50,
      discount: 10.00,
      payment: 'Credit Card',
      status: 'Completed',
      itemsList: [
        { name: 'Face Wash', sku: 'FW-001', qty: 3, price: 25.00 },
        { name: 'Night Serum', sku: 'NS-001', qty: 2, price: 75.00 }
      ],
      notes: 'Applied 10% discount code'
    },
    {
      id: 3,
      invoice: 'INV-003',
      date: '2025-12-28',
      time: '11:00 AM',
      cashier: 'John Doe',
      customer: 'Emily Chen',
      items: 2,
      total: 89.99,
      subtotal: 80.85,
      tax: 8.09,
      discount: 0,
      payment: 'Debit Card',
      status: 'Completed',
      itemsList: [
        { name: 'Eye Cream', sku: 'EC-001', qty: 1, price: 35.00 },
        { name: 'Toner', sku: 'TN-001', qty: 1, price: 45.85 }
      ],
      notes: ''
    },
    {
      id: 4,
      invoice: 'INV-004',
      date: '2025-12-28',
      time: '11:15 AM',
      cashier: 'Mike Johnson',
      customer: 'David Brown',
      items: 4,
      total: 320.00,
      subtotal: 287.39,
      tax: 28.74,
      discount: 0,
      payment: 'Cash',
      status: 'Refunded',
      itemsList: [
        { name: 'Anti-Aging Cream', sku: 'AA-001', qty: 2, price: 95.00 },
        { name: 'Vitamin C Serum', sku: 'VC-001', qty: 2, price: 48.695 }
      ],
      notes: 'Product defect - full refund issued'
    },
    {
      id: 5,
      invoice: 'INV-005',
      date: '2025-12-27',
      time: '03:20 PM',
      cashier: 'Jane Smith',
      customer: 'Lisa Anderson',
      items: 6,
      total: 445.75,
      subtotal: 400.68,
      tax: 40.07,
      discount: 15.00,
      payment: 'Credit Card',
      status: 'Completed',
      itemsList: [
        { name: 'Cleanser Set', sku: 'CS-001', qty: 2, price: 55.00 },
        { name: 'Face Mask Pack', sku: 'FM-001', qty: 3, price: 30.00 },
        { name: 'Exfoliator', sku: 'EX-001', qty: 1, price: 80.68 }
      ],
      notes: 'VIP customer - 15% loyalty discount'
    },
  ]);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch =
        transaction.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.cashier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPayment = filterPayment === 'all' || transaction.payment === filterPayment;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

      const matchesDateFrom = !dateFrom || transaction.date >= dateFrom;
      const matchesDateTo = !dateTo || transaction.date <= dateTo;

      return matchesSearch && matchesPayment && matchesStatus && matchesDateFrom && matchesDateTo;
    });
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

  const columns = [
    { field: 'invoice', label: 'Invoice #' },
    { field: 'date', label: 'Date' },
    { field: 'time', label: 'Time' },
    { field: 'cashier', label: 'Cashier' },
    { field: 'customer', label: 'Customer' },
    {
      field: 'items',
      label: 'Items',
      render: (value) => <span className="text-white/80">{value} items</span>
    },
    {
      field: 'total',
      label: 'Total',
      render: (value) => <span className="font-semibold text-white">${value.toFixed(2)}</span>,
    },
    {
      field: 'payment',
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
                    <Button variant="secondary" size="sm">
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                      Export
                    </Button>
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
                <p className="text-sm text-white/60 mb-1">Invoice Number</p>
                <p className="text-lg font-semibold text-white">{selectedTransaction.invoice}</p>
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
                <p className="text-white">{selectedTransaction.date} at {selectedTransaction.time}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Payment Method</p>
                <p className="text-white">{selectedTransaction.payment}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Cashier</p>
                <p className="text-white">{selectedTransaction.cashier}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Customer</p>
                <p className="text-white">{selectedTransaction.customer}</p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Items Purchased</h3>
              <div className="space-y-3">
                {selectedTransaction.itemsList.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 glass-card">
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-sm text-white/60">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Qty: {item.qty}</p>
                      <p className="text-white font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between text-white/80">
                <span>Subtotal</span>
                <span>${selectedTransaction.subtotal.toFixed(2)}</span>
              </div>
              {selectedTransaction.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-${selectedTransaction.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white/80">
                <span>Tax (10%)</span>
                <span>${selectedTransaction.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/10">
                <span>Total</span>
                <span>${selectedTransaction.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes */}
            {selectedTransaction.notes && (
              <div className="p-4 glass-card">
                <p className="text-sm text-white/60 mb-1">Notes</p>
                <p className="text-white">{selectedTransaction.notes}</p>
              </div>
            )}

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
