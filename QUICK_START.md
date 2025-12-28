# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Open Terminal in Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies (First Time Only)
```bash
npm install
```

### Step 3: Start the Application
```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

---

## 🔐 Demo Login Credentials

### Admin Account
```
Email: admin@skincare.com
Password: password123
```
**Access:** Full system control, analytics, all modules

### Cashier Account
```
Email: cashier@skincare.com
Password: password123
```
**Access:** Sales operations, batch management

### Stock Manager Account
```
Email: stock@skincare.com
Password: password123
```
**Access:** Inventory management, purchase orders

### HR Account
```
Email: hr@skincare.com
Password: password123
```
**Access:** Staff management, user accounts

---

## 📱 What to Explore

### As CASHIER:
1. **Open a Batch** - Start your shift with opening cash
2. **Make a Sale** - Browse products, add to cart, checkout
3. **Close Batch** - Reconcile cash and close your shift

### As STOCK MANAGER:
1. View **Low Stock Alerts**
2. Create **Purchase Orders**
3. Manage **Inventory Levels**

### As HR:
1. Browse **Staff Directory**
2. Search and filter employees
3. View staff details

### As ADMIN:
1. View **Sales Dashboard**
2. Monitor **Transactions**
3. Check **Low Stock Items**
4. Access **All Modules**

---

## 🎨 UI Features to Notice

- **Glass Morphism Design** - Frosted glass effects throughout
- **Smooth Animations** - Fade in, slide up, scale transitions
- **Beautiful Tabs** - Elegant tab navigation
- **Responsive Layout** - Works on all screen sizes
- **Inter Font** - Professional, clean typography
- **Purple Gradient Background** - Eye-catching aesthetic

---

## 🛠️ Troubleshooting

### Port Already in Use?
If port 3000 is busy, the app will offer to run on another port. Just press `Y` to continue.

### Dependencies Error?
```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

### Browser Doesn't Open?
Manually open: `http://localhost:3000`

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/       # All UI components
│   │   ├── common/       # Reusable components (Button, Card, etc.)
│   │   ├── auth/         # Authentication components
│   │   ├── cashier/      # Cashier workflow
│   │   ├── admin/        # Admin components
│   │   ├── stockManager/ # Stock Manager components
│   │   └── hr/           # HR components
│   ├── pages/            # Main page components
│   ├── context/          # React Context (Auth)
│   ├── services/         # API services
│   └── utils/            # Utilities
```

---

## 🎯 Key Features

✅ Role-based authentication
✅ Beautiful glassy UI design
✅ Complete cashier workflow
✅ Inventory management
✅ Staff management
✅ Responsive design
✅ Mock data for testing

---

## 📝 Notes

- Currently uses **mock data** for demonstration
- Backend API integration ready
- All components are production-ready
- Fully responsive and mobile-friendly

---

**Enjoy exploring the system!** 🎉
