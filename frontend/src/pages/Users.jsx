import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { MagnifyingGlassIcon, PlusIcon, KeyIcon } from '@heroicons/react/24/outline';

const Users = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user accounts data
  const users = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@skincare.com',
      fullName: 'David Brown',
      role: 'Admin',
      lastLogin: '2025-12-28 10:30 AM',
      status: 'Active',
      createdAt: '2023-05-12'
    },
    {
      id: 2,
      username: 'john.doe',
      email: 'john.doe@skincare.com',
      fullName: 'John Doe',
      role: 'Cashier',
      lastLogin: '2025-12-28 09:15 AM',
      status: 'Active',
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      username: 'jane.smith',
      email: 'jane.smith@skincare.com',
      fullName: 'Jane Smith',
      role: 'Cashier',
      lastLogin: '2025-12-27 05:45 PM',
      status: 'Active',
      createdAt: '2024-02-20'
    },
    {
      id: 4,
      username: 'mike.johnson',
      email: 'mike.johnson@skincare.com',
      fullName: 'Mike Johnson',
      role: 'Stock Manager',
      lastLogin: '2025-12-28 08:00 AM',
      status: 'Active',
      createdAt: '2023-11-10'
    },
    {
      id: 5,
      username: 'sarah.williams',
      email: 'sarah.williams@skincare.com',
      fullName: 'Sarah Williams',
      role: 'HR',
      lastLogin: '2025-12-27 02:30 PM',
      status: 'Active',
      createdAt: '2023-08-05'
    },
    {
      id: 6,
      username: 'emily.chen',
      email: 'emily.chen@skincare.com',
      fullName: 'Emily Chen',
      role: 'Cashier',
      lastLogin: '2025-12-15 11:20 AM',
      status: 'Inactive',
      createdAt: '2024-03-01'
    },
  ];

  const columns = [
    { field: 'username', label: 'Username' },
    { field: 'fullName', label: 'Full Name' },
    { field: 'email', label: 'Email' },
    {
      field: 'role',
      label: 'Role',
      render: (value) => (
        <span className={`badge ${
          value === 'Admin' ? 'badge-danger' :
          value === 'HR' ? 'badge-warning' :
          value === 'Stock Manager' ? 'badge-primary' :
          'badge-success'
        }`}>
          {value}
        </span>
      ),
    },
    {
      field: 'lastLogin',
      label: 'Last Login',
      render: (value) => <span className="text-white/70 text-sm">{value}</span>,
    },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${
          value === 'Active' ? 'badge-success' :
          'badge-danger'
        }`}>
          {value}
        </span>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button variant="primary" size="sm">
            <KeyIcon className="w-3 h-3" />
          </Button>
          {row.status === 'Active' ? (
            <Button variant="danger" size="sm">
              Disable
            </Button>
          ) : (
            <Button variant="success" size="sm">
              Enable
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Calculate summary stats
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const inactiveUsers = users.filter(u => u.status === 'Inactive').length;
  const adminUsers = users.filter(u => u.role === 'Admin').length;

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
                User Accounts
              </h2>
              <p className="text-white/60 text-sm">
                Manage system user accounts and permissions
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Active</p>
                <p className="text-2xl font-bold text-success-400">{activeUsers}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Inactive</p>
                <p className="text-2xl font-bold text-danger-400">{inactiveUsers}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Administrators</p>
                <p className="text-2xl font-bold text-warning-400">{adminUsers}</p>
              </div>
            </div>

            {/* User Accounts Table */}
            <Card>
              <CardHeader
                title="System Users"
                action={
                  <div className="flex gap-3">
                    <div className="relative">
                      <MagnifyingGlassIcon className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="primary" size="sm">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                }
              />
              <Table columns={columns} data={users} />
            </Card>

            {/* Security Notice */}
            <div className="mt-6 glass-card p-4 border border-warning-500/20">
              <div className="flex items-start gap-3">
                <KeyIcon className="w-5 h-5 text-warning-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-warning-400 mb-1">Security Notice</h3>
                  <p className="text-xs text-white/60">
                    Regularly review user access and permissions. Disable inactive accounts and enforce strong password policies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
