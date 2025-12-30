import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Tabs from '../components/common/Tabs';
import ExportDropdown from '../components/common/ExportDropdown';
import { MagnifyingGlassIcon, ArrowPathIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const Inventory = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportButtonRef = useRef(null);
  const exportMenuRef = useRef(null);
  const [adjustmentForm, setAdjustmentForm] = useState({
    quantity: '',
    reason: 'Damaged',
    notes: '',
  });
  const [reorderForm, setReorderForm] = useState({
    quantity: '',
    supplier: '',
    expectedDelivery: '',
  });

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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedProduct(row);
              setIsAdjustModalOpen(true);
            }}
          >
            Adjust
          </Button>
          {row.status !== 'Adequate' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedProduct(row);
                setReorderForm({
                  quantity: row.reorderPoint,
                  supplier: '',
                  expectedDelivery: '',
                });
                setIsReorderModalOpen(true);
              }}
            >
              Reorder
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleAdjustInventory = (e) => {
    e.preventDefault();
    console.log('Adjust inventory:', {
      product: selectedProduct,
      ...adjustmentForm,
    });
    setIsAdjustModalOpen(false);
    setAdjustmentForm({
      quantity: '',
      reason: 'Damaged',
      notes: '',
    });
  };

  const handleReorderProduct = (e) => {
    e.preventDefault();
    console.log('Reorder product:', {
      product: selectedProduct,
      ...reorderForm,
    });
    setIsReorderModalOpen(false);
    setReorderForm({
      quantity: '',
      supplier: '',
      expectedDelivery: '',
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Replace with actual API call
      // await inventoryService.syncInventory();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Inventory synced successfully');
      // In a real app, you would refresh the data here
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportButtonRef.current &&
        exportMenuRef.current &&
        !exportButtonRef.current.contains(event.target) &&
        !exportMenuRef.current.contains(event.target)
      ) {
        setIsExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    // Prepare CSV data
    const headers = ['Date', 'Time', 'Product', 'Type', 'Quantity', 'Reference', 'Stock After'];
    const csvData = [
      headers.join(','),
      ...inventoryMovements.map(movement => [
        movement.date,
        movement.time,
        `"${movement.product}"`,
        movement.type,
        movement.quantity,
        movement.reference,
        movement.stockAfter
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-movements-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportDropdownOpen(false);
  };

  const handleExportExcel = () => {
    // Create Excel-compatible CSV with BOM for proper encoding
    const headers = ['Date', 'Time', 'Product', 'Type', 'Quantity', 'Reference', 'Stock After'];
    const csvData = [
      headers.join(','),
      ...inventoryMovements.map(movement => [
        movement.date,
        movement.time,
        `"${movement.product}"`,
        movement.type,
        movement.quantity,
        movement.reference,
        movement.stockAfter
      ].join(','))
    ].join('\n');

    // Add BOM for Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvData], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-movements-${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportDropdownOpen(false);
  };

  const handleExportPDF = () => {
    // Create HTML table for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Inventory Movements Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; margin-bottom: 20px; }
          .report-info { margin-bottom: 20px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #4a5568; color: white; padding: 12px; text-align: left; font-weight: bold; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:hover { background-color: #f5f5f5; }
          .positive { color: #10b981; }
          .negative { color: #ef4444; }
        </style>
      </head>
      <body>
        <h1>Inventory Movements Report</h1>
        <div class="report-info">
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Records: ${inventoryMovements.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Reference</th>
              <th>Stock After</th>
            </tr>
          </thead>
          <tbody>
            ${inventoryMovements.map(movement => `
              <tr>
                <td>${movement.date}</td>
                <td>${movement.time}</td>
                <td>${movement.product}</td>
                <td>${movement.type}</td>
                <td class="${movement.quantity > 0 ? 'positive' : 'negative'}">${movement.quantity > 0 ? '+' : ''}${movement.quantity}</td>
                <td>${movement.reference}</td>
                <td>${movement.stockAfter}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create blob and open in new window for printing/PDF saving
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');

    // Wait for content to load then trigger print dialog
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }

    setIsExportDropdownOpen(false);
  };

  // Filter stock levels based on search term
  const filteredStockLevels = stockLevels.filter(item =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="h-[42px] px-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowPathIcon className={`w-5 h-5 text-white ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            }
          />
          <Table columns={stockColumns} data={filteredStockLevels} />
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
              <ExportDropdown
                isOpen={isExportDropdownOpen}
                onToggle={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                onExportCSV={handleExportCSV}
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
                buttonRef={exportButtonRef}
                menuRef={exportMenuRef}
                variant="secondary"
                size="sm"
              />
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

      {/* Adjust Inventory Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Adjust Inventory"
        size="md"
      >
        {selectedProduct && (
          <form onSubmit={handleAdjustInventory} className="space-y-4">
            <div className="glass-card p-4">
              <p className="text-xs text-white/60 mb-1">Product</p>
              <p className="text-sm text-white font-medium">{selectedProduct.product}</p>
              <p className="text-xs text-white/60 mt-2">Current Stock: <span className="text-white font-semibold">{selectedProduct.currentStock}</span></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Adjustment Quantity</label>
              <Input
                type="number"
                value={adjustmentForm.quantity}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: e.target.value })}
                placeholder="Enter quantity (use negative for decrease)"
                required
              />
              <p className="text-xs text-white/60 mt-1">Use negative numbers to decrease stock (e.g., -5)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Reason</label>
              <select
                className="select w-full"
                value={adjustmentForm.reason}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
              >
                <option value="Damaged">Damaged</option>
                <option value="Expired">Expired</option>
                <option value="Lost">Lost/Missing</option>
                <option value="Found">Found (Inventory Count)</option>
                <option value="Return">Customer Return</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Notes</label>
              <textarea
                className="textarea w-full"
                rows="3"
                value={adjustmentForm.notes}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, notes: e.target.value })}
                placeholder="Additional notes about this adjustment..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsAdjustModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="warning">
                Submit Adjustment
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Reorder Product Modal */}
      <Modal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        title="Create Reorder / Purchase Order"
        size="md"
      >
        {selectedProduct && (
          <form onSubmit={handleReorderProduct} className="space-y-4">
            <div className="glass-card p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Product</p>
                  <p className="text-sm text-white font-medium">{selectedProduct.product}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Current Stock</p>
                  <p className="text-sm font-bold text-danger-400">{selectedProduct.currentStock}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Reorder Point</p>
                  <p className="text-sm text-white/80">{selectedProduct.reorderPoint}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Status</p>
                  <span className={`badge ${
                    selectedProduct.status === 'Out of Stock' ? 'badge-danger' : 'badge-warning'
                  }`}>
                    {selectedProduct.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Order Quantity</label>
              <Input
                type="number"
                value={reorderForm.quantity}
                onChange={(e) => setReorderForm({ ...reorderForm, quantity: e.target.value })}
                placeholder="Enter quantity to order"
                min="1"
                required
              />
              <p className="text-xs text-white/60 mt-1">Suggested: {selectedProduct.reorderPoint} units</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Supplier</label>
              <select
                className="select w-full"
                value={reorderForm.supplier}
                onChange={(e) => setReorderForm({ ...reorderForm, supplier: e.target.value })}
                required
              >
                <option value="">Select Supplier</option>
                <option value="GlowSkin Supplies">GlowSkin Supplies</option>
                <option value="PureGlow Wholesale">PureGlow Wholesale</option>
                <option value="SunShield Distributors">SunShield Distributors</option>
                <option value="HydraPlus Corp">HydraPlus Corp</option>
                <option value="YouthGlow International">YouthGlow International</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Expected Delivery</label>
              <Input
                type="date"
                value={reorderForm.expectedDelivery}
                onChange={(e) => setReorderForm({ ...reorderForm, expectedDelivery: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsReorderModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Purchase Order
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
