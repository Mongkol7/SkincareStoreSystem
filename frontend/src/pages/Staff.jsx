import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card, { CardHeader } from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Staff = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock staff data with state
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@skincare.com',
      role: 'Cashier',
      department: 'Sales',
      phone: '+1 234-567-8901',
      joinDate: '2024-01-15',
      status: 'Active',
      address: '123 Main St, City, State 12345',
      emergencyContact: '+1 234-567-8900',
      salary: 45000
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@skincare.com',
      role: 'Cashier',
      department: 'Sales',
      phone: '+1 234-567-8902',
      joinDate: '2024-02-20',
      status: 'Active',
      address: '456 Oak Ave, City, State 12345',
      emergencyContact: '+1 234-567-8903',
      salary: 45000
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@skincare.com',
      role: 'Stock Manager',
      department: 'Inventory',
      phone: '+1 234-567-8903',
      joinDate: '2023-11-10',
      status: 'Active',
      address: '789 Pine Rd, City, State 12345',
      emergencyContact: '+1 234-567-8904',
      salary: 55000
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@skincare.com',
      role: 'HR',
      department: 'Human Resources',
      phone: '+1 234-567-8904',
      joinDate: '2023-08-05',
      status: 'Active',
      address: '321 Elm St, City, State 12345',
      emergencyContact: '+1 234-567-8905',
      salary: 60000
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@skincare.com',
      role: 'Admin',
      department: 'Management',
      phone: '+1 234-567-8905',
      joinDate: '2023-05-12',
      status: 'Active',
      address: '654 Maple Dr, City, State 12345',
      emergencyContact: '+1 234-567-8906',
      salary: 75000
    },
    {
      id: 6,
      name: 'Emily Chen',
      email: 'emily.chen@skincare.com',
      role: 'Cashier',
      department: 'Sales',
      phone: '+1 234-567-8906',
      joinDate: '2024-03-01',
      status: 'On Leave',
      address: '987 Birch Ln, City, State 12345',
      emergencyContact: '+1 234-567-8907',
      salary: 45000
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    joinDate: '',
    address: '',
    emergencyContact: '',
    salary: ''
  });

  // Get unique roles
  const roles = useMemo(() => {
    return ['all', ...new Set(staffList.map(s => s.role))];
  }, [staffList]);

  // Filter and search staff
  const filteredStaff = useMemo(() => {
    return staffList.filter(staff => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm);

      const matchesRole = filterRole === 'all' || staff.role === filterRole;
      const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffList, searchTerm, filterRole, filterStatus]);

  // Handle Add Staff
  const handleAddStaff = (e) => {
    e.preventDefault();
    const newStaff = {
      id: staffList.length + 1,
      ...formData,
      salary: parseFloat(formData.salary),
      status: 'Active'
    };

    setStaffList([...staffList, newStaff]);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Handle Edit Staff
  const handleEditStaff = (e) => {
    e.preventDefault();
    setStaffList(staffList.map(s =>
      s.id === selectedStaff.id
        ? { ...s, ...formData, salary: parseFloat(formData.salary) }
        : s
    ));
    setIsEditModalOpen(false);
    resetForm();
  };

  // Toggle Staff Status
  const toggleStaffStatus = (staff) => {
    setStaffList(staffList.map(s =>
      s.id === staff.id
        ? { ...s, status: s.status === 'Active' ? 'On Leave' : 'Active' }
        : s
    ));
  };

  // Open Edit Modal
  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      department: staff.department,
      phone: staff.phone,
      joinDate: staff.joinDate,
      address: staff.address,
      emergencyContact: staff.emergencyContact,
      salary: staff.salary.toString()
    });
    setIsEditModalOpen(true);
  };

  // Open View Modal
  const openViewModal = (staff) => {
    setSelectedStaff(staff);
    setIsViewModalOpen(true);
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      phone: '',
      joinDate: '',
      address: '',
      emergencyContact: '',
      salary: ''
    });
    setSelectedStaff(null);
  };

  // Clear Filters
  const clearFilters = () => {
    setFilterRole('all');
    setFilterStatus('all');
    setSearchTerm('');
  };

  const columns = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    {
      field: 'role',
      label: 'Role',
      render: (value) => (
        <span className="badge badge-primary">
          {value}
        </span>
      ),
    },
    { field: 'department', label: 'Department' },
    { field: 'phone', label: 'Phone' },
    { field: 'joinDate', label: 'Join Date' },
    {
      field: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`badge ${
          value === 'Active' ? 'badge-success' :
          value === 'On Leave' ? 'badge-warning' :
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
          <Button variant="primary" size="sm" onClick={() => openViewModal(row)}>
            View
          </Button>
        </div>
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
                Manage staff members and their roles
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Total Staff</p>
                <p className="text-2xl font-bold text-white">{staffList.length}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Active</p>
                <p className="text-2xl font-bold text-white">
                  {staffList.filter(s => s.status === 'Active').length}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">On Leave</p>
                <p className="text-2xl font-bold text-white/80">
                  {staffList.filter(s => s.status === 'On Leave').length}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-white/60 mb-1">Departments</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(staffList.map(s => s.department)).size}
                </p>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <Card className="mb-4">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="text-white/60 hover:text-white">
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Role</label>
                      <select
                        className="select w-full"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>
                            {role === 'all' ? 'All Roles' : role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Status</label>
                      <select
                        className="select w-full"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button variant="secondary" onClick={clearFilters} className="w-full">
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card>
              <CardHeader
                title="All Staff Members"
                action={
                  <div className="flex gap-3">
                    <div className="relative">
                      <MagnifyingGlassIcon className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Search staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
                      <FunnelIcon className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Staff
                    </Button>
                  </div>
                }
              />
              <Table columns={columns} data={filteredStaff} />
              {filteredStaff.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/60">No staff members found</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); resetForm(); }}
        title="Add New Staff Member"
        size="lg"
      >
        <form onSubmit={handleAddStaff}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Full Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Email *</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@example.com"
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
                <option value="Cashier">Cashier</option>
                <option value="Stock Manager">Stock Manager</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Department *</label>
              <Input
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g., Sales"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Phone *</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 234-567-8900"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Join Date *</label>
              <Input
                required
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-2">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full address"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Emergency Contact</label>
              <Input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                placeholder="+1 234-567-8900"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Salary ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                placeholder="45000"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Staff Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); resetForm(); }}
        title="Edit Staff Member"
        size="lg"
      >
        <form onSubmit={handleEditStaff}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-white/70 mb-2">Full Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                <option value="Cashier">Cashier</option>
                <option value="Stock Manager">Stock Manager</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Department *</label>
              <Input
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Phone *</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Join Date *</label>
              <Input
                required
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/70 mb-2">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Emergency Contact</label>
              <Input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Salary ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
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

      {/* View Staff Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Staff Member Details"
        size="md"
      >
        {selectedStaff && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Name</span>
                  <span className="text-white font-medium">{selectedStaff.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Email</span>
                  <span className="text-white">{selectedStaff.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Phone</span>
                  <span className="text-white">{selectedStaff.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Address</span>
                  <span className="text-white text-right">{selectedStaff.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Emergency Contact</span>
                  <span className="text-white">{selectedStaff.emergencyContact}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Employment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Role</span>
                  <span className="badge badge-primary">{selectedStaff.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Department</span>
                  <span className="text-white">{selectedStaff.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Join Date</span>
                  <span className="text-white">{selectedStaff.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Salary</span>
                  <span className="text-white font-semibold">${selectedStaff.salary?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60 text-sm">Status</span>
                  <span className={`badge ${
                    selectedStaff.status === 'Active' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {selectedStaff.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => toggleStaffStatus(selectedStaff)}
              >
                {selectedStaff.status === 'Active' ? 'Mark On Leave' : 'Mark Active'}
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedStaff);
                }}
              >
                Edit Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Staff;
