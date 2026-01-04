const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const purchaseOrdersRoutes = require('./routes/purchaseOrders');
const transactionsRoutes = require('./routes/transactions');
const staffRoutes = require('./routes/staff');
const settingsRoutes = require('./routes/settings');
const batchesRoutes = require('./routes/batches');

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/batches', batchesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Skincare Store API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Skincare Store API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      purchaseOrders: '/api/purchase-orders',
      transactions: '/api/transactions',
      staff: '/api/staff',
      settings: '/api/settings',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Skincare Store API Server`);
  console.log(`📍 Server is running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
  console.log('Available endpoints:');
  console.log(`  - POST   /api/auth/login`);
  console.log(`  - GET    /api/auth/me`);
  console.log(`  - GET    /api/products`);
  console.log(`  - GET    /api/purchase-orders`);
  console.log(`  - GET    /api/transactions`);
  console.log(`  - GET    /api/staff`);
  console.log(`  - GET    /api/settings`);
  console.log(`  - GET    /api/health`);
  console.log('='.repeat(50));
});

module.exports = app;
