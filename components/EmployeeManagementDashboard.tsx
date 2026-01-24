'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { Schema } from '@/amplify/data/resource';
import { 
  Search, Plus, Filter, Download, Upload, UserCircle, 
  Building2, LogOut, Users, Activity, Clock, TrendingUp, 
  AlertCircle, Eye, Edit, Trash2, X, Shield, Settings,
  FileText, BarChart3, Lock, UserCog, Database, CheckCircle
} from 'lucide-react';

const client = generateClient<Schema>();

interface UserInfo {
  role: string;
  name: string;
  email: string;
  groups: string[];
  isSuperAdmin: boolean;
  isHRAdmin: boolean;
  isHROfficer: boolean;
}

interface EmployeeManagementDashboardProps {
  signOut?: () => void;
  user?: any;
  onSignOut?: () => void;
}

const EmployeeManagementDashboard = ({ signOut, user, onSignOut }: EmployeeManagementDashboardProps) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [employees, setEmployees] = useState<Array<Schema["Employee"]["type"]>>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Schema["Employee"]["type"] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserInfo>({ 
    role: 'EMPLOYEE', 
    name: 'Loading...',
    email: '',
    groups: [],
    isSuperAdmin: false,
    isHRAdmin: false,
    isHROfficer: false,
  });

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];
        
        const isSuperAdmin = groups.includes('SUPER_ADMIN');
        const isHRAdmin = groups.includes('HR_ADMIN');
        const isHROfficer = groups.includes('HR_OFFICER');
        
        let role = 'EMPLOYEE';
        if (isSuperAdmin) role = 'SUPER_ADMIN';
        else if (isHRAdmin) role = 'HR_ADMIN';
        else if (isHROfficer) role = 'HR_OFFICER';
        
        setCurrentUser({
          role,
          name: session.tokens?.idToken?.payload.name as string || 'User',
          email: session.tokens?.idToken?.payload.email as string || '',
          groups,
          isSuperAdmin,
          isHRAdmin,
          isHROfficer,
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    fetchUserInfo();
  }, []);

  // Fetch employees from Amplify
  useEffect(() => {
    // Safety check
    if (!client?.models?.Employee?.observeQuery) {
      console.error('Amplify client not initialized properly');
      setLoading(false);
      return;
    }

    const subscription = client.models.Employee.observeQuery().subscribe({
      next: (data) => {
        setEmployees([...data.items]);
        setLoading(false);
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Calculate dashboard stats
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'ACTIVE').length,
    onLeave: employees.filter(e => e.status === 'ON_LEAVE').length,
    newHires: employees.filter(e => {
      if (!e.hireDate) return false;
      const hireDate = new Date(e.hireDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return hireDate > threeMonthsAgo;
    }).length
  };

  const departmentStats = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const openEmployeeModal = (employee: Schema["Employee"]["type"] | null, mode: 'view' | 'edit' | 'create') => {
    setSelectedEmployee(employee);
    setModalMode(mode);
    setShowEmployeeModal(true);
  };

  const closeEmployeeModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
    setModalMode('view');
  };

  const handleCreateEmployee = () => {
    openEmployeeModal(null, 'create');
  };

  const handleSaveEmployee = async () => {
    try {
      if (modalMode === 'create' && selectedEmployee) {
        await client.models.Employee.create({
          employeeId: `EMP${Date.now()}`,
          fullName: selectedEmployee.fullName || '',
          email: selectedEmployee.email || '',
          phone: selectedEmployee.phone,
          department: selectedEmployee.department || '',
          position: selectedEmployee.position || '',
          employmentType: selectedEmployee.employmentType || 'PERMANENT',
          status: selectedEmployee.status || 'ACTIVE',
          hireDate: selectedEmployee.hireDate || new Date().toISOString().split('T')[0],
          annualLeaveBalance: selectedEmployee.annualLeaveBalance || 20,
          sickLeaveBalance: selectedEmployee.sickLeaveBalance || 10,
          createdBy: currentUser.email,
        });
      } else if (modalMode === 'edit' && selectedEmployee?.id) {
        await client.models.Employee.update({
          id: selectedEmployee.id,
          fullName: selectedEmployee.fullName,
          email: selectedEmployee.email,
          phone: selectedEmployee.phone,
          department: selectedEmployee.department,
          position: selectedEmployee.position,
          employmentType: selectedEmployee.employmentType,
          status: selectedEmployee.status,
          hireDate: selectedEmployee.hireDate,
          updatedBy: currentUser.email,
        });
      }
      closeEmployeeModal();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      try {
        await client.models.Employee.delete({ id });
        closeEmployeeModal();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
    if (onSignOut) {
      onSignOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEmployees}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeEmployees}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">On Leave</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.onLeave}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">New Hires (3mo)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.newHires}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Department Distribution</h3>
        </div>
        <div className="p-6">
          {Object.keys(departmentStats).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No employees yet. Add your first employee to see department distribution.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(departmentStats).map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{dept}</span>
                    <span className="text-sm text-gray-600">{count} employees</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / stats.totalEmployees) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleCreateEmployee}
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Employee</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Upload className="w-5 h-5" />
            <span>Import Employees</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Download className="w-5 h-5" />
            <span>Export Records</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Employee List View
  const EmployeeListView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {(currentUser.isSuperAdmin || currentUser.isHRAdmin) && (
              <button
                onClick={handleCreateEmployee}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {Object.keys(departmentStats).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                      <div className="text-sm text-gray-500">{employee.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    employee.status === 'ON_LEAVE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {employee.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.hireDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEmployeeModal(employee, 'view')}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Eye className="w-4 h-4 inline" />
                  </button>
                  {(currentUser.isSuperAdmin || currentUser.isHRAdmin) && (
                    <>
                      <button
                        onClick={() => openEmployeeModal(employee, 'edit')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {employees.length === 0 ? 'Get started by adding your first employee.' : 'Try adjusting your search or filter criteria.'}
          </p>
          {employees.length === 0 && (
            <button
              onClick={handleCreateEmployee}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add First Employee
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Super Admin View
  const SuperAdminView = () => (
    <div className="space-y-6">
      {/* Super Admin Header */}
      <div className="bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
            <Shield className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Super Admin Control Panel</h2>
            <p className="text-white/90 text-lg">Complete system access and configuration</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">Logged in as: {currentUser.email}</span>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-100 p-3 rounded-full">
              <Database className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Records</p>
          <p className="text-xs text-gray-500 mt-1">In database</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <UserCog className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">4</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">User Groups</p>
          <p className="text-xs text-gray-500 mt-1">Active roles</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">0</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Audit Logs</p>
          <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">100%</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">System Health</p>
          <p className="text-xs text-gray-500 mt-1">All services operational</p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <UserCog className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <p className="text-sm text-gray-600">Manage user roles and permissions</p>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">View All Users</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Active</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Manage Groups</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">4 Groups</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Assign Roles</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Quick Action</span>
              </div>
            </button>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
            </div>
            <p className="text-sm text-gray-600">Track all system activities and changes</p>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">View Audit Trail</span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">0 Today</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">User Activities</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Track</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Export Logs</span>
                <Download className="w-4 h-4 text-gray-600" />
              </div>
            </button>
          </div>
        </div>

        {/* System Configuration */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">System Config</h3>
            </div>
            <p className="text-sm text-gray-600">Configure system-wide settings</p>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">General Settings</span>
                <Settings className="w-4 h-4 text-gray-600" />
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Security Policies</span>
                <Lock className="w-4 h-4 text-gray-600" />
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Data Backup</span>
                <Database className="w-4 h-4 text-gray-600" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            System Information
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Database Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Employee Records</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalEmployees} records</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Leave Requests</span>
                  <span className="text-sm font-medium text-gray-900">0 records</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Performance Reviews</span>
                  <span className="text-sm font-medium text-gray-900">0 records</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Audit Logs</span>
                  <span className="text-sm font-medium text-gray-900">0 records</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">User Groups</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">SUPER_ADMIN</span>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Full Access</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">HR_ADMIN</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Admin</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">HR_OFFICER</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Officer</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">EMPLOYEE</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Read Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities (Placeholder) */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent System Activities</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No audit logs available</p>
            <p className="text-gray-400 text-sm mt-2">System activities will appear here once users start interacting with the platform</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border-2 border-red-200 rounded-lg shadow">
        <div className="p-6 bg-red-50 border-b border-red-200">
          <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-red-700 mt-1">These actions are permanent and cannot be undone</p>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Clear All Audit Logs</p>
              <p className="text-xs text-gray-500 mt-1">Permanently delete all system audit logs</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              Clear Logs
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Reset System Configuration</p>
              <p className="text-xs text-gray-500 mt-1">Restore all settings to default values</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              Reset Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Employee Modal
  const EmployeeModal = () => {
    if (!showEmployeeModal) return null;

    const isReadOnly = modalMode === 'view';
    const empData = selectedEmployee || {
      employeeId: '',
      fullName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      employmentType: 'PERMANENT' as const,
      status: 'ACTIVE' as const,
      hireDate: new Date().toISOString().split('T')[0],
      annualLeaveBalance: 20,
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              {modalMode === 'create' ? 'Add New Employee' : 
               modalMode === 'edit' ? 'Edit Employee' : 
               'Employee Details'}
            </h2>
            <button onClick={closeEmployeeModal} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Personal Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={empData.fullName || ''}
                  onChange={(e) => setSelectedEmployee({...empData, fullName: e.target.value} as any)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={empData.email || ''}
                  onChange={(e) => setSelectedEmployee({...empData, email: e.target.value} as any)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={empData.phone || ''}
                  onChange={(e) => setSelectedEmployee({...empData, phone: e.target.value} as any)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <input
                  type="text"
                  value={empData.department || ''}
                  onChange={(e) => setSelectedEmployee({...empData, department: e.target.value} as any)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input
                  type="text"
                  value={empData.position || ''}
                  onChange={(e) => setSelectedEmployee({...empData, position: e.target.value} as any)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select
                  value={empData.employmentType || 'PERMANENT'}
                  onChange={(e) => setSelectedEmployee({...empData, employmentType: e.target.value as any} as any)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="PERMANENT">Permanent</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="CASUAL">Casual</option>
                  <option value="INTERN">Intern</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={empData.status || 'ACTIVE'}
                  onChange={(e) => setSelectedEmployee({...empData, status: e.target.value as any} as any)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="SEPARATED">Separated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                <input
                  type="date"
                  value={empData.hireDate || ''}
                  onChange={(e) => setSelectedEmployee({...empData, hireDate: e.target.value} as any)}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={closeEmployeeModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button
                onClick={handleSaveEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {modalMode === 'create' ? 'Create Employee' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DICT Employee Management</h1>
                <p className="text-sm text-gray-500">Department of Information Communication & Technology</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <div className="flex items-center gap-1 justify-end">
                  {currentUser.isSuperAdmin && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">SUPER ADMIN</span>
                  )}
                  {!currentUser.isSuperAdmin && (
                    <p className="text-xs text-gray-500">{currentUser.role.replace('_', ' ')}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('employees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Employees
            </button>
            {currentUser.isSuperAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  currentView === 'admin'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                System Admin
              </button>
            )}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'employees' && <EmployeeListView />}
        {currentView === 'admin' && currentUser.isSuperAdmin && <SuperAdminView />}
      </main>

      <EmployeeModal />
    </div>
  );
};

export default EmployeeManagementDashboard;