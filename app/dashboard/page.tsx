"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

import { CreateFragmentDialog } from "@/components/CreateFragmentDailog";
import { FragmentContent } from "@/components/FragmentContent";
import { FragmentIDS } from "@/components/FragmentIDS";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCleanUrlParams } from "@/hooks/useCleanUrlParams";
import { fragmentApi } from "@/lib/fragments";
import { authUtils } from "@/utils/auth";

const DashboardPage = () => {
  const auth = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["fragments"],
    queryFn: () => {
      if (!auth.isAuthenticated || !auth.user) return null;
      return fragmentApi.getUserFragments(authUtils.getUser(auth.user));
    },
    enabled: auth.isAuthenticated,
  });
  useCleanUrlParams(auth.isAuthenticated);

  return (
    <ProtectedRoute>
      <div className="h-auto max-h-screen">
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-8 transition-all duration-200">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
                  Dashboard
                </h1>

                <CreateFragmentDialog
                  isOpen={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  user={authUtils.getUser(auth.user!)}
                />
              </div>

              {data && typeof data.fragments[0] === "string" ? (
                <FragmentIDS data={data} />
              ) : (
                <FragmentContent data={data} />
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
