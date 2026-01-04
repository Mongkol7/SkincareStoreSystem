import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const POContext = createContext();

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const usePO = () => {
  return useContext(POContext);
};

export const POProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [poItems, setPOItems] = useState([{ product: '', quantity: '', unitPrice: '' }]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch purchase orders from backend
  const fetchPurchaseOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Only fetch POs if user is Admin or Stock Manager
    const userRole = user?.roles?.[0]?.name;
    if (userRole !== 'Admin' && userRole !== 'Stock Manager') {
      setLoading(false);
      setPurchaseOrders([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/purchase-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchaseOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setLoading(false);
      // Use fallback data if backend is not available
      setPurchaseOrders([
        {
          id: 1,
          poNumber: 'PO-2025-001',
          supplier: 'GlowSkin Supplies',
          date: '2025-12-28',
          items: 15,
          totalAmount: 2450.00,
          status: 'Pending',
          expectedDelivery: '2025-12-30',
          itemsList: [
            { product: 'Moisturizing Cream 50ml', quantity: 10, unitPrice: 180.00 },
            { product: 'Sunscreen SPF 50 75ml', quantity: 5, unitPrice: 130.00 }
          ],
          notes: 'Urgent restock needed',
          createdBy: 'Admin User',
          approvedBy: null
        },
        {
          id: 2,
          poNumber: 'PO-2025-002',
          supplier: 'PureGlow Wholesale',
          date: '2025-12-27',
          items: 22,
          totalAmount: 3780.50,
          status: 'Approved',
          expectedDelivery: '2025-12-29',
          itemsList: [
            { product: 'Face Wash 200ml', quantity: 12, unitPrice: 95.00 },
            { product: 'Night Serum 30ml', quantity: 10, unitPrice: 264.05 }
          ],
          notes: '',
          createdBy: 'Admin User',
          approvedBy: 'Manager User'
        },
      ]);
    }
  };

  // Fetch POs when component mounts or token changes
  useEffect(() => {
    fetchPurchaseOrders();

    // Auto-refresh every 5 seconds to sync across tabs
    const intervalId = setInterval(() => {
      if (token) {
        fetchPurchaseOrders();
      }
    }, 5000);

    // Refresh when tab becomes visible (user switches back to this tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && token) {
        fetchPurchaseOrders();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, user]);

  const openCreatePOModal = (items = null) => {
    if (items) {
      setPOItems(items);
    } else {
      setPOItems([{ product: '', quantity: '', unitPrice: '' }]);
    }
    setIsCreateModalOpen(true);
  };

  const closeCreatePOModal = () => {
    setIsCreateModalOpen(false);
    setPOItems([{ product: '', quantity: '', unitPrice: '' }]);
  };

  const handleCreatePO = async (formData) => {
    const totalItems = poItems.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    const totalAmount = poItems.reduce((sum, item) =>
      sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);

    const poData = {
      supplier: formData.supplier,
      expectedDelivery: formData.expectedDelivery,
      items: totalItems,
      totalAmount: totalAmount,
      itemsList: poItems.map(item => ({
        product: item.product,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice)
      })),
      notes: formData.notes || ''
    };

    try {
      // Send to backend
      const response = await axios.post(`${API_URL}/purchase-orders`, poData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add to local state
      setPurchaseOrders([response.data, ...purchaseOrders]);
      closeCreatePOModal();
      alert(`✓ Purchase Order ${response.data.poNumber} created successfully!`);
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Failed to create purchase order. Please try again.');
    }
  };

  // Handle Reorder - for existing products (auto-fills unit price from product data)
  const handleReorder = async (productData, quantity, expectedDelivery) => {
    const unitPrice = productData.price || 0;
    const totalAmount = parseInt(quantity) * unitPrice;

    const poData = {
      supplier: productData.supplier,
      expectedDelivery: expectedDelivery,
      items: 1,
      totalAmount: totalAmount,
      itemsList: [{
        product: productData.name,
        quantity: parseInt(quantity),
        unitPrice: unitPrice // Auto-filled from existing product price
      }],
      notes: `Reorder for ${productData.name} - Low stock alert`
    };

    try {
      // Send to backend
      const response = await axios.post(`${API_URL}/purchase-orders`, poData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add to local state
      setPurchaseOrders([response.data, ...purchaseOrders]);
      return response.data;
    } catch (error) {
      console.error('Error creating reorder:', error);
      alert('Failed to create reorder. Please try again.');
      return null;
    }
  };


  // Update purchase order (for approve, reject, mark as received, etc.)
  const updatePurchaseOrder = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/purchase-orders/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setPurchaseOrders(purchaseOrders.map(po =>
        po.id === id ? response.data : po
      ));
      return response.data;
    } catch (error) {
      console.error('Error updating purchase order:', error);
      throw error;
    }
  };

  const value = {
    isCreateModalOpen,
    poItems,
    setPOItems,
    openCreatePOModal,
    closeCreatePOModal,
    purchaseOrders,
    setPurchaseOrders,
    handleCreatePO,
    handleReorder,
    updatePurchaseOrder,
    fetchPurchaseOrders,
    loading,
  };

  return <POContext.Provider value={value}>{children}</POContext.Provider>;
};
