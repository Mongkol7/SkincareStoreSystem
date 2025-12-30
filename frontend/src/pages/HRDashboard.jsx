import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Tabs from '../components/common/Tabs';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import {
  UsersIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  KeyIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const HRDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'Cashier',
    password: '',
    confirmPassword: '',
  });

  const stats = {
    totalStaff: 24,
    activeStaff: 20,
    newThisMonth: 3,
    pendingAccounts: 2,
  };

  const staffData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@skincare.com',
      role: 'Cashier',
      hire_date: '2023-01-15',
      status: 'Active',
      phone: '555-0101',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@skincare.com',
      role: 'Stock Manager',
      hire_date: '2023-03-20',
      status: 'Active',
      phone: '555-0102',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@skincare.com',
      role: 'Cashier',
      hire_date: '2023-06-10',
      status: 'Active',
      phone: '555-0103',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@skincare.com',
      role: 'Admin',
      hire_date: '2022-11-05',
      status: 'Active',
      phone: '555-0104',
    },
    {
      id: 5,
      name: 'Tom Brown',
      email: 'tom@skincare.com',
      role: 'Cashier',
      hire_date: '2023-09-01',
      status: 'Inactive',
      phone: '555-0105',
    },
  ];

  // User accounts data
  const userAccounts = [
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

  const filteredStaff = staffData.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = userAccounts.filter((user) =>
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Handler functions
  const handleAddUser = (e) => {
    e.preventDefault();
    console.log('Add user:', userForm);
    setIsAddUserModalOpen(false);
    setUserForm({
      username: '',
      email: '',
      fullName: '',
      role: 'Cashier',
      password: '',
      confirmPassword: '',
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      password: '',
      confirmPassword: '',
    });
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    console.log('Update user:', selectedUser.id, userForm);
    setIsEditUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleToggleUserStatus = (user) => {
    console.log('Toggle status for user:', user.id);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.username}?`)) {
      console.log('Delete user:', user.id);
    }
  };

  const staffColumns = [
    {
      field: 'name',
      label: 'Name',
      render: (value, row) => (
        <div>
          <p className="text-sm font-medium text-white">{value}</p>
          <p className="text-xs text-white/60">{row.email}</p>
        </div>
      ),
    },
    { field: 'role', label: 'Role' },
    { field: 'phone', label: 'Phone' },
    {
      field: 'hire_date',
      label: 'Hire Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      ),
    },
    {
      field: 'id',
      label: 'Action',
      render: (value) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/hr/staff/${value}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const userAccountColumns = [
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
        <Badge variant={value === 'Active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(row);
            }}
          >
            <PencilIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleResetPassword(row);
            }}
          >
            <KeyIcon className="w-3 h-3" />
          </Button>
          {row.status === 'Active' ? (
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleUserStatus(row);
              }}
            >
              Disable
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleUserStatus(row);
              }}
            >
              Enable
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Calculate user stats
  const activeUsers = userAccounts.filter(u => u.status === 'Active').length;
  const inactiveUsers = userAccounts.filter(u => u.status === 'Inactive').length;
  const adminUsers = userAccounts.filter(u => u.role === 'Admin').length;

  const tabContent = [
    {
      label: 'Dashboard',
      icon: <ChartBarIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={<UsersIcon className="w-6 h-6 text-white" />}
              label="Total Staff"
              value={stats.totalStaff}
            />
            <StatsCard
              icon={<UsersIcon className="w-6 h-6 text-white" />}
              label="Active Staff"
              value={stats.activeStaff}
            />
            <StatsCard
              icon={<UserPlusIcon className="w-6 h-6 text-white" />}
              label="New This Month"
              value={stats.newThisMonth}
              trend="up"
              trendValue="2"
            />
            <StatsCard
              icon={<UsersIcon className="w-6 h-6 text-white" />}
              label="Pending Accounts"
              value={stats.pendingAccounts}
            />
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">User Accounts</h3>
                  <ShieldCheckIcon className="w-6 h-6 text-white/60" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Total Users</span>
                    <span className="text-lg font-bold text-white">{userAccounts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Active</span>
                    <span className="text-sm font-semibold text-success-400">{activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Inactive</span>
                    <span className="text-sm font-semibold text-danger-400">{inactiveUsers}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Role Distribution</h3>
                  <ClipboardDocumentListIcon className="w-6 h-6 text-white/60" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Admins</span>
                    <span className="text-lg font-bold text-danger-400">{adminUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Cashiers</span>
                    <span className="text-sm font-semibold text-white">{userAccounts.filter(u => u.role === 'Cashier').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Stock Managers</span>
                    <span className="text-sm font-semibold text-white">{userAccounts.filter(u => u.role === 'Stock Manager').length}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <UsersIcon className="w-6 h-6 text-white/60" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-white/80">
                    Latest login: {userAccounts[0]?.lastLogin}
                  </div>
                  <div className="text-xs text-white/60">
                    By {userAccounts[0]?.fullName}
                  </div>
                  <div className="pt-2 border-t border-white/10 text-xs text-white/60">
                    {stats.newThisMonth} new staff added this month
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      label: 'Staff Directory',
      icon: <ClipboardDocumentListIcon className="w-4 h-4" />,
      content: (
        <Card>
          <CardHeader
            title="Staff Directory"
            action={
              <Button
                variant="success"
                size="sm"
                onClick={() => navigate('/hr/staff/new')}
              >
                <UserPlusIcon className="w-4 h-4 mr-2" />
                Add New Staff
              </Button>
            }
          />

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search staff by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>
          </div>

          <Table
            columns={staffColumns}
            data={filteredStaff}
            onRowClick={(row) => navigate(`/hr/staff/${row.id}`)}
          />
        </Card>
      ),
    },
    {
      label: 'User Accounts',
      icon: <ShieldCheckIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <p className="text-xs text-white/60 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-white">{userAccounts.length}</p>
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
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAddUserModalOpen(true)}
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              }
            />
            <Table columns={userAccountColumns} data={filteredUsers} />
          </Card>

          {/* Security Notice */}
          <div className="glass-card p-4 border border-warning-500/20">
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
      ),
    },
  ];

  return (
    <>
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
              HR Management
            </h2>
            <p className="text-white/60 text-sm">
              Manage staff information, user accounts, and permissions
            </p>
          </div>

          {/* Tabs */}
          <Tabs tabs={tabContent} />
        </div>
      </div>
    </div>

    {/* Add User Modal */}
    <Modal
      isOpen={isAddUserModalOpen}
      onClose={() => setIsAddUserModalOpen(false)}
      title="Add New User"
      size="lg"
    >
      <form onSubmit={handleAddUser} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
            <Input
              type="text"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
            <Input
              type="text"
              value={userForm.fullName}
              onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
          <Input
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Role</label>
          <select
            className="select w-full"
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
          >
            <option value="Cashier">Cashier</option>
            <option value="Stock Manager">Stock Manager</option>
            <option value="HR">HR</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <Input
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
            <Input
              type="password"
              value={userForm.confirmPassword}
              onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={() => setIsAddUserModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create User
          </Button>
        </div>
      </form>
    </Modal>

    {/* Edit User Modal */}
    <Modal
      isOpen={isEditUserModalOpen}
      onClose={() => setIsEditUserModalOpen(false)}
      title="Edit User"
      size="lg"
    >
      <form onSubmit={handleUpdateUser} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
            <Input
              type="text"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
            <Input
              type="text"
              value={userForm.fullName}
              onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
          <Input
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Role</label>
          <select
            className="select w-full"
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
          >
            <option value="Cashier">Cashier</option>
            <option value="Stock Manager">Stock Manager</option>
            <option value="HR">HR</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={() => setIsEditUserModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Update User
          </Button>
        </div>
      </form>
    </Modal>

    {/* Reset Password Modal */}
    <Modal
      isOpen={isResetPasswordModalOpen}
      onClose={() => setIsResetPasswordModalOpen(false)}
      title="Reset Password"
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log('Reset password for:', selectedUser);
        setIsResetPasswordModalOpen(false);
      }} className="space-y-4">
        <p className="text-sm text-white/80">
          Reset password for user: <strong className="text-white">{selectedUser?.username}</strong>
        </p>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
          <Input type="password" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
          <Input type="password" required />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="secondary" onClick={() => setIsResetPasswordModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Reset Password
          </Button>
        </div>
      </form>
    </Modal>
    </>
  );
};

export default HRDashboard;
