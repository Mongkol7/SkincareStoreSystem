import React, { useState, useMemo } from 'react';
import { usePO } from '../../context/POContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const CreatePOModal = () => {
  const { isCreateModalOpen, poItems, setPOItems, closeCreatePOModal, handleCreatePO, purchaseOrders } = usePO();
  const [formData, setFormData] = useState({
    supplier: '',
    expectedDelivery: '',
    notes: ''
  });
  const [isAddingNewSupplier, setIsAddingNewSupplier] = useState(false);

  // Get unique suppliers from existing purchase orders
  const existingSuppliers = useMemo(() => {
    const suppliers = [...new Set(purchaseOrders.map(po => po.supplier))];
    return suppliers.sort();
  }, [purchaseOrders]);

  // Reset form
  const resetForm = () => {
    setFormData({ supplier: '', expectedDelivery: '', notes: '' });
    setIsAddingNewSupplier(false);
  };

  // Add item to PO
  const addPOItem = () => {
    setPOItems([...poItems, { product: '', quantity: '', unitPrice: '' }]);
  };

  // Remove item from PO
  const removePOItem = (index) => {
    setPOItems(poItems.filter((_, i) => i !== index));
  };

  // Update item
  const updatePOItem = (index, field, value) => {
    const newItems = [...poItems];
    newItems[index][field] = value;
    setPOItems(newItems);
  };

  const submitPO = (e) => {
    e.preventDefault();
    handleCreatePO(formData);
    resetForm();
  }

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={() => { closeCreatePOModal(); resetForm(); }}
      title="Create Purchase Order - New Products"
      size="lg"
    >
      <form onSubmit={submitPO} className="space-y-6">
        <div className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-4 mb-4">
          <p className="text-sm text-white/80">
            <strong>Create PO</strong> is for ordering NEW products that are not in the inventory system yet.
            You must specify unit prices. For restocking existing products, use <strong>Reorder</strong> instead.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Supplier *</label>
            {!isAddingNewSupplier ? (
              <div className="flex gap-2">
                <Select
                  required
                  value={formData.supplier}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setIsAddingNewSupplier(true);
                      setFormData({ ...formData, supplier: '' });
                    } else {
                      setFormData({ ...formData, supplier: e.target.value });
                    }
                  }}
                  className="flex-1"
                >
                  <option value="">Select existing supplier</option>
                  {existingSuppliers.map(supplier => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                  <option value="__add_new__">+ Add New Supplier</option>
                </Select>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Enter new supplier name"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsAddingNewSupplier(false);
                    setFormData({ ...formData, supplier: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Expected Delivery *</label>
            <Input
              type="date"
              required
              value={formData.expectedDelivery}
              onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm text-white/60">Order Items *</label>
            <Button type="button" variant="secondary" size="sm" onClick={addPOItem}>
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
          <div className="space-y-3">
            {poItems.map((item, index) => (
              <div key={index} className="flex gap-3 items-start">
                <Input
                  required
                  placeholder="Product name"
                  value={item.product}
                  onChange={(e) => updatePOItem(index, 'product', e.target.value)}
                  className="flex-1"
                />
                <Input
                  required
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updatePOItem(index, 'quantity', e.target.value)}
                  className="w-28"
                  min="1"
                />
                <Input
                  required
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => updatePOItem(index, 'unitPrice', e.target.value)}
                  className="w-28"
                  min="0.01"
                />
                {poItems.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removePOItem(index)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Notes</label>
          <textarea
            className="textarea w-full"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            Create Purchase Order
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => { closeCreatePOModal(); resetForm(); }}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePOModal;
