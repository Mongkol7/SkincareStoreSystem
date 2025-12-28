import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Transactions = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      invoice: 'INV-001',
      date: '2025-12-28',
      time: '10:30 AM',
      cashier: 'John Doe',
      customer: 'Sarah Johnson',
      items: 3,
      total: 150.00,
      payment: 'Cash',
      status: 'Completed'
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
      payment: 'Credit Card',
      status: 'Completed'
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
      payment: 'Debit Card',
      status: 'Completed'
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
      payment: 'Cash',
      status: 'Refunded'
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
      payment: 'Credit Card',
      status: 'Completed'
    },
  ];

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
      render: () => (
        <Button variant="secondary" size="sm">
          View Details
        </Button>
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
                Transactions
              </h2>
              <p className="text-white/60 text-sm">
                View and manage all sales transactions
              </p>
            </div>

            <Card>
              <CardHeader
                title="All Transactions"
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
                    <Button variant="secondary" size="sm">
                      <FunnelIcon className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                }
              />
              <Table columns={columns} data={transactions} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
