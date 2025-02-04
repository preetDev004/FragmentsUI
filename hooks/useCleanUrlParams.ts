// src/hooks/utils/useCleanUrlParams.ts
import { useEffect } from "react";

export const useCleanUrlParams = (isAuthenticated: boolean) => {
  useEffect(() => {
    if (isAuthenticated && window.location.search) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [isAuthenticated]);
};