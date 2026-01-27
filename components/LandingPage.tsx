"use client";

import { 
  Users, BarChart, Calendar, 
  Award, Search, ChevronRight, Star, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";

interface LandingPageProps {
  onGetStarted?: () => void;
}

export default function LandingPageComponent({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Complete Employee Profiles",
      description: "Comprehensive employee records with personal information, employment details, qualifications, and performance history.",
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Real-Time Analytics",
      description: "Interactive dashboards with live statistics on workforce distribution and key HR metrics.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Leave Management",
      description: "Streamlined leave request system with approval workflows and balance tracking.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Performance Reviews",
      description: "Digital performance evaluation system with goal tracking and comprehensive review history.",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Advanced Search",
      description: "Powerful search with filters by department, status, and position for quick access.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" showText={true} />
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <Button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:shadow-xl"
              >
                Access Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-8 text-sm font-semibold">
            <Star className="w-4 h-4 mr-2" />
            Enterprise HR Solution
          </Badge>
          
          <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight">
            Employee
          </h1>
          <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Management System
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            A comprehensive cloud-based solution for the Department of Information 
            Communication & Technology to streamline HR operations with real-time 
            analytics, automated workflows, and enterprise-grade security.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group shadow-xl text-base font-bold py-7 px-8"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Everything You Need to Manage Your Workforce
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Powerful features designed for efficiency, security, and seamless collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:border-blue-400 border-2">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="text-sm text-blue-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-2xl text-blue-100 mb-10 leading-relaxed font-medium">
            Join DICT PNG in modernizing employee management with real-time data, 
            automated workflows, and enterprise security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 group text-base font-black px-10 py-6 shadow-2xl"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-blue-700 text-base font-black px-10 py-6"
            >
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
              <Logo size="md" showText={true} variant="white" />
              
              <p className="text-sm leading-relaxed mt-4 mb-4 font-medium">
                Department of Information Communication & Technology
                <br />Papua New Guinea
              </p>
            </div>

            <div>
              <h4 className="text-white font-black mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black mb-4 text-sm uppercase tracking-wide">Resources</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm font-semibold">
              &copy; {new Date().getFullYear()} Department of Information Communication & Technology, Papua New Guinea. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}