import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const StoreSettingsContext = createContext();

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  }
  return context;
};

export const StoreSettingsProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState({
    name: 'Skincare POS',
    email: 'contact@skincarepos.com',
    phone: '+1 234-567-8900',
    address: '123 Beauty Street, Wellness City',
    taxRate: '8.5',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(true);

  // Load store settings from API or localStorage
  useEffect(() => {
    loadStoreSettings();
  }, []);

  const loadStoreSettings = async () => {
    try {
      // First try to load from localStorage for immediate display
      const cachedSettings = localStorage.getItem('storeSettings');
      if (cachedSettings) {
        setStoreSettings(JSON.parse(cachedSettings));
      }

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        // No token, just use cached or default settings
        setLoading(false);
        return;
      }

      // Then fetch from API
      const response = await api.get('/settings');
      if (response.data?.store) {
        const settings = response.data.store;
        setStoreSettings(settings);
        localStorage.setItem('storeSettings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Error loading store settings:', error);
      // Use cached or default values
      if (error.response?.status === 403) {
        console.log('Authentication required for settings. Using defaults.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStoreSettings = async (newSettings) => {
    console.log('StoreSettingsContext: Updating store settings to:', newSettings);

    try {
      // Save to backend
      const response = await api.put('/settings', newSettings);

      // Update local state with response data
      const updatedSettings = response.data.store;
      setStoreSettings(updatedSettings);
      localStorage.setItem('storeSettings', JSON.stringify(updatedSettings));
      console.log('StoreSettingsContext: Updated and saved to backend and localStorage');

      return { success: true };
    } catch (error) {
      console.error('Error updating store settings:', error);

      // Fallback: update localStorage only if backend fails
      setStoreSettings(newSettings);
      localStorage.setItem('storeSettings', JSON.stringify(newSettings));
      console.log('StoreSettingsContext: Backend update failed, saved to localStorage only');

      return { success: false, error: error.message };
    }
  };

  const value = {
    storeSettings,
    updateStoreSettings,
    refreshStoreSettings: loadStoreSettings,
    loading,
  };

  return (
    <StoreSettingsContext.Provider value={value}>
      {children}
    </StoreSettingsContext.Provider>
  );
};
