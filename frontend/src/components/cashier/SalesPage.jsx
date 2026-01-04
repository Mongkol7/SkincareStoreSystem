import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader } from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  ReceiptPercentIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useProducts } from '../../context/ProductContext';
import api from '../../services/api';

const SalesPage = () => {
  const navigate = useNavigate();
  const { products, updateProduct, fetchProducts } = useProducts();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod] = useState('Cash');
  const [moneyReceived, setMoneyReceived] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptDetail, setShowReceiptDetail] = useState(false);
  const [recentReceipts, setRecentReceipts] = useState([
    {
      id: 'RCP-001',
      date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      items: 3,
      total: 82.49,
      payment: 'Cash',
      moneyReceived: 100.00,
      change: 17.51,
      cartItems: [
        { name: 'Hydrating Cleanser', quantity: 1, price: 24.99 },
        { name: 'Vitamin C Serum', quantity: 1, price: 45.00 },
        { name: 'Toner Essence', quantity: 1, price: 22.00 },
      ],
    },
    {
      id: 'RCP-002',
      date: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      items: 2,
      total: 69.99,
      payment: 'Cash',
      moneyReceived: 70.00,
      change: 0.01,
      cartItems: [
        { name: 'Vitamin C Serum', quantity: 1, price: 45.00 },
        { name: 'Hydrating Cleanser', quantity: 1, price: 24.99 },
      ],
    },
    {
      id: 'RCP-003',
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      items: 5,
      total: 124.45,
      payment: 'Cash',
      moneyReceived: 150.00,
      change: 25.55,
      cartItems: [
        { name: 'Sunscreen SPF 50', quantity: 2, price: 28.00 },
        { name: 'Moisturizing Cream', quantity: 1, price: 32.50 },
        { name: 'Face Mask Pack', quantity: 2, price: 15.99 },
      ],
    },
  ]);

  const categories = useMemo(() => {
    return [
      { value: '', label: 'All Categories' },
      ...[...new Set(products.map(p => p.category))].map(c => ({ value: c, label: c }))
    ];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    console.log('Adding to cart - Product data:', {
      id: product.id,
      name: product.name,
      sellingPrice: product.sellingPrice,
      originalPrice: product.originalPrice,
      discount: product.discount,
      price: product.price
    });

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // Robust type conversion for price fields
      const convertToNumber = (value, fallback = 0) => {
        if (value === null || value === undefined || value === '') return fallback;
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? fallback : num;
      };

      const sellingPrice = convertToNumber(product.sellingPrice, convertToNumber(product.price, 0));
      const originalPrice = convertToNumber(product.originalPrice, sellingPrice);
      const discount = convertToNumber(product.discount, 0);

      const cartItem = {
        ...product,
        quantity: 1,
        price: sellingPrice,
        sellingPrice: sellingPrice,
        originalPrice: originalPrice,
        discount: discount
      };

      console.log('Cart item being added:', {
        name: cartItem.name,
        sellingPrice: cartItem.sellingPrice,
        originalPrice: cartItem.originalPrice,
        discount: cartItem.discount
      });

      setCart([...cart, cartItem]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateSubtotal = () => {
    // Subtotal is based on original prices
    return cart.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      return sum + (originalPrice * item.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    // Discount is the difference between original and selling price
    return cart.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      const sellingPrice = item.sellingPrice || item.price;
      const itemDiscount = (originalPrice - sellingPrice) * item.quantity;
      return sum + itemDiscount;
    }, 0);
  };

  const calculateTotal = () => {
    // Total is based on selling prices
    return cart.reduce((sum, item) => {
      const sellingPrice = item.sellingPrice || item.price;
      return sum + (sellingPrice * item.quantity);
    }, 0);
  };

  const calculateChange = () => {
    const received = parseFloat(moneyReceived) || 0;
    const total = calculateTotal();
    return received - total;
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleCheckout = async () => {
    // Validate that money received is sufficient
    const change = calculateChange();
    if (change < 0) {
      alert('Insufficient payment amount');
      return;
    }

    try {
      // Calculate totals
      const subtotal = cart.reduce((sum, item) => {
        const afterDiscountPrice = item.sellingPrice * (1 - (item.discount || 0) / 100);
        return sum + (afterDiscountPrice * item.quantity);
      }, 0);

      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      // Helper function for robust number conversion
      const ensureNumber = (value, fallback = 0) => {
        if (value === null || value === undefined || value === '') return fallback;
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? fallback : num;
      };

      // Create transaction data
      const transactionData = {
        items: cart.map(item => {
          const sellingPrice = ensureNumber(item.sellingPrice, 0);
          const discount = ensureNumber(item.discount, 0);
          const afterDiscountPrice = sellingPrice * (1 - discount / 100);

          const itemData = {
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            sellingPrice: sellingPrice,
            discount: discount,
            price: afterDiscountPrice,
          };
          console.log('Transaction item:', itemData);
          return itemData;
        }),
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentMethod: paymentMethod,
        amountReceived: parseFloat(moneyReceived),
        change: change,
        status: 'Completed'
      };

      // Save transaction to backend
      const response = await api.post('/transactions', transactionData);

      // Update stock for each product
      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const newStock = product.stock - item.quantity;
          await updateProduct({
            ...product,
            stock: newStock,
            status: newStock === 0 ? 'Out of Stock' :
                    newStock < product.min_stock ? 'Low Stock' : 'Active'
          });
        }
      }

      // Refresh products list
      await fetchProducts();

      // Create new receipt for local display
      const newReceipt = {
        id: response.data.transactionNumber || `RCP-${String(recentReceipts.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString(),
        items: cart.length,
        total: total,
        payment: paymentMethod,
        moneyReceived: parseFloat(moneyReceived),
        change: change,
        cartItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.sellingPrice * (1 - (item.discount || 0) / 100),
        })),
      };

      // Add to recent receipts (keep last 5)
      setRecentReceipts([newReceipt, ...recentReceipts].slice(0, 5));

      // Clear cart and close checkout
      setCart([]);
      setMoneyReceived('');
      setShowCheckout(false);

      alert(`✓ Sale completed successfully!\nTransaction: ${response.data.transactionNumber}`);
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Failed to process sale. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">New Sale</h2>
          <p className="text-white/60 text-sm">Add products to cart and complete the sale</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader title="Products" />

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>
            <Select
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
              placeholder="All Categories"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="glass-card p-4 hover:bg-white/15 transition-all cursor-pointer relative"
                onClick={() => addToCart(product)}
              >
                {/* Product Image */}
                <div className="mb-3 flex items-center justify-center h-32 bg-white/5 rounded-lg overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="text-4xl text-white/40" style={{ display: product.image ? 'none' : 'block' }}>
                    📦
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="glass">{product.category}</Badge>
                  <span className="text-xs text-white/60">Stock: {product.stock}</span>
                </div>

                {/* Price Display */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    {product.discount > 0 ? (
                      <>
                        {/* After Discount Price (Main) */}
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-success-400">
                            ${(product.sellingPrice * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                          {/* Selling Price (Crossed Out) */}
                          <span className="text-xs text-white/40 line-through">
                            ${product.sellingPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-success-400">
                          Save ${(product.sellingPrice * (product.discount / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-white">
                        ${product.sellingPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="danger">-{product.discount}%</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="w-5 h-5" />
                  Cart ({cart.length})
                </div>
              }
            />

          {cart.length === 0 ? (
            <>
              <div className="text-center py-8 border-b border-white/10">
                <ShoppingCartIcon className="w-16 h-16 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 text-sm">Cart is empty</p>
              </div>

              {/* Recent Receipts */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ReceiptPercentIcon className="w-5 h-5 text-white/60" />
                  <h3 className="text-sm font-semibold text-white">Recent Receipts</h3>
                </div>

                {recentReceipts.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-white/40">No recent transactions</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recentReceipts.map((receipt) => (
                      <div
                        key={receipt.id}
                        className="glass-card p-4"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-white">
                                {receipt.id}
                              </h4>
                              <Badge variant="success" size="sm">{receipt.payment}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-white/60">
                              <ClockIcon className="w-3 h-3" />
                              <span>{formatTimeAgo(receipt.date)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/60 mb-0.5">
                              {receipt.items} {receipt.items === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-2 mb-3 pb-3 border-b border-white/10">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Total:</span>
                            <span className="text-white font-semibold">${receipt.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Cash Received:</span>
                            <span className="text-success-400 font-semibold">+${receipt.moneyReceived.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/60">Change Given:</span>
                            <span className="text-primary-400 font-semibold">-${receipt.change.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Button
                          variant="glass"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedReceipt(receipt);
                            setShowReceiptDetail(true);
                          }}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="glass-card p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-white/60">${item.price.toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-danger-500/20 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4 text-danger-400" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors" 
                        >
                          <MinusIcon className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-sm font-medium text-white w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors" 
                        >
                          <PlusIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-sm text-white/80">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-success-400">
                  <span>Discount:</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="success"
                className="w-full"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Complete Payment"
      >
        <div className="space-y-6">
          {/* Total Amount */}
          <div className="glass-card p-5">
            <p className="text-sm text-white/60 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-white">${calculateTotal().toFixed(2)}</p>
          </div>

          {/* Payment Method - Cash Only */}
          <div>
            <label className="input-label">Payment Method</label>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Cash</span>
                <Badge variant="success">Only Method</Badge>
              </div>
            </div>
          </div>

          {/* Money Received Input */}
          <div>
            <Input
              label="Money Received"
              type="number"
              name="money_received"
              value={moneyReceived}
              onChange={(e) => setMoneyReceived(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Change Display */}
          {moneyReceived && (
            <div className={`glass-card p-5 border-2 ${
              calculateChange() < 0
                ? 'border-danger-500/50 bg-danger-500/10'
                : 'border-success-500/50 bg-success-500/10'
            }`}>
              <p className="text-sm text-white/60 mb-1">Change to Return</p>
              <p className={`text-3xl font-bold ${
                calculateChange() < 0 ? 'text-danger-400' : 'text-success-400'
              }`}>
                {calculateChange() < 0 ? '-' : ''}${Math.abs(calculateChange()).toFixed(2)}
              </p>
              {calculateChange() < 0 && (
                <p className="text-xs text-danger-300 mt-2">
                  Insufficient payment - need ${Math.abs(calculateChange()).toFixed(2)} more
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowCheckout(false);
                setMoneyReceived('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="flex-1"
              onClick={handleCheckout}
              disabled={!moneyReceived || calculateChange() < 0}
            >
              Complete Sale
            </Button>
          </div>
        </div>
      </Modal>

      {/* Receipt Details Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={showReceiptDetail}
          onClose={() => {
            setShowReceiptDetail(false);
            setSelectedReceipt(null);
          }}
          title="Receipt Details"
        >
          <div className="space-y-6">
            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedReceipt.id}
              </h3>
              <p className="text-sm text-white/60">
                {new Date(selectedReceipt.date).toLocaleString()}
              </p>
              <Badge variant="success" className="mt-2">{selectedReceipt.payment}</Badge>
            </div>

            {/* Items List */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Items Purchased</h4>
              <div className="space-y-2">
                {selectedReceipt.cartItems.map((item, index) => (
                  <div key={index} className="glass-card p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm text-white font-medium">{item.name}</span>
                      <span className="text-sm text-white font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>${item.price.toFixed(2)} × {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="glass-card p-4">
              <h4 className="text-sm font-semibold text-white mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total Amount:</span>
                  <span className="text-white font-bold">${selectedReceipt.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Cash Received:</span>
                  <span className="text-success-400 font-bold">+${selectedReceipt.moneyReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                  <span className="text-white/80">Change Given:</span>
                  <span className="text-primary-400 font-bold text-lg">-${selectedReceipt.change.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setShowReceiptDetail(false);
                setSelectedReceipt(null);
              }}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SalesPage;
