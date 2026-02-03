'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Upload, Building2, LogOut, Users, Activity, Clock, TrendingUp, 
  AlertCircle, Eye, Edit, Trash2, X, FileText, Download, LayoutDashboard, 
  UserCog, Settings, BarChart3, Shield, Calendar, Award, Bell, ChevronLeft, 
  ChevronRight, Menu, CheckCircle, XCircle, Camera, Database, PieChart, BarChart,
  Mail, Key, Filter, Save
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

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
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

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
  createdDate: string;
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<UserInfo>({ 
    role: 'HR_ADMIN', 
    name: user?.signInDetails?.loginId?.split('@')[0] || 'Demo User',
    email: user?.signInDetails?.loginId || 'demo@dict.gov.pg',
    groups: ['HR_ADMIN'],
    isSuperAdmin: true,
    isHRAdmin: true,
    isHROfficer: false,
    profilePicture: 'https://via.placeholder.com/100/2563eb/ffffff?text=DU'
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId: user?.userId || 'demo-user',
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date(),
      ipAddress: '192.168.1.1'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

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

  useEffect(() => {
    const mockEmployees = [
      {
        id: '1', employeeId: 'EMP1001', fullName: 'John Smith',
        email: 'john.smith@dict.gov.pg', phone: '+675 1234 5678',
        department: 'ICT Operations', position: 'Senior Developer',
        employmentType: 'PERMANENT', status: 'ACTIVE', hireDate: '2023-01-15',
        annualLeaveBalance: 15, sickLeaveBalance: 10,
        profilePicture: 'https://via.placeholder.com/100/3b82f6/ffffff?text=JS',
        documents: []
      },
      {
        id: '2', employeeId: 'EMP1002', fullName: 'Sarah Johnson',
        email: 'sarah.johnson@dict.gov.pg', phone: '+675 2345 6789',
        department: 'Network Infrastructure', position: 'Network Engineer',
        employmentType: 'PERMANENT', status: 'ACTIVE', hireDate: '2023-03-20',
        annualLeaveBalance: 20, sickLeaveBalance: 10,
        profilePicture: 'https://via.placeholder.com/100/10b981/ffffff?text=SJ',
        documents: []
      },
      {
        id: '3', employeeId: 'EMP1003', fullName: 'Michael Chen',
        email: 'michael.chen@dict.gov.pg', phone: '+675 3456 7890',
        department: 'Cybersecurity', position: 'Security Analyst',
        employmentType: 'CONTRACT', status: 'ACTIVE', hireDate: '2024-01-10',
        annualLeaveBalance: 18, sickLeaveBalance: 8,
        profilePicture: 'https://via.placeholder.com/100/8b5cf6/ffffff?text=MC',
        documents: []
      },
      {
        id: '4', employeeId: 'EMP1004', fullName: 'Emily Williams',
        email: 'emily.williams@dict.gov.pg', phone: '+675 4567 8901',
        department: 'Software Development', position: 'Project Manager',
        employmentType: 'PERMANENT', status: 'ON_LEAVE', hireDate: '2022-06-15',
        annualLeaveBalance: 5, sickLeaveBalance: 10,
        profilePicture: 'https://via.placeholder.com/100/f59e0b/ffffff?text=EW',
        documents: []
      },
      {
        id: '5', employeeId: 'EMP1005', fullName: 'David Brown',
        email: 'david.brown@dict.gov.pg', phone: '+675 5678 9012',
        department: 'ICT Operations', position: 'System Administrator',
        employmentType: 'PERMANENT', status: 'ACTIVE', hireDate: '2022-09-01',
        annualLeaveBalance: 12, sickLeaveBalance: 10,
        profilePicture: 'https://via.placeholder.com/100/ef4444/ffffff?text=DB',
        documents: []
      },
    ];

    const mockNotifications: Notification[] = [
      {
        id: '1', title: 'New Leave Request',
        message: 'John Smith submitted a leave request for approval',
        timestamp: new Date(Date.now() - 3600000), type: 'info', read: false
      },
      {
        id: '2', title: 'Performance Review Due',
        message: '3 performance reviews are due this week',
        timestamp: new Date(Date.now() - 7200000), type: 'warning', read: false
      },
      {
        id: '3', title: 'System Update',
        message: 'System maintenance scheduled for tomorrow 2AM',
        timestamp: new Date(Date.now() - 86400000), type: 'info', read: true
      }
    ];

    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: '1', employeeId: 'EMP1001', employeeName: 'John Smith',
        leaveType: 'Annual Leave', startDate: '2026-02-10', endDate: '2026-02-14',
        days: 5, status: 'PENDING', reason: 'Family vacation'
      },
      {
        id: '2', employeeId: 'EMP1004', employeeName: 'Emily Williams',
        leaveType: 'Sick Leave', startDate: '2026-02-01', endDate: '2026-02-03',
        days: 3, status: 'APPROVED', reason: 'Medical appointment'
      },
      {
        id: '3', employeeId: 'EMP1002', employeeName: 'Sarah Johnson',
        leaveType: 'Annual Leave', startDate: '2026-02-15', endDate: '2026-02-17',
        days: 3, status: 'PENDING', reason: 'Personal'
      }
    ];

    const mockReviews: PerformanceReview[] = [
      {
        id: '1', employeeId: 'EMP1001', employeeName: 'John Smith',
        reviewPeriod: 'Q4 2025', rating: 4.5, reviewDate: '2026-01-15',
        reviewer: 'Manager Name', status: 'COMPLETED'
      },
      {
        id: '2', employeeId: 'EMP1002', employeeName: 'Sarah Johnson',
        reviewPeriod: 'Q4 2025', rating: 4.8, reviewDate: '2026-01-20',
        reviewer: 'Manager Name', status: 'COMPLETED'
      },
      {
        id: '3', employeeId: 'EMP1003', employeeName: 'Michael Chen',
        reviewPeriod: 'Q4 2025', rating: 4.3, reviewDate: '2026-01-18',
        reviewer: 'Manager Name', status: 'COMPLETED'
      }
    ];

    const mockUsers: SystemUser[] = [
      {
        id: '1', name: 'Admin User', email: 'admin@dict.gov.pg',
        role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: '2026-02-03 09:30',
        createdDate: '2024-01-01'
      },
      {
        id: '2', name: 'HR Manager', email: 'hr.manager@dict.gov.pg',
        role: 'HR_ADMIN', status: 'ACTIVE', lastLogin: '2026-02-02 14:15',
        createdDate: '2024-02-15'
      },
      {
        id: '3', name: 'HR Officer', email: 'hr.officer@dict.gov.pg',
        role: 'HR_OFFICER', status: 'ACTIVE', lastLogin: '2026-02-01 08:45',
        createdDate: '2024-03-10'
      }
    ];

    setTimeout(() => {
      setEmployees(mockEmployees);
      setLeaveRequests(mockLeaveRequests);
      setPerformanceReviews(mockReviews);
      setSystemUsers(mockUsers);
      setNotifications(mockNotifications);
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

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

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
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        const newDocument = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString(),
          type: 'PDF'
        };
        return { ...emp, documents: [...(emp.documents || []), newDocument] };
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
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedEmployees = employees.map(emp => {
        if (emp.id === employeeId) {
          return { ...emp, profilePicture: e.target?.result as string };
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
      if (req.id === leaveId) return { ...req, status: action };
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 font-medium">Total Employees</p>
              <p className="text-3xl font-bold mt-2">{stats.totalEmployees}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 font-medium">Active</p>
              <p className="text-3xl font-bold mt-2">{stats.activeEmployees}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Activity className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-100 font-medium">On Leave</p>
              <p className="text-3xl font-bold mt-2">{stats.onLeave}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100 font-medium">New Hires (3mo)</p>
              <p className="text-3xl font-bold mt-2">{stats.newHires}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-indigo-500">
          <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900">Department Distribution</h3>
            <PieChart className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="p-6">
            {Object.keys(departmentStats).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No employees yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(departmentStats).map(([dept, count], index) => {
                  const employeeCount = count as number;
                  const percentage = ((employeeCount / stats.totalEmployees) * 100).toFixed(1);
                  const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600'];
                  return (
                    <div key={dept}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{dept}</span>
                        <span className="text-sm text-gray-600">{employeeCount} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${colors[index % colors.length]} h-3 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border-l-4 border-teal-500">
          <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between bg-gradient-to-r from-teal-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900">Employee Status</h3>
            <BarChart className="w-5 h-5 text-teal-600" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <span className="text-sm text-gray-600">{stats.activeEmployees} ({((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                    style={{ width: `${(stats.activeEmployees / stats.totalEmployees) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">On Leave</span>
                  <span className="text-sm text-gray-600">{stats.onLeave} ({((stats.onLeave / stats.totalEmployees) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
                    style={{ width: `${(stats.onLeave / stats.totalEmployees) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">New Hires (3mo)</span>
                  <span className="text-sm text-gray-600">{stats.newHires} ({((stats.newHires / stats.totalEmployees) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                    style={{ width: `${(stats.newHires / stats.totalEmployees) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-rose-500">
          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-rose-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leave Requests</h3>
          </div>
          <div className="p-6">
            {leaveRequests.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent leave requests</p>
            ) : (
              <div className="space-y-3">
                {leaveRequests.slice(0, 3).map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{req.employeeName}</p>
                      <p className="text-xs text-gray-600">{req.leaveType} • {req.days} days</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border-l-4 border-amber-500">
          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-amber-50 to-white">
            <h3 className="text-lg font-semibold text-gray-900">Performance Reviews</h3>
          </div>
          <div className="p-6">
            {performanceReviews.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent performance reviews</p>
            ) : (
              <div className="space-y-3">
                {performanceReviews.slice(0, 3).map(review => (
                  <div key={review.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{review.employeeName}</p>
                      <p className="text-xs text-gray-600">{review.reviewPeriod}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-bold text-gray-900">{review.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const EmployeeListView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-sm"
              >
                <option value="all">All Departments</option>
                {Object.keys(departmentStats).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-sm"
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
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
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
                <tr key={employee.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          src={employee.profilePicture || 'https://via.placeholder.com/40'}
                          alt={employee.fullName}
                          className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
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
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Employee Details</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedEmployee.profilePicture || 'https://via.placeholder.com/100'}
                    alt={selectedEmployee.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                  />
                  <button
                    onClick={() => profilePicInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
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

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-900">Documents</h4>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-md"
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
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
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

            <div className="p-6 border-t-2 border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
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
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-green-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
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
              <tr key={request.id} className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                  <div className="text-sm text-gray-500">{request.employeeId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.leaveType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.startDate} to {request.endDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{request.days}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleLeaveAction(request.id, 'REJECTED')}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
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
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900">Performance Reviews</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
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
              <tr key={review.id} className="hover:bg-purple-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{review.employeeName}</div>
                  <div className="text-sm text-gray-500">{review.employeeId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.reviewPeriod}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-bold text-gray-900">{review.rating}/5.0</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.reviewDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.reviewer}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-12 h-12" />
            <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium">
              Generate
            </button>
          </div>
          <h3 className="text-lg font-bold mb-2">Employee Report</h3>
          <p className="text-sm text-blue-100">Complete list of all employees with details</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-12 h-12" />
            <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium">
              Generate
            </button>
          </div>
          <h3 className="text-lg font-bold mb-2">Leave Report</h3>
          <p className="text-sm text-green-100">Leave balances and request history</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-12 h-12" />
            <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium">
              Generate
            </button>
          </div>
          <h3 className="text-lg font-bold mb-2">Performance Report</h3>
          <p className="text-sm text-purple-100">Employee performance reviews and ratings</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 text-center py-8">No reports generated yet</p>
        </div>
      </div>
    </div>
  );

  const ActivityLogsView = () => (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-red-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900">System Activity Logs</h3>
        <p className="text-sm text-gray-500 mt-1">Monitor all system activities and user actions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
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
              <tr key={log.id} className="hover:bg-red-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.timestamp.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                  <div className="text-xs text-gray-500">{log.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
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
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b-2 border-gray-200 flex justify-between items-center bg-gradient-to-r from-teal-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900">System Users</h3>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-teal-700 shadow-md">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {systemUsers.map((sysUser) => (
              <tr key={sysUser.id} className="hover:bg-teal-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{sysUser.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sysUser.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    sysUser.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                    sysUser.role === 'HR_ADMIN' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {sysUser.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    sysUser.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sysUser.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sysUser.lastLogin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-900 mr-3 p-1 hover:bg-blue-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input 
                type="text" 
                defaultValue="DICT PNG" 
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
              <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Pacific/Port_Moresby (UTC+10)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
              <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-red-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Enable</button>
          </div>
          <div className="flex items-center justify-between py-3 border-t-2 border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-600">Auto logout after inactivity</p>
            </div>
            <select className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
        </div>
        <div className="p-6 space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Employee updates</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Leave requests</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            <span className="text-sm text-gray-700">System alerts</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900">Database Backup</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Last Backup</p>
              <p className="text-sm text-gray-600">February 3, 2026 at 2:00 AM</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-purple-700 shadow-md">
              <Database className="w-4 h-4" />
              Backup Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r-2 border-gray-200 transition-all duration-300 flex flex-col`}>
          <div className="p-4 border-b-2 border-gray-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">DICT PNG</h2>
                    <p className="text-xs text-gray-500">Employee Mgmt</p>
                  </div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="bg-blue-600 p-2 rounded-lg mx-auto">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>

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
                      ? 'bg-blue-50 text-blue-600 font-semibold'
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

          <div className="p-4 border-t-2 border-gray-200">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b-2 border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, {currentUser.name}!
                </h1>
                <p className="text-sm text-gray-500">Department of Information Communication & Technology</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          {unreadNotificationsCount > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                              {unreadNotificationsCount} new
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                        ) : (
                          notifications.map(notification => (
                            <div 
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${
                                  notification.type === 'info' ? 'bg-blue-100' :
                                  notification.type === 'warning' ? 'bg-yellow-100' :
                                  notification.type === 'success' ? 'bg-green-100' :
                                  'bg-red-100'
                                }`}>
                                  <Bell className={`w-4 h-4 ${
                                    notification.type === 'info' ? 'text-blue-600' :
                                    notification.type === 'warning' ? 'text-yellow-600' :
                                    notification.type === 'success' ? 'text-green-600' :
                                    'text-red-600'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img
                      src={currentUser.profilePicture || 'https://via.placeholder.com/40'}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
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

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border-2 border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
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

          <footer className="bg-white border-t-2 border-gray-200 py-4 px-6">
            <div className="text-center text-sm text-gray-600">
              © 2026 DICT PNG. All rights reserved.
            </div>
          </footer>
        </div>
      </div>

      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeManagementDashboard;