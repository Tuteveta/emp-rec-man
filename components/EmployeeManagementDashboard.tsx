'use client';

import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { 
  Search, Plus, Filter, UserCircle, 
  Building2, LogOut, Users, Activity, Clock, TrendingUp, 
  AlertCircle
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

interface EmployeeManagementDashboardProps {
  signOut?: () => void;
  user?: any;
}

export default function EmployeeManagementDashboard({ signOut, user }: EmployeeManagementDashboardProps) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [employees, setEmployees] = useState<Array<any>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
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
          name: session.tokens?.idToken?.payload.name as string || user?.username || 'User',
          email: session.tokens?.idToken?.payload.email as string || user?.attributes?.email || '',
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
  }, [user]);

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

  // Calculate stats
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

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
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
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'employees' && <EmployeeListView />}
      </main>
    </div>
  );
}