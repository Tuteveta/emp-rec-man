"use client";

import { useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import EmployeeManagementDashboard from "@/components/EmployeeManagementDashboard";
import LandingPage from "@/components/LandingPage";
import "@aws-amplify/ui-react/styles.css";
import "./app.css";

Amplify.configure(outputs);

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (!showDashboard) {
    return <LandingPage onGetStarted={() => setShowDashboard(true)} />;
  }

  return (
    <Authenticator
      loginMechanisms={['email']}
      signUpAttributes={['name']}
    >
      {({ signOut, user }) => (
        <EmployeeManagementDashboard 
          signOut={signOut} 
          user={user}
          onSignOut={() => setShowDashboard(false)}
        />
      )}
    </Authenticator>
  );
}