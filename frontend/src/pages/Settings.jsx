import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Tabs from '../components/common/Tabs';
import StoreNameDisplay from '../components/debug/StoreNameDisplay';
import api from '../services/api';
import {
  Cog6ToothIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const { storeSettings: globalStoreSettings, updateStoreSettings: updateGlobalStoreSettings } = useStoreSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Form states - initialize from global context
  const [storeSettings, setStoreSettings] = useState(globalStoreSettings);

  const [storeInfo, setStoreInfo] = useState({
    registrationNumber: 'REG-2024-001234',
    taxId: 'TAX-9876543210',
    businessType: 'Retail - Skincare',
    established: 'January 2023',
    operatingHours: {
      weekday: '9:00 AM - 8:00 PM',
      saturday: '10:00 AM - 6:00 PM',
      sunday: 'Closed',
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlert: true,
    newOrders: true,
    dailyReport: false,
    systemUpdates: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Sync with global store settings
  useEffect(() => {
    setStoreSettings(globalStoreSettings);
  }, [globalStoreSettings]);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data) {
        if (response.data.store) {
          setStoreSettings(response.data.store);
          // Note: Don't call updateGlobalStoreSettings here as it will trigger a backend save
          // The context already loads from backend on mount
        }
        setStoreInfo(response.data.storeInfo || storeInfo);
        setNotificationSettings(response.data.notifications || notificationSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Use default values if API fails
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSaveGeneralSettings = async () => {
    setLoading(true);
    console.log('Saving store settings:', storeSettings);
    try {
      // Update via global context (which now saves to backend)
      const result = await updateGlobalStoreSettings(storeSettings);
      console.log('Global context updated');

      if (result.success) {
        showNotification('General settings saved successfully', 'success');
      } else {
        showNotification('Settings saved locally (backend unavailable)', 'success');
      }
    } catch (error) {
      console.error('Error saving general settings:', error);
      showNotification('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStoreInfo = async () => {
    setLoading(true);
    try {
      await api.put('/settings/store-info', storeInfo);
      showNotification('Store information updated successfully', 'success');
    } catch (error) {
      console.error('Error saving store info:', error);
      showNotification('Failed to update store information', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await api.put('/settings/notifications', notificationSettings);
      showNotification('Notification preferences saved successfully', 'success');
    } catch (error) {
      console.error('Error saving notifications:', error);
      showNotification('Failed to save notification preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.put('/settings/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showNotification('Password changed successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification(error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      // Implementation for account deactivation
      showNotification('Account deactivation requested', 'success');
    }
  };

  const tabContent = [
    {
      label: 'General',
      icon: <Cog6ToothIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader title="General Settings" />
          <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Store Name
                </label>
                <Input
                  type="text"
                  value={storeSettings.name}
                  onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                />
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={storeSettings.phone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Currency
                </label>
                <select
                  className="glass-input w-full"
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>

          <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Address
              </label>
              <Input
                type="text"
                value={storeSettings.address}
                onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
              />
            </div>

          <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tax Rate (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={storeSettings.taxRate}
                onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
              />
            </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setStoreSettings(globalStoreSettings)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveGeneralSettings} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      label: 'Store Info',
      icon: <BuildingStorefrontIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader title="Store Information" />
          <div className="p-6 space-y-4">
          <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Business Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Registration Number
                  </label>
                  <Input
                    type="text"
                    value={storeInfo.registrationNumber}
                    onChange={(e) => setStoreInfo({ ...storeInfo, registrationNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Tax ID
                  </label>
                  <Input
                    type="text"
                    value={storeInfo.taxId}
                    onChange={(e) => setStoreInfo({ ...storeInfo, taxId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Business Type
                  </label>
                  <Input
                    type="text"
                    value={storeInfo.businessType}
                    onChange={(e) => setStoreInfo({ ...storeInfo, businessType: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Established
                  </label>
                  <Input
                    type="text"
                    value={storeInfo.established}
                    onChange={(e) => setStoreInfo({ ...storeInfo, established: e.target.value })}
                  />
                </div>
              </div>
            </div>

          <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Operating Hours</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Monday - Friday
                  </label>
                  <Input
                    type="text"
                    value={storeInfo.operatingHours.weekday}
                    onChange={(e) => setStoreInfo({
                      ...storeInfo,
                      operatingHours: { ...storeInfo.operatingHours, weekday: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Saturday
                  </label>
                  <Input
                    type="text"
                    value={storeInfo.operatingHours.saturday}
                    onChange={(e) => setStoreInfo({
                      ...storeInfo,
                      operatingHours: { ...storeInfo.operatingHours, saturday: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Sunday
                  </label>
                  <Input
                    type="text"
                    value={storeInfo.operatingHours.sunday}
                    onChange={(e) => setStoreInfo({
                      ...storeInfo,
                      operatingHours: { ...storeInfo.operatingHours, sunday: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleSaveStoreInfo} disabled={loading}>
              {loading ? 'Updating...' : 'Update Store Info'}
            </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      label: 'Notifications',
      icon: <BellIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader title="Notification Preferences" />
          <div className="p-6 space-y-4">
            {Object.entries({
              lowStockAlert: 'Low Stock Alerts',
              newOrders: 'New Order Notifications',
              dailyReport: 'Daily Sales Reports',
              systemUpdates: 'System Updates',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between glass-card p-4">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-white/60">
                    Receive notifications about {label.toLowerCase()}
                  </p>
              </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[key]}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        [key]: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}

          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleSaveNotifications} disabled={loading}>
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      label: 'Account',
      icon: <UserCircleIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader title="Account Settings" />
          <div className="p-6 space-y-6">
          <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
              </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
              </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
              </div>
                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleChangePassword} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
              </div>
              </div>
            </div>

          <div className="glass-card p-6 border border-danger-500/20">
              <h3 className="text-lg font-semibold text-danger-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-white/60 mb-4">
                Irreversible actions that affect your account
              </p>
            <Button variant="danger" onClick={handleDeactivateAccount}>Deactivate Account</Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Debug Component - Remove in production */}
      <StoreNameDisplay />

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`glass-card p-4 flex items-center gap-3 ${
            notification.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            ) : (
              <XCircleIcon className="w-6 h-6 text-red-500" />
            )}
            <span className="text-white">{notification.message}</span>
          </div>
        </div>
      )}

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
                Settings
              </h2>
            <p className="text-white/60 text-sm">
                Configure system preferences and account settings
              </p>
            </div>

          <Tabs tabs={tabContent} />
          </div>
      </div>
    </div>
  );
};

export default Settings;
