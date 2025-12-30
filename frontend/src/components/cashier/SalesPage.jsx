import React, { useState } from 'react';
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
} from '@heroicons/react/24/outline';

const SalesPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Mock products data
  const products = [
    { id: 1, name: 'Hydrating Cleanser', category: 'Cleanser', price: 24.99, stock: 50, image: '🧴' },
    { id: 2, name: 'Vitamin C Serum', category: 'Serum', price: 45.00, stock: 30, image: '💧' },
    { id: 3, name: 'Moisturizing Cream', category: 'Cream', price: 32.50, stock: 40, image: '🫙' },
    { id: 4, name: 'Sunscreen SPF 50', category: 'Sunscreen', price: 28.00, stock: 60, image: '☀️' },
    { id: 5, name: 'Toner Essence', category: 'Toner', price: 22.00, stock: 35, image: '💦' },
    { id: 6, name: 'Face Mask Pack', category: 'Mask', price: 15.99, stock: 80, image: '🎭' },
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Cleanser', label: 'Cleanser' },
    { value: 'Serum', label: 'Serum' },
    { value: 'Cream', label: 'Cream' },
    { value: 'Sunscreen', label: 'Sunscreen' },
    { value: 'Toner', label: 'Toner' },
    { value: 'Mask', label: 'Mask' },
  ];

  const paymentMethods = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Credit/Debit Card' },
    { value: 'Mobile', label: 'Mobile Payment' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1, discount: 0 }]);
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
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      return sum + (itemTotal * item.discount) / 100;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleCheckout = () => {
    // TODO: Process payment and create sale
    console.log('Processing sale...', {
      items: cart,
      paymentMethod,
      total: calculateTotal(),
    });
    setCart([]);
    setShowCheckout(false);
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
                className="glass-card p-4 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => addToCart(product)}
              >
                <div className="text-4xl mb-3 text-center">{product.image}</div>
                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="glass">{product.category}</Badge>
                  <span className="text-xs text-white/60">Stock: {product.stock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">${product.price}</span>
                  <Button variant="primary" size="sm">
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
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
            <div className="text-center py-8">
              <ShoppingCartIcon className="w-16 h-16 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 text-sm">Cart is empty</p>
            </div>
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
                        <p className="text-xs text-white/60">${item.price} each</p>
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
          <div className="glass-card p-5">
            <p className="text-sm text-white/60 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-white">${calculateTotal().toFixed(2)}</p>
          </div>

          <Select
            label="Payment Method"
            name="payment_method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={paymentMethods}
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowCheckout(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="flex-1"
              onClick={handleCheckout}
            >
              Complete Sale
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SalesPage;
