"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@aws-amplify/ui-react";
import { signOutRedirect } from "../page";
import { useAuth } from "react-oidc-context";

const DashboardPage = () => {
  const auth = useAuth();
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
      </div>
      <Button
        id="logout"
        onClick={() => {
          auth.removeUser();
          signOutRedirect();
        }}
      >
        Logout
      </Button>
    </ProtectedRoute>
  );
};

export default DashboardPage;
