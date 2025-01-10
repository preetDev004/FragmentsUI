
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace('/');
    }
  }, [auth, router]);

  if (auth.isLoading || !auth.isAuthenticated) return null;

  return <>{children}</>;
} 