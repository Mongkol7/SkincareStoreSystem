import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Tabs from '../components/common/Tabs';
import { MagnifyingGlassIcon, ArrowPathIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const Inventory = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock inventory data
  const inventoryMovements = [
    {
      id: 1,
      date: '2025-12-28',
      time: '10:30 AM',
      product: 'Vitamin C Serum',
      type: 'Sale',
      quantity: -3,
      reference: 'INV-001',
      stockAfter: 22
    },
    {
      id: 2,
      date: '2025-12-28',
      time: '09:15 AM',
      product: 'Hydrating Cleanser',
      type: 'Restock',
      quantity: +50,
      reference: 'PO-2025-003',
      stockAfter: 53
    },
    {
      id: 3,
      date: '2025-12-27',
      time: '03:45 PM',
      product: 'Sunscreen SPF 50',
      type: 'Sale',
      quantity: -2,
      reference: 'INV-005',
      stockAfter: 23
    },
    {
      id: 4,
      date: '2025-12-27',
      time: '11:20 AM',
      product: 'Retinol Night Cream',
      type: 'Adjustment',
      quantity: -1,
      reference: 'ADJ-001',
      stockAfter: 11
    },
  ];

  const stockLevels = [
    {
      id: 1,
      product: 'Vitamin C Serum',
      category: 'Serum',
      currentStock: 22,
      minStock: 10,
      maxStock: 50,
      reorderPoint: 15,
      status: 'Adequate'
    },
    {
      id: 2,
      product: 'Hydrating Cleanser',
      category: 'Cleanser',
      currentStock: 53,
      minStock: 15,
      maxStock: 60,
      reorderPoint: 20,
      status: 'Adequate'
    },
    {
      id: 3,
      product: 'Sunscreen SPF 50',
      category: 'Sunscreen',
      currentStock: 8,
      minStock: 20,
      maxStock: 80,
      reorderPoint: 25,
      status: 'Low Stock'
    },
    {
      id: 4,
      product: 'Gentle Exfoliating Scrub',
      category: 'Exfoliator',
      currentStock: 0,
      minStock: 12,
      maxStock: 40,
      reorderPoint: 15,
      status: 'Out of Stock'
    },
  ];

  const movementColumns = [
    { field: 'date', label: 'Date' },
    { field: 'time', label: 'Time' },
    { field: 'product', label: 'Product' },
    {
      field: 'type',
      label: 'Type',
      render: (value) => (
        <span className={`badge ${
          value === 'Sale' ? 'badge-primary' :
          value === 'Restock' ? 'badge-success' :
          'badge-warning'
        }`}>
          {value}
        </span>
      ),
    },
    {
      field: 'quantity',
      label: 'Quantity',
      render: (value) => (
        <span className={value > 0 ? 'text-success-400 font-semibold' : 'text-danger-400 font-semibold'}>
          {value > 0 ? '+' : ''}{value}
        </span>
      ),
    },
    { field: 'reference', label: 'Reference' },
    {
      field: 'stockAfter',
      label: 'Stock After',
      render: (value) => <span className="text-white/80">{value}</span>
    },
  ];

  const stockColumns = [
    { field: 'product', label: 'Product' },
    { field: 'category', label: 'Category' },
    {
      field: 'currentStock',
      label: 'Current Stock',
      render: (value, row) => (
        <span className={
          value === 0 ? 'text-danger-400 font-semibold' :
          value < row.minStock ? 'text-warning-400 font-semibold' :
          'text-success-400 font-semibold'
        }>
          {value}
        </span>
      ),
    },
    {
      field: 'minStock',
      label: 'Min',
      render: (value) => <span className="text-white/60">{value}</span>
    },
    {
      field: 'maxStock',
      label: 'Max',
      render: (value) => <span className="text-white/60">{value}</span>
    },
    {
      field: 'reorderPoint',
      label: 'Reorder Point',
      render: (value) => <span className="text-white/70">{value}</span>
    },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${
          value === 'Adequate' ? 'badge-success' :
          value === 'Low Stock' ? 'badge-warning' :
          'badge-danger'
        }`}>
          {value}
        </span>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Adjust
          </Button>
          {row.status !== 'Adequate' && (
            <Button variant="primary" size="sm">
              Reorder
            </Button>
          )}
        </div>
      ),
    },
  ];

  const tabContent = [
    {
      label: 'Stock Levels',
      content: (
        <Card>
          <CardHeader
            title="Current Inventory Levels"
            action={
              <div className="flex gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="secondary" size="sm">
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Sync
                </Button>
              </div>
            }
          />
          <Table columns={stockColumns} data={stockLevels} />
        </Card>
      ),
    },
    {
      label: 'Movements',
      content: (
        <Card>
          <CardHeader
            title="Recent Inventory Movements"
            action={
              <Button variant="secondary" size="sm">
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Export
              </Button>
            }
          />
          <Table columns={movementColumns} data={inventoryMovements} />
        </Card>
      ),
    },
  ];

  // Calculate summary stats
  const totalProducts = stockLevels.length;
  const lowStockItems = stockLevels.filter(s => s.status === 'Low Stock').length;
  const outOfStockItems = stockLevels.filter(s => s.status === 'Out of Stock').length;
  const totalStockValue = stockLevels.reduce((sum, s) => sum + (s.currentStock * 35), 0); // Assuming avg price $35

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
                Inventory Management
              </h2>
              <p className="text-white/60 text-sm">
                Monitor stock levels and inventory movements
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-white">{totalProducts}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Low Stock</p>
                <p className="text-2xl font-bold text-warning-400">{lowStockItems}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Out of Stock</p>
                <p className="text-2xl font-bold text-danger-400">{outOfStockItems}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Stock Value</p>
                <p className="text-2xl font-bold text-success-400">${totalStockValue.toLocaleString()}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabContent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
