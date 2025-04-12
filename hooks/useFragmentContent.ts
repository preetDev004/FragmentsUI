import { Fragment, User } from "@/utils/types";
import { useAuth } from "react-oidc-context";
import { useQuery } from "@tanstack/react-query";
import { fragmentsApi } from "@/app/api";
import QuickLRU from "quick-lru";
import { useState } from "react";

// Use QuickLRU with a max size limit to prevent unbounded memory growth
const fragmentContentCache = new QuickLRU<string, { content: string; timestamp: number }>({
  maxSize: 100, // Adjust this value based on expected usage
});

export function useFragmentContent(fragment: Fragment, user: User, isOpen: boolean) {
  const auth = useAuth();
  const [viewFormat, setViewFormat] = useState<string>("original");
  const [isFormatChanging, setIsFormatChanging] = useState(false);

  // Generate a cache key that includes the fragment ID and specific format
  const getCacheKey = (fragmentId: string, format: string) => `${fragmentId}-${format}`;

  const {
    data: fragmentData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fragments", fragment.id, viewFormat],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      if (!auth.isAuthenticated || !auth.user) return null;

      // Determine the correct endpoint and cache key based on view format
      let endpoint = fragment.id;

      // If viewFormat is not "original", use the extension for conversion
      if (viewFormat !== "original") {
        // Extract the subtype (e.g., "html" from "text/html")
        const extension = viewFormat.split("/")[1];
        endpoint = `${fragment.id}.${extension}`;
      }

      const cacheKey = getCacheKey(fragment.id, viewFormat);

      // Check if content is in cache and not too old
      const cachedContent = fragmentContentCache.get(cacheKey);
      if (cachedContent && Date.now() - cachedContent.timestamp < 30 * 60 * 1000) {
        // 30 minutes cache
        return cachedContent.content;
      }

      // Fetch content
      try {
        const fetchedContent = await fragmentsApi.fetchFragmentById(user, endpoint);

        // Cache the new content
        fragmentContentCache.set(cacheKey, {
          content: fetchedContent,
          timestamp: Date.now(),
        });

        return fetchedContent;
      } catch (err) {
        console.error(err);

        // Cache the error state
        const errorMessage = "Error loading fragment content";
        fragmentContentCache.set(cacheKey, {
          content: errorMessage,
          timestamp: Date.now(),
        });

        throw err;
      }
    },
    enabled: !!auth.isAuthenticated && !!auth.user && isOpen,
  });

  const clearAllCachedFormatsForFragment = (fragmentId: string) => {
    // Get all cache keys stored in fragmentContentCache
    const allKeys = Array.from(fragmentContentCache.keys());

    // Filter keys that belong to this fragment and delete them
    allKeys.forEach((key) => {
      if (key.startsWith(`${fragmentId}-`)) {
        fragmentContentCache.delete(key);
      }
    });
  };

  return {
    fragmentData,
    isLoading,
    error,
    refetch,
    viewFormat,
    setViewFormat,
    isFormatChanging,
    setIsFormatChanging,
    clearAllCachedFormatsForFragment,
  };
}
