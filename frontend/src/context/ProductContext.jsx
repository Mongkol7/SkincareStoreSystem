import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // No token, user not logged in yet
        return;
      }
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // If 403, user likely not authenticated properly
      if (error.response?.status === 403) {
        console.log('Authentication required. Please login.');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProducts();
    }
  }, []);

  const updateProduct = async (updatedProduct) => {
    try {
      const response = await api.put(`/products/${updatedProduct.id}`, updatedProduct);
      await fetchProducts(); // Refetch products after update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const addProduct = async (newProduct) => {
    try {
      const response = await api.post('/products', newProduct);
      await fetchProducts(); // Refetch products after adding
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }

  const value = {
    products,
    updateProduct,
    addProduct,
    fetchProducts, // Expose fetchProducts so it can be called after login
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};