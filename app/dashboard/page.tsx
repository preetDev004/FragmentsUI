"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "react-oidc-context";

import FragmentTable from "@/components/FragmentTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCleanUrlParams } from "@/hooks/useCleanUrlParams";
import { authUtils } from "@/utils/auth";
import { fragmentsApi } from "../api";

const DashboardPage = () => {
  const auth = useAuth();

  const { data } = useQuery({
    queryKey: ["fragments"],
    queryFn: async () => {
      if (!auth.isAuthenticated || !auth.user) return null;
      return (await fragmentsApi.fetchUserFragments(
        authUtils.getUser(auth.user))
      );
    },
    enabled: auth.isAuthenticated,
  });
  useCleanUrlParams(auth.isAuthenticated);

  return (
    <ProtectedRoute>
      <div className="h-auto max-h-screen">
        <main className="mt-5 sm:mt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center sm:items-start mb-8 transition-all duration-200">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
                  Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-300">
                  Find all your data fragments at one place!
                </p>
              </div>

              <FragmentTable data={data ? data.fragments : []} />
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
