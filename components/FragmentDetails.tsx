import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Fragment, User } from "@/utils/types";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { FragmentContentControls } from "./fragments/FragmentContentControls";
import { FragmentContentEditor } from "./fragments/FragmentContentEditor";
import { FragmentContentViewer } from "./fragments/FragmentContentViewer";
import { FragmentMetadata } from "./fragments/FragmentMetadata";
import { useFragmentContent } from "@/hooks/useFragmentContent";
import { useFragmentUpdate } from "@/hooks/useFragmentUpdate";
import { downloadFragmentContent, isEditableType } from "@/utils/helpers";

export const FragmentDetailsDialog = ({
  isOpen,
  onOpenChange,
  fragment,
  user,
}: {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  fragment: Fragment;
  user: User;
}) => {
  const { toast } = useToast();

  // Use custom hooks for fetching content and handling updates
  const {
    fragmentData,
    isLoading,
    error,
    refetch,
    viewFormat,
    setViewFormat,
    isFormatChanging,
    setIsFormatChanging,
    clearAllCachedFormatsForFragment,
  } = useFragmentContent(fragment, user, isOpen);

  const {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    validationError,
    setValidationError,
    isPending,
    handleSaveClick,
    formatContentForEdit,
  } = useFragmentUpdate(fragment, user, refetch, clearAllCachedFormatsForFragment);

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

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setViewFormat("original");
      setIsEditing(false);
      setValidationError(null);
    }
  }, [isOpen, setViewFormat, setIsEditing, setValidationError]);

  // Modify this effect to add a check that prevents overriding during edit
  useEffect(() => {
    if (fragmentData && !isLoading && isEditableType(fragment.type) && !isEditing) {
      // Only update if we're not currently editing
      setEditedContent(formatContentForEdit(fragmentData, fragment.type));
    }
  }, [fragmentData, isLoading, fragment.type, formatContentForEdit, setEditedContent, isEditing]);

  // Clear format changing state when data loads
  useEffect(() => {
    if (!isLoading && isFormatChanging) {
      setIsFormatChanging(false);
    }
  }, [fragmentData, isLoading, isFormatChanging, setIsFormatChanging]);

  // Handle image download
  const handleImageDownload = () =>
    downloadFragmentContent(fragment.id, fragmentData || "", fragment.type, viewFormat);

  // Handle cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setValidationError(null);
    if (fragmentData) setEditedContent(fragmentData);
  };

  // Format date for display
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

        {/* Metadata Section */}
        <FragmentMetadata fragment={fragment} formattedDate={fullDate} />

        {/* Content Section */}
        <div className="flex flex-col w-full">
          <FragmentContentControls
            fragment={fragment}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isLoading={isLoading}
            handleSave={handleSaveClick}
            handleCancel={handleCancel}
            viewFormat={viewFormat}
            setViewFormat={setViewFormat}
            setIsFormatChanging={setIsFormatChanging}
            isPending={isPending}
            hasError={!!error}
            isEditableType={isEditableType}
          />

          {isLoading || isFormatChanging ? (
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
          ) : isEditing && !fragment.type.startsWith("image/") ? (
            <FragmentContentEditor
              fragment={fragment}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              validationError={validationError}
              setValidationError={setValidationError}
              isPending={isPending}
            />
          ) : (
            <FragmentContentViewer
              fragment={fragment}
              fragmentData={fragmentData || ""}
              isLoading={isLoading}
              viewFormat={viewFormat}
              handleImageDownload={handleImageDownload}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
