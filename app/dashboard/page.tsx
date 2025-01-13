"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { covertAuthToUser } from "@/utils/user";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { getUserFragments } from "../api";

const DashboardPage = () => {
  const auth = useAuth();

  useEffect(() => {
    // Clean up URL parameters after successful authentication
    if (auth.isAuthenticated && window.location.search) {
      // Remove query parameters while preserving the path
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const fetchUserFragments = async () => {
      if (auth.isAuthenticated && auth.user) {
        const userFragments = await getUserFragments(
          covertAuthToUser(auth.user)
        );
        console.log(auth.user);
        console.log(userFragments);
      }
    };
    fetchUserFragments();
  }, [auth]);
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-white text-2xl font-bold ">
          {(auth.user?.profile["cognito:username"] as string) || "No user"}
        </h1>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
