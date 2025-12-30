import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { MagnifyingGlassIcon, PlusIcon, KeyIcon } from '@heroicons/react/24/outline';

const Users = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Mock user accounts data with state
  const [usersList, setUsersList] = useState([
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
  ]);

  // Handler functions
  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: usersList.length + 1,
      ...formData,
      lastLogin: 'Never',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsersList([...usersList, newUser]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditUser = (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setUsersList(usersList.map(u => {
      if (u.id === selectedUser.id) {
        const updatedUser = {
          ...u,
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role
        };
        // Only update password if a new one is provided
        if (formData.password && formData.password.trim() !== '') {
          console.log('Password updated for user:', formData.username);
          // In real app, this would hash and update password
        }
        return updatedUser;
      }
      return u;
    }));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Password reset for user:', selectedUser.username);
    setIsPasswordModalOpen(false);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
  };

  const handleToggleStatus = (userId) => {
    setUsersList(usersList.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
    ));
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setIsEditModalOpen(true);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      role: '',
      password: '',
      confirmPassword: ''
    });
    setSelectedUser(null);
  };

  // Filter users based on search
  const filteredUsers = usersList.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button variant="secondary" size="sm" onClick={() => openEditModal(row)}>
            Edit
          </Button>
          <Button variant="primary" size="sm" onClick={() => openPasswordModal(row)}>
            <KeyIcon className="w-3 h-3" />
          </Button>
          {row.status === 'Active' ? (
            <Button variant="danger" size="sm" onClick={() => handleToggleStatus(row.id)}>
              Disable
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={() => handleToggleStatus(row.id)}>
              Enable
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Calculate summary stats
  const activeUsers = usersList.filter(u => u.status === 'Active').length;
  const inactiveUsers = usersList.filter(u => u.status === 'Inactive').length;
  const adminUsers = usersList.filter(u => u.role === 'Admin').length;

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
                <p className="text-2xl font-bold text-white">{usersList.length}</p>
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
                    <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                }
              />
              <Table columns={columns} data={filteredUsers} />
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

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); resetForm(); }}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleAddUser}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Username *</label>
              <Input
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="john.doe"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Full Name *</label>
              <Input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Email *</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john.doe@skincare.com"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Role *</label>
              <select
                required
                className="select w-full"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="Stock Manager">Stock Manager</option>
                <option value="Cashier">Cashier</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Password *</label>
              <Input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter password"
                minLength={6}
              />
              <p className="text-xs text-white/40 mt-1">Minimum 6 characters</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); resetForm(); }}
        title="Edit User"
        size="md"
      >
        <form onSubmit={handleEditUser}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Username *</label>
              <Input
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Full Name *</label>
              <Input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Email *</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Role *</label>
              <select
                required
                className="select w-full"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="Stock Manager">Stock Manager</option>
                <option value="Cashier">Cashier</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">New Password (Optional)</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Leave empty to keep current password"
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Confirm New Password</label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                minLength={6}
              />
              <p className="text-xs text-white/40 mt-1">Only fill these if you want to change the password</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => { setIsEditModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => { setIsPasswordModalOpen(false); setPasswordForm({ newPassword: '', confirmPassword: '' }); }}
        title="Reset Password"
        size="sm"
      >
        {selectedUser && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <div className="glass-card p-4 mb-4">
                <p className="text-sm text-white/60">Resetting password for:</p>
                <p className="text-white font-semibold">{selectedUser.fullName}</p>
                <p className="text-xs text-white/40">{selectedUser.username}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">New Password *</label>
                  <Input
                    required
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Confirm Password *</label>
                  <Input
                    required
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-white/40">Minimum 6 characters</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={() => { setIsPasswordModalOpen(false); setPasswordForm({ newPassword: '', confirmPassword: '' }); }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Users;
