'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Filter, UserCircle, Upload,
  Building2, LogOut, Users, Activity, Clock, TrendingUp, 
  AlertCircle, Eye, Edit, Trash2, X, FileText, Download,
  LayoutDashboard, UserCog, Settings, BarChart3, Shield,
  Calendar, Award, Bell, ChevronLeft, ChevronRight, Menu, Palette,
  CheckCircle, XCircle, Save, Camera, FilePlus, List
} from 'lucide-react';

interface UserInfo {
  role: string;
  name: string;
  email: string;
  groups: string[];
  isSuperAdmin: boolean;
  isHRAdmin: boolean;
  isHROfficer: boolean;
  profilePicture?: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
}

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  rating: number;
  reviewDate: string;
  reviewer: string;
  status: 'DRAFT' | 'COMPLETED';
}

interface DashboardProps {
  signOut: () => void;
  user: any;
}

const EmployeeManagementDashboard: React.FC<DashboardProps> = ({ signOut, user }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [employees, setEmployees] = useState<Array<any>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [themeColor, setThemeColor] = useState('blue');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<UserInfo>({ 
    role: 'HR_ADMIN', 
    name: user?.signInDetails?.loginId?.split('@')[0] || 'Demo User',
    email: user?.signInDetails?.loginId || 'demo@dict.gov.pg',
    groups: ['HR_ADMIN'],
    isSuperAdmin: true, // Set based on your auth logic
    isHRAdmin: true,
    isHROfficer: false,
    profilePicture: 'https://via.placeholder.com/100/2563eb/ffffff?text=DU'
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

  // Log activity
  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId: user?.userId || 'demo-user',
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date(),
      ipAddress: '192.168.1.1' // In production, get real IP
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

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
      { id: 'activity', label: 'Activity Logs', icon: Shield },
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

  // Load mock data
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
        profilePicture: 'https://via.placeholder.com/100/3b82f6/ffffff?text=JS',
        documents: []
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
        profilePicture: 'https://via.placeholder.com/100/10b981/ffffff?text=SJ',
        documents: []
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
        profilePicture: 'https://via.placeholder.com/100/8b5cf6/ffffff?text=MC',
        documents: []
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
        profilePicture: 'https://via.placeholder.com/100/f59e0b/ffffff?text=EW',
        documents: []
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
        profilePicture: 'https://via.placeholder.com/100/ef4444/ffffff?text=DB',
        documents: []
      },
    ];

    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: '1',
        employeeId: 'EMP1001',
        employeeName: 'John Smith',
        leaveType: 'Annual Leave',
        startDate: '2026-02-10',
        endDate: '2026-02-14',
        days: 5,
        status: 'PENDING',
        reason: 'Family vacation'
      },
      {
        id: '2',
        employeeId: 'EMP1004',
        employeeName: 'Emily Williams',
        leaveType: 'Sick Leave',
        startDate: '2026-02-01',
        endDate: '2026-02-03',
        days: 3,
        status: 'APPROVED',
        reason: 'Medical appointment'
      }
    ];

    const mockReviews: PerformanceReview[] = [
      {
        id: '1',
        employeeId: 'EMP1001',
        employeeName: 'John Smith',
        reviewPeriod: 'Q4 2025',
        rating: 4.5,
        reviewDate: '2026-01-15',
        reviewer: 'Manager Name',
        status: 'COMPLETED'
      },
      {
        id: '2',
        employeeId: 'EMP1002',
        employeeName: 'Sarah Johnson',
        reviewPeriod: 'Q4 2025',
        rating: 4.8,
        reviewDate: '2026-01-20',
        reviewer: 'Manager Name',
        status: 'COMPLETED'
      }
    ];

    setTimeout(() => {
      setEmployees(mockEmployees);
      setLeaveRequests(mockLeaveRequests);
      setPerformanceReviews(mockReviews);
      setLoading(false);
      logActivity('LOGIN', 'User logged into the system');
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
    logActivity('LOGOUT', 'User signed out of the system');
    signOut();
  };

  const handleFileUpload = (employeeId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.type !== 'application/pdf') {
      alert('Please upload PDF files only');
      return;
    }

    // Simulate file upload
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        const newDocument = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          type: 'PDF'
        };
        return {
          ...emp,
          documents: [...(emp.documents || []), newDocument]
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    logActivity('DOCUMENT_UPLOAD', `Uploaded document ${file.name} for employee ${employeeId}`);
    alert(`File "${file.name}" uploaded successfully!`);
  };

  const handleProfilePictureUpload = (employeeId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload image files only');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedEmployees = employees.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            profilePicture: e.target?.result as string
          };
        }
        return emp;
      });

      setEmployees(updatedEmployees);
      if (selectedEmployee?.id === employeeId) {
        setSelectedEmployee({...selectedEmployee, profilePicture: e.target?.result as string});
      }
      logActivity('PROFILE_UPDATE', `Updated profile picture for employee ${employeeId}`);
      alert('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleLeaveAction = (leaveId: string, action: 'APPROVED' | 'REJECTED') => {
    const updatedRequests = leaveRequests.map(req => {
      if (req.id === leaveId) {
        return { ...req, status: action };
      }
      return req;
    });
    setLeaveRequests(updatedRequests);
    logActivity('LEAVE_MANAGEMENT', `${action} leave request ${leaveId}`);
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
    <div className="space-y-4">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          src={employee.profilePicture || 'https://via.placeholder.com/40'}
                          alt={employee.fullName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
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

      {/* Employee Detail Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Employee Details</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedEmployee.profilePicture || 'https://via.placeholder.com/100'}
                    alt={selectedEmployee.fullName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <button
                    onClick={() => profilePicInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={profilePicInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleProfilePictureUpload(selectedEmployee.id, e.target.files)}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedEmployee.fullName}</h3>
                  <p className="text-sm text-gray-600">{selectedEmployee.employeeId}</p>
                  <p className="text-sm text-gray-600">{selectedEmployee.position}</p>
                </div>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Employment Type</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.employmentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hire Date</label>
                  <p className="text-sm text-gray-900">{selectedEmployee.hireDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedEmployee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    selectedEmployee.status === 'ON_LEAVE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedEmployee.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-900">Documents</h4>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(selectedEmployee.id, e.target.files)}
                  />
                </div>

                {selectedEmployee.documents && selectedEmployee.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedEmployee.documents.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {(doc.size / 1024).toFixed(2)} KB • {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No documents uploaded yet</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const LeaveManagementView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaveRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                  <div className="text-sm text-gray-500">{request.employeeId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.leaveType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.startDate} to {request.endDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.days}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {request.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLeaveAction(request.id, 'APPROVED')}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleLeaveAction(request.id, 'REJECTED')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PerformanceView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Performance Reviews</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {performanceReviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{review.employeeName}</div>
                  <div className="text-sm text-gray-500">{review.employeeId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.reviewPeriod}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm font-bold text-gray-900">{review.rating}/5.0</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.reviewDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.reviewer}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    review.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {review.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="bg-white rounded-lg shadow p-12">
      <div className="text-center">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Reports & Analytics</h3>
        <p className="text-sm text-gray-500 mb-6">Generate comprehensive reports on workforce data</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
            <List className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">Employee Report</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">Leave Report</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">Performance Report</p>
          </button>
        </div>
      </div>
    </div>
  );

  const ActivityLogsView = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">System Activity Logs</h3>
        <p className="text-sm text-gray-500 mt-1">Monitor all system activities and user actions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activityLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.timestamp.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                  <div className="text-xs text-gray-500">{log.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{log.details}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {activityLogs.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activity logs yet</h3>
          </div>
        )}
      </div>
    </div>
  );

  const UserManagementView = () => (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <UserCog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">User Management</h3>
      <p className="text-sm text-gray-500">Manage system users and permissions</p>
    </div>
  );

  const SettingsView = () => (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">System Settings</h3>
      <p className="text-sm text-gray-500">Configure system preferences and integrations</p>
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
                <img 
                  src="/DICT.png" 
                  alt="DICT PNG Logo"
                  className="w-10 h-10 object-contain"
                />
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
                onClick={() => {
                  setCurrentView(item.id);
                  logActivity('NAVIGATION', `Navigated to ${item.label}`);
                }}
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
                {currentView === 'activity' && 'Activity Logs'}
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
                  <img
                    src={currentUser.profilePicture || 'https://via.placeholder.com/40'}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
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
                            onClick={() => {
                              setThemeColor(color);
                              logActivity('THEME_CHANGE', `Changed theme to ${color}`);
                            }}
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
          {currentView === 'leave' && <LeaveManagementView />}
          {currentView === 'performance' && <PerformanceView />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'users' && <UserManagementView />}
          {currentView === 'activity' && <ActivityLogsView />}
          {currentView === 'settings' && <SettingsView />}
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