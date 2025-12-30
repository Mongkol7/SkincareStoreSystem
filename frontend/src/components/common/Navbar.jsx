import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const Navbar = ({ user, onMenuToggle }) => {
  const navigate = useNavigate();
  const { storeSettings } = useStoreSettings();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // Update dropdown position when showing
  useEffect(() => {
    if (showUserMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showUserMenu]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    // Add small delay to prevent immediate closing on the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass-card mb-6 sticky top-0 z-[60]">
      <div className="flex items-center justify-between p-4">
        {/* Left: Menu Toggle + Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">{storeSettings.name}</h1>
            <p className="text-xs text-white/60">Point of Sale System</p>
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/60">{user?.roles?.[0]?.name}</p>
            </div>
            <UserCircleIcon className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu - Rendered via Portal at document root */}
      {showUserMenu && createPortal(
        <div
          ref={menuRef}
          className="fixed w-48 glass-card animate-scale-in"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
            zIndex: 9999
          }}
        >
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
