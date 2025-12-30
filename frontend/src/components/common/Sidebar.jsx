import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, userRole }) => {
  const getMenuItems = () => {
    // Dashboard path varies by role
    const dashboardPath = userRole === 'HR' ? '/hr/dashboard' : '/dashboard';

    const baseItems = [
      { to: dashboardPath, icon: HomeIcon, label: 'Dashboard' },
    ];

    const roleMenus = {
      Admin: [
        { to: '/transactions', icon: ShoppingCartIcon, label: 'Transactions' },
        { to: '/products', icon: CubeIcon, label: 'Products' },
        { to: '/staff', icon: UsersIcon, label: 'Staff Management' },
        { to: '/reports', icon: ChartBarIcon, label: 'Reports' },
        { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
      ],
      Cashier: [
        { to: '/sales', icon: ShoppingCartIcon, label: 'Sales' },
        { to: '/batches', icon: ChartBarIcon, label: 'My Batches' },
      ],
      'Stock Manager': [
        { to: '/products', icon: CubeIcon, label: 'Products' },
        { to: '/purchase-orders', icon: ShoppingCartIcon, label: 'Purchase Orders' },
        { to: '/inventory', icon: ChartBarIcon, label: 'Inventory' },
      ],
      HR: [
        // HR role doesn't need additional menu items since Dashboard has tabs
      ],
    };

    return [...baseItems, ...(roleMenus[userRole] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 glass-card-lg p-4
          transform transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-bold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? 'bg-white/20 text-white shadow-soft'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass-card p-4">
            <p className="text-xs text-white/60 mb-1">Logged in as</p>
            <p className="text-sm font-medium text-white">{userRole}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
