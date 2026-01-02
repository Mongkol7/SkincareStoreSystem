# Skincare Store Backend API

Backend API for the Skincare Store Management System with file-based JSON storage.

## Features

- ✅ JWT Authentication
- ✅ Role-Based Access Control (Admin, Cashier, Stock Manager, HR)
- ✅ RESTful API Design
- ✅ File-Based JSON Storage (No Database Required)
- ✅ CORS Enabled
- ✅ Complete CRUD Operations

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **File System** - JSON file-based storage

## Installation

```bash
# Install dependencies
npm install

# Create .env file (already created)
# Update environment variables if needed

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Purchase Orders
- `GET /api/purchase-orders` - Get all purchase orders
- `GET /api/purchase-orders/:id` - Get purchase order by ID
- `POST /api/purchase-orders` - Create new purchase order
- `PATCH /api/purchase-orders/:id/approve` - Approve purchase order (Admin only)
- `PUT /api/purchase-orders/:id` - Update purchase order
- `DELETE /api/purchase-orders/:id` - Delete purchase order

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/date-range?startDate=&endDate=` - Get transactions by date range
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member

### Users (HR)
- `GET /api/staff/users/all` - Get all user accounts
- `POST /api/staff/users` - Create new user account
- `PUT /api/staff/users/:id` - Update user account
- `DELETE /api/staff/users/:id` - Delete user account

### Settings
- `GET /api/settings` - Get store settings (requires auth)
- `PUT /api/settings` - Update store settings (Admin only)

## Demo Users

All users have password: `password123`

- **Admin**: admin@skincare.com
- **Cashier**: cashier@skincare.com
- **Stock Manager**: stock@skincare.com
- **HR**: hr@skincare.com

## Role Permissions

### Admin
- Full access to all endpoints
- Can approve purchase orders
- Can manage all resources

### Stock Manager
- View and manage products
- Create purchase orders (require Admin approval)
- View inventory

### Cashier
- View products
- Create and view transactions
- Process sales

### HR
- Manage staff
- Manage user accounts
- View HR dashboard

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Example login request:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skincare.com","password":"password123"}'
```

## File Storage

Data is stored in JSON files in `src/data/`:
- `users.json` - User accounts
- `products.json` - Products inventory
- `purchaseOrders.json` - Purchase orders
- `transactions.json` - Sales transactions
- `staff.json` - Staff members
- `settings.json` - Store settings

All file operations are handled by the `FileStorage` utility class (except settings which uses direct fs operations).

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# View server logs
# Check console output
```

## Server Status

Health check endpoint:
```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Skincare Store API is running",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Notes

- This backend uses file-based storage for demonstration purposes
- For production, consider migrating to a proper database (PostgreSQL, MongoDB, etc.)
- Default passwords are hashed with bcryptjs
- JWT tokens expire after 24 hours
