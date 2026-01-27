"use client";

import { useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import EmployeeManagementDashboard from "@/components/EmployeeManagementDashboard";
import LandingPage from "@/components/LandingPage";
import { Building2, ArrowLeft } from "lucide-react";
import "@aws-amplify/ui-react/styles.css";
import "./app.css";

Amplify.configure(outputs);

export default function App() {
  const [showAuth, setShowAuth] = useState(false);

  // Show landing page first
  if (!showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // Show authentication - use email as login mechanism
  return (
    <>
      <Authenticator
        loginMechanisms={['email']}
        hideSignUp={true}
        components={{
          Header() {
            return (
              <div className="text-center py-8 px-6 bg-white">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-14 h-14 p-3 rounded-lg shadow-md flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-gray-900">
                        DICT PNG
                      </div>
                      <div className="text-xs text-gray-600">
                        Employee Management
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-sm text-gray-600">
                  Sign in to access your dashboard
                </p>
              </div>
            );
          },
          Footer() {
            return (
              <div className="text-center py-6 px-6 bg-white">
                <button
                  onClick={() => setShowAuth(false)}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Landing Page
                </button>
              </div>
            );
          },
        }}
      >
        {({ signOut, user }) => (
          <EmployeeManagementDashboard 
            signOut={() => {
              if (signOut) {
                signOut();
              }
              setShowAuth(false);
            }} 
            user={user}
          />
        )}
      </Authenticator>
      
      {/* Copyright outside the card */}
      <div className="fixed bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          © 2026 DICT PNG. All rights reserved.
        </p>
      </div>
    </>
  );
}