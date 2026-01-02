import React from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const ReorderModal = ({ isOpen, onClose, product, formData, onFormChange, onSubmit }) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reorder Product"
      size="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-4">
          <p className="text-sm text-white/80">
            <strong>Reorder</strong> is for restocking existing products.
            Product details and pricing are already in the system.
          </p>
        </div>

        <div className="glass-card p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Product Details (Auto-filled)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60 mb-1">Product Name</p>
              <p className="text-sm text-white font-medium">{product.name}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Category</p>
              <p className="text-sm text-white/80">{product.category}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Current Stock</p>
              <p className="text-sm font-bold text-danger-400">{product.stock} units</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Min Stock Level</p>
              <p className="text-sm text-white/80">{product.min_stock} units</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-white/60 mb-1">Supplier (Auto-filled)</p>
              <p className="text-sm text-white font-medium">{product.supplier}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Order Quantity *
          </label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) => onFormChange({ ...formData, quantity: e.target.value })}
            placeholder="Enter quantity to order"
            min="1"
            required
          />
          <p className="text-xs text-white/60 mt-1">
            Suggested: {product.min_stock - product.stock} units to reach minimum stock level
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Expected Delivery Date *</label>
          <Input
            type="date"
            value={formData.expectedDelivery}
            onChange={(e) => onFormChange({ ...formData, expectedDelivery: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="glass-card p-4 bg-success-500/10 border border-success-500/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60 mb-1">Unit Price (Auto-filled)</p>
              <p className="text-lg font-bold text-success-400">
                ${product.price ? product.price.toFixed(2) : '0.00'}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Estimated Total</p>
              <p className="text-lg font-bold text-white">
                ${product.price && formData.quantity
                  ? (product.price * parseInt(formData.quantity || 0)).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Reorder
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReorderModal;
