import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const { login } = useAuth();
  const { storeSettings } = useStoreSettings();

  // Debug logging
  console.log('Login page - Current store name:', storeSettings.name);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  // Define valid users with EXACT case-sensitive credentials
  const validUsers = {
    'admin@skincare.com': {
      password: 'password123',
      user: {
        id: 1,
        name: 'Admin User',
        email: 'admin@skincare.com',
        roles: [{ id: 1, name: 'Admin', url: '/admin' }],
      }
    },
    'cashier@skincare.com': {
      password: 'password123',
      user: {
        id: 2,
        name: 'Cashier User',
        email: 'cashier@skincare.com',
        roles: [{ id: 2, name: 'Cashier', url: '/cashier' }],
      }
    },
    'stock@skincare.com': {
      password: 'password123',
      user: {
        id: 3,
        name: 'Stock Manager',
        email: 'stock@skincare.com',
        roles: [{ id: 3, name: 'Stock Manager', url: '/stock-manager' }],
      }
    },
    'hr@skincare.com': {
      password: 'password123',
      user: {
        id: 4,
        name: 'HR User',
        email: 'hr@skincare.com',
        roles: [{ id: 4, name: 'HR', url: '/hr' }],
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await authService.login(formData);

      // Strict case-sensitive login validation
      setTimeout(() => {
        // Check if email exists (case-sensitive)
        const userCredentials = validUsers[formData.email];

        if (!userCredentials) {
          setApiError('Invalid email or password. Please check your credentials.');
          setLoading(false);
          return;
        }

        // Check if password matches exactly (case-sensitive)
        if (userCredentials.password !== formData.password) {
          setApiError('Invalid email or password. Please check your credentials.');
          setLoading(false);
          return;
        }

        // Login successful
        const mockToken = 'mock-jwt-token-' + Date.now();
        login(userCredentials.user, mockToken);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card-lg max-w-md w-full animate-scale-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
            <LockClosedIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{storeSettings.name}</h1>
          <p className="text-white/60 text-sm">Sign in to continue</p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="alert alert-danger mb-6">
            <p>{apiError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="input-label">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="w-5 h-5 text-white/40" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input pl-12 ${errors.email ? 'border-danger-500' : ''}`}
                placeholder="admin@skincare.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-danger-300">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="input-label">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="w-5 h-5 text-white/40" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input pl-12 ${errors.password ? 'border-danger-500' : ''}`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-danger-300">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="glass"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs text-white/60 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-white/80">
            <p>Admin: admin@skincare.com / password123</p>
            <p>Cashier: cashier@skincare.com / password123</p>
            <p>Stock Manager: stock@skincare.com / password123</p>
            <p>HR: hr@skincare.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
