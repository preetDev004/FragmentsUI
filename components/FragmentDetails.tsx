import { fragmentsApi } from "@/app/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Fragment, User } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertCircle, Clock, Info, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import QuickLRU from "quick-lru";

// Use QuickLRU with a max size limit to prevent unbounded memory growth
const fragmentContentCache = new QuickLRU<string, { content: string; timestamp: number }>({
  maxSize: 100, // Adjust this value based on expected usage
});

export const FragmentDetailsDialog = ({
  isOpen,
  onOpenChange,
  fragment,
  user,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fragment: Fragment;
  user: User;
}) => {
  const auth = useAuth();
  const { toast } = useToast();
  const [viewFormat, setViewFormat] = useState<"original" | "html">("original");

  // Generate a cache key that includes the fragment ID and specific format
  const getCacheKey = (fragmentId: string, format: string) => `${fragmentId}-${format}`;

  // Single query to fetch fragment content
  const {
    data: fragmentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fragments", fragment.id, viewFormat],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      if (!auth.isAuthenticated || !auth.user) return null;

      // Determine the correct endpoint and cache key based on view format
      const endpoint =
        viewFormat === "html" && fragment.type === "text/markdown"
          ? `${fragment.id}.html`
          : fragment.id;
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

  // Error handling effect
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load fragment content",
      });
    }
  }, [error, toast]);

  // Reset view format when dialog opens
  useEffect(() => {
    if (isOpen) {
      setViewFormat("original");
    }
  }, [isOpen]);

  const createdDate = fragment.created ? new Date(fragment.created) : null;
  const fullDate = createdDate ? format(createdDate, "d MMM yyyy, h:mm a") : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-orange-900/50 text-white flex flex-col items-start justify-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
            Fragment Details
          </DialogTitle>
        </DialogHeader>

        {/* Metadata Section (unchanged) */}
        <div className="mt-4 mb-4 bg-orange-950/10 border border-orange-900/20 rounded-lg overflow-hidden backdrop-blur-sm w-full">
          <div className="grid grid-cols-2 gap-2">
            {/* ID - First Row, Full Width */}
            <div className="col-span-2">
              <div className="flex items-center space-x-3 p-2 rounded-md bg-orange-950/30">
                <Info size={18} className="text-orange-400" />
                <div className="flex flex-col">
                  <span className="text-orange-300 text-xs uppercase tracking-wider font-semibold">
                    ID
                  </span>
                  <div className="text-white/90 text-xs font-mono mt-1 overflow-hidden text-ellipsis w-full">
                    {fragment.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Created - Second Row, Right Column */}
            <div className="col-span-1">
              <div className="flex items-center space-x-3 p-2 rounded-md bg-orange-950/30">
                <Clock size={18} className="text-orange-400" />
                <div className="flex flex-col">
                  <span className="text-orange-300 text-xs uppercase tracking-wider font-semibold">
                    Created
                  </span>
                  <div className="text-white/90 text-sm mt-1">
                    {fullDate || "Unknown"} {/* Use fullDate here */}
                  </div>
                </div>
              </div>
            </div>

            {/* Type - Second Row, Left Column */}
            <div className="col-span-1">
              <div className="flex items-center space-x-3 p-2 rounded-md bg-orange-950/30">
                <Tag size={18} className="text-orange-400" />
                <div className="flex flex-col">
                  <span className="text-orange-300 text-xs uppercase tracking-wider font-semibold">
                    Type
                  </span>
                  <div className="text-white/90 text-sm mt-1 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                    {fragment.type || "text/plain"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-orange-300 text-sm uppercase tracking-wider font-semibold">
              Content
            </h3>
            {fragment.type === "text/markdown" && (
              <Select
                value={viewFormat}
                onValueChange={(value: "original" | "html") => setViewFormat(value)}
              >
                <SelectTrigger className="w-32 bg-orange-950/30 border-orange-900/30 text-orange-300">
                  <SelectValue placeholder="View as..." />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-orange-900/50">
                  <SelectItem value="original" className="text-orange-300">
                    Original
                  </SelectItem>
                  <SelectItem value="html" className="text-orange-300">
                    HTML
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="animate-pulse flex space-x-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-150"></div>
              </div>
              <div className="text-orange-400/80 text-sm mt-4">Loading content...</div>
            </div>
          ) : error ? (
            <div className="flex-1 bg-red-950/20 border border-red-900/30 p-4 rounded-md flex items-center text-red-300">
              <AlertCircle size={18} className="text-red-400 mr-2" />
              Error loading fragment content
            </div>
          ) : (
            <div className="flex-1 w-full bg-black border border-orange-900/30 p-4 rounded-md max-h-80 overflow-auto font-mono text-sm whitespace-pre-wrap text-orange-100/90 relative">
              <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
              {fragmentData || "No content available"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
