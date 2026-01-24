"use client";

import { 
  Building2, Shield, Users, BarChart, Clock, FileText, 
  CheckCircle, Lock, Database, Zap, Globe, ArrowRight,
  UserCog, TrendingUp, Calendar, Award, Bell, Search,
  ChevronRight, Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LandingPageProps {
  onGetStarted?: () => void;
}

export default function LandingPageComponent({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Complete Employee Profiles",
      description: "Comprehensive employee records with personal information, employment details, qualifications, and performance history.",
      color: "blue"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Real-Time Analytics",
      description: "Interactive dashboards with live statistics on workforce distribution and key HR metrics.",
      color: "purple"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Role-Based Security",
      description: "Four-tier security system with Super Admin, HR Admin, HR Officer, and Employee access levels.",
      color: "red"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Leave Management",
      description: "Streamlined leave request system with approval workflows and balance tracking.",
      color: "green"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Performance Reviews",
      description: "Digital performance evaluation system with goal tracking and comprehensive review history.",
      color: "yellow"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Advanced Search",
      description: "Powerful search with filters by department, status, and position for quick access.",
      color: "indigo"
    }
  ];

  const userRoles = [
    {
      role: "Super Admin",
      icon: <Shield className="w-8 h-8" />,
      color: "red",
      permissions: [
        "Full system access",
        "User role management",
        "System configuration",
        "Audit log access"
      ]
    },
    {
      role: "HR Admin",
      icon: <UserCog className="w-8 h-8" />,
      color: "blue",
      permissions: [
        "Complete CRUD operations",
        "Approve leave requests",
        "Performance reviews",
        "Generate reports"
      ]
    },
    {
      role: "HR Officer",
      icon: <Users className="w-8 h-8" />,
      color: "green",
      permissions: [
        "Create/update records",
        "View leave requests",
        "Input performance data",
        "Export employee data"
      ]
    },
    {
      role: "Employee",
      icon: <Users className="w-8 h-8" />,
      color: "gray",
      permissions: [
        "View personal profile",
        "Submit leave requests",
        "View performance reviews",
        "Self-service portal"
      ]
    }
  ];

  const techStack = [
    { name: "Next.js 15", tag: "Frontend" },
    { name: "AWS Amplify Gen 2", tag: "Backend" },
    { name: "DynamoDB", tag: "Database" },
    { name: "AppSync", tag: "GraphQL API" },
    { name: "Cognito", tag: "Auth" },
    { name: "TypeScript", tag: "Type Safety" },
    { name: "Tailwind CSS", tag: "Styling" },
    { name: "React 18", tag: "UI Framework" }
  ];

  const stats = [
    { number: "4", label: "User Roles", icon: <Shield className="w-5 h-5" /> },
    { number: "9+", label: "Features", icon: <Zap className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Clock className="w-5 h-5" /> },
    { number: "24/7", label: "Available", icon: <Globe className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">DICT PNG</div>
                <div className="text-xs text-gray-500">Employee Management</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#roles" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">User Roles</a>
              <a href="#tech" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Technology</a>
              <Button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Launch App
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <Badge variant="secondary" className="mb-6">
                <Star className="w-3.5 h-3.5 mr-2" />
                Enterprise HR Solution
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Modern Employee
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Management System
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A comprehensive cloud-based solution for the Department of Information 
                Communication & Technology to streamline HR operations with real-time 
                analytics, automated workflows, and enterprise-grade security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  onClick={onGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 group"
                >
                  Access Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 border-0 shadow-2xl">
                <CardContent className="p-8">
                  <Card className="mb-4">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">Employee Overview</CardTitle>
                          <CardDescription>Real-time statistics</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Active Employees</span>
                          <span className="text-lg font-bold text-gray-900">247</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>On Leave: 12</span>
                          <span>New: 5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {['HR Admin', 'Officers', 'Employees'].map((role, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
                        <div className="text-2xl font-bold text-white mb-1">
                          {i === 0 ? '8' : i === 1 ? '24' : '215'}
                        </div>
                        <div className="text-xs text-blue-100">{role}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-900">All Systems Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Workforce
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for efficiency, security, and seamless collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="text-sm text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section id="roles" className="py-24 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Four-Tier Access Control
            </h2>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto">
              Granular permissions ensuring data security and appropriate access levels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRoles.map((role, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all hover:scale-105 border-white/20 flex flex-col">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <div className="text-purple-600">
                      {role.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center text-gray-900">{role.role}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-0">
                  <ul className="space-y-3">
                    {role.permissions.map((permission, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{permission}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade infrastructure powered by AWS and cutting-edge frameworks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {techStack.map((tech, index) => (
              <Card key={index} className="hover:border-blue-300 hover:shadow-lg transition-all group">
                <CardContent className="p-6 text-center">
                  <div className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tech.name}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {tech.tag}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Badge */}
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Enterprise Security</h3>
                    <p className="text-blue-100">AWS-grade encryption and compliance</p>
                  </div>
                </div>
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="text-4xl font-bold">99.9%</div>
                    <div className="text-blue-100 text-sm">Uptime SLA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">SOC 2</div>
                    <div className="text-blue-100 text-sm">Compliant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">256-bit</div>
                    <div className="text-blue-100 text-sm">Encryption</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join DICT PNG in modernizing employee management with real-time data, 
            automated workflows, and enterprise security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 group"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-blue-700">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold">DICT PNG</div>
                  <div className="text-xs text-gray-500">Employee Management System</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Department of Information Communication & Technology
                <br />Papua New Guinea
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs">All Systems Operational</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Department of Information Communication & Technology, Papua New Guinea. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}