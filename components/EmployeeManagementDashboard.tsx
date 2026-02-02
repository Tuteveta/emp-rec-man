'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, UserCircle, 
  Building2, LogOut, Users, Activity, Clock, TrendingUp, 
  AlertCircle, Eye, Edit, Trash2, X,
  LayoutDashboard, UserCog, Settings, FileText, BarChart3,
  Calendar, Award, Bell, ChevronLeft, ChevronRight, Menu, Palette
} from 'lucide-react';

interface UserInfo {
  role: string;
  name: string;
  email: string;
  groups: string[];
  isSuperAdmin: boolean;
  isHRAdmin: boolean;
  isHROfficer: boolean;
}

const EmployeeManagementDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [employees, setEmployees] = useState<Array<any>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [themeColor, setThemeColor] = useState('blue');
  const [currentUser, setCurrentUser] = useState<UserInfo>({ 
    role: 'HR_ADMIN', 
    name: 'Demo User',
    email: 'demo@dict.gov.pg',
    groups: ['HR_ADMIN'],
    isSuperAdmin: false,
    isHRAdmin: true,
    isHROfficer: false,
  });

  const themeColors = {
    blue: { primary: 'blue-600', light: 'blue-50', text: 'blue-600' },
    green: { primary: 'green-600', light: 'green-50', text: 'green-600' },
    purple: { primary: 'purple-600', light: 'purple-50', text: 'purple-600' },
    red: { primary: 'red-600', light: 'red-50', text: 'red-600' },
    indigo: { primary: 'indigo-600', light: 'indigo-50', text: 'indigo-600' },
    orange: { primary: 'orange-600', light: 'orange-50', text: 'orange-600' },
  };

  const currentTheme = themeColors[themeColor as keyof typeof themeColors];

  // Navigation menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'employees', label: 'All Employees', icon: Users },
    ];

    const adminItems = [
      { id: 'leave', label: 'Leave Management', icon: Calendar },
      { id: 'performance', label: 'Performance', icon: Award },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ];

    const superAdminItems = [
      { id: 'users', label: 'User Management', icon: UserCog },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];

    let items = [...baseItems];
    
    if (currentUser.isHRAdmin || currentUser.isSuperAdmin) {
      items = [...items, ...adminItems];
    }
    
    if (currentUser.isSuperAdmin) {
      items = [...items, ...superAdminItems];
    }

    return items;
  };

  // Load mock employee data
  useEffect(() => {
    const mockEmployees = [
      {
        id: '1',
        employeeId: 'EMP1001',
        fullName: 'John Smith',
        email: 'john.smith@dict.gov.pg',
        phone: '+675 1234 5678',
        department: 'ICT Operations',
        position: 'Senior Developer',
        employmentType: 'PERMANENT',
        status: 'ACTIVE',
        hireDate: '2023-01-15',
        annualLeaveBalance: 15,
        sickLeaveBalance: 10,
      },
      {
        id: '2',
        employeeId: 'EMP1002',
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@dict.gov.pg',
        phone: '+675 2345 6789',
        department: 'Network Infrastructure',
        position: 'Network Engineer',
        employmentType: 'PERMANENT',
        status: 'ACTIVE',
        hireDate: '2023-03-20',
        annualLeaveBalance: 20,
        sickLeaveBalance: 10,
      },
      {
        id: '3',
        employeeId: 'EMP1003',
        fullName: 'Michael Chen',
        email: 'michael.chen@dict.gov.pg',
        phone: '+675 3456 7890',
        department: 'Cybersecurity',
        position: 'Security Analyst',
        employmentType: 'CONTRACT',
        status: 'ACTIVE',
        hireDate: '2024-01-10',
        annualLeaveBalance: 18,
        sickLeaveBalance: 8,
      },
      {
        id: '4',
        employeeId: 'EMP1004',
        fullName: 'Emily Williams',
        email: 'emily.williams@dict.gov.pg',
        phone: '+675 4567 8901',
        department: 'Software Development',
        position: 'Project Manager',
        employmentType: 'PERMANENT',
        status: 'ON_LEAVE',
        hireDate: '2022-06-15',
        annualLeaveBalance: 5,
        sickLeaveBalance: 10,
      },
      {
        id: '5',
        employeeId: 'EMP1005',
        fullName: 'David Brown',
        email: 'david.brown@dict.gov.pg',
        phone: '+675 5678 9012',
        department: 'ICT Operations',
        position: 'System Administrator',
        employmentType: 'PERMANENT',
        status: 'ACTIVE',
        hireDate: '2022-09-01',
        annualLeaveBalance: 12,
        sickLeaveBalance: 10,
      },
    ];

    setTimeout(() => {
      setEmployees(mockEmployees);
      setLoading(false);
    }, 500);
  }, []);

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

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleSignOut = () => {
    alert('Sign out functionality will be connected to authentication system');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-gray-500 text-center py-8">No employees yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(departmentStats).map(([dept, count]) => {
                const employeeCount = count as number;
                return (
                  <div key={dept}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{dept}</span>
                      <span className="text-sm text-gray-600">{employeeCount} employees</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${currentTheme.primary} h-2 rounded-full`}
                        style={{ width: `${(employeeCount / stats.totalEmployees) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${currentTheme.primary} focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${currentTheme.primary}`}
            >
              <option value="all">All Departments</option>
              {Object.keys(departmentStats).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${currentTheme.primary}`}
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
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
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className={`bg-${currentTheme.primary} p-2 rounded-lg`}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">DICT PNG</h2>
                  <p className="text-xs text-gray-500">Employee Mgmt</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {getMenuItems().map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? `bg-${currentTheme.light} text-${currentTheme.text} font-semibold`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'employees' && 'All Employees'}
                {currentView === 'leave' && 'Leave Management'}
                {currentView === 'performance' && 'Performance Reviews'}
                {currentView === 'reports' && 'Reports & Analytics'}
                {currentView === 'users' && 'User Management'}
                {currentView === 'settings' && 'System Settings'}
              </h1>
              <p className="text-sm text-gray-500">Department of Information Communication & Technology</p>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br from-${currentTheme.primary} to-indigo-600 rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                    <p className={`text-xs font-semibold ${
                      currentUser.isSuperAdmin ? 'text-red-600' :
                      currentUser.isHRAdmin ? 'text-orange-600' :
                      currentUser.isHROfficer ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {currentUser.role.replace('_', ' ')}
                    </p>
                  </div>
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                      <p className={`text-xs font-semibold mt-1 ${
                        currentUser.isSuperAdmin ? 'text-red-600' :
                        currentUser.isHRAdmin ? 'text-orange-600' :
                        currentUser.isHROfficer ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {currentUser.role.replace('_', ' ')}
                      </p>
                    </div>

                    {/* Theme Selector */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Theme Color</span>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {Object.keys(themeColors).map((color) => (
                          <button
                            key={color}
                            onClick={() => setThemeColor(color)}
                            className={`w-8 h-8 rounded-full bg-${color}-600 hover:scale-110 transition-transform ${
                              themeColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                            }`}
                            title={color.charAt(0).toUpperCase() + color.slice(1)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Menu Options */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-semibold">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'employees' && <EmployeeListView />}
          {currentView !== 'dashboard' && currentView !== 'employees' && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-500">This feature is under development</p>
            </div>
          )}
        </main>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default EmployeeManagementDashboard;