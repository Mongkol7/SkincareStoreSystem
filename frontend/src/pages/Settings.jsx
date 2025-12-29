import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Tabs from '../components/common/Tabs';
import {
  Cog6ToothIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form states
  const [storeSettings, setStoreSettings] = useState({
    name: 'Skincare POS',
    email: 'contact@skincarepos.com',
    phone: '+1 234-567-8900',
    address: '123 Beauty Street, Wellness City',
    taxRate: '8.5',
    currency: 'USD',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlert: true,
    newOrders: true,
    dailyReport: false,
    systemUpdates: true,
  });

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
                <select className="select w-full">
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
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
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
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Registration Number</span>
                  <span className="text-white">REG-2024-001234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Tax ID</span>
                  <span className="text-white">TAX-9876543210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Business Type</span>
                  <span className="text-white">Retail - Skincare</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Established</span>
                  <span className="text-white">January 2023</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Operating Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Monday - Friday</span>
                  <span className="text-white">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Saturday</span>
                  <span className="text-white">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Sunday</span>
                  <span className="text-white">Closed</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="primary">Update Store Info</Button>
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
              <Button variant="primary">Save Preferences</Button>
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
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    New Password
                  </label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Confirm New Password
                  </label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <div className="flex justify-end">
                  <Button variant="primary">Update Password</Button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border border-danger-500/20">
              <h3 className="text-lg font-semibold text-danger-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-white/60 mb-4">
                Irreversible actions that affect your account
              </p>
              <Button variant="danger">Deactivate Account</Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

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
    </div>
  );
};

export default Settings;
