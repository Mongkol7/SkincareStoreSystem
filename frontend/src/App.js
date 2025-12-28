import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CashierDashboard from './pages/CashierDashboard';
import StockManagerDashboard from './pages/StockManagerDashboard';
import HRDashboard from './pages/HRDashboard';

// Admin Pages
import Transactions from './pages/Transactions';
import Products from './pages/Products';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Cashier Pages
import Batches from './pages/Batches';

// Stock Manager Pages
import PurchaseOrders from './pages/PurchaseOrders';
import Inventory from './pages/Inventory';

// HR Pages
import Users from './pages/Users';

// Cashier Components
import OpenBatch from './components/cashier/OpenBatch';
import SalesPage from './components/cashier/SalesPage';
import CloseBatch from './components/cashier/CloseBatch';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Stock Manager']}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'HR']}>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Cashier Routes */}
          <Route
            path="/cashier/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Cashier', 'Admin']}>
                <CashierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier/open-batch"
            element={
              <ProtectedRoute allowedRoles={['Cashier', 'Admin']}>
                <div className="min-h-screen p-6">
                  <OpenBatch />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier/sales"
            element={
              <ProtectedRoute allowedRoles={['Cashier', 'Admin']}>
                <div className="min-h-screen p-6">
                  <SalesPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier/close-batch"
            element={
              <ProtectedRoute allowedRoles={['Cashier', 'Admin']}>
                <div className="min-h-screen p-6">
                  <CloseBatch />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute allowedRoles={['Cashier', 'Admin']}>
                <div className="min-h-screen p-6">
                  <SalesPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/batches"
            element={
              <ProtectedRoute allowedRoles={['Cashier', 'Admin']}>
                <Batches />
              </ProtectedRoute>
            }
          />

          {/* Stock Manager Routes */}
          <Route
            path="/stock-manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Stock Manager', 'Admin']}>
                <StockManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <ProtectedRoute allowedRoles={['Stock Manager', 'Admin']}>
                <PurchaseOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={['Stock Manager', 'Admin']}>
                <Inventory />
              </ProtectedRoute>
            }
          />

          {/* HR Routes */}
          <Route
            path="/hr/dashboard"
            element={
              <ProtectedRoute allowedRoles={['HR', 'Admin']}>
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['HR', 'Admin']}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
