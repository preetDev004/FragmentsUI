import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <>{children}</>;
} 