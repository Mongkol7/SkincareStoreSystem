import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatsCard from '../components/common/StatsCard';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import {
  UsersIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const HRDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStaff = staffData.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Staff Management
              </h2>
              <p className="text-white/60 text-sm">
                Manage staff information and user accounts
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            {/* Staff List */}
            <Card>
              <CardHeader
                title="Staff Directory"
                action={
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => navigate('/hr/staff/new')}
                  >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
