import { fragmentsApi } from "@/app/api";
import { useToast } from "@/hooks/use-toast";
import { Fragment, User } from "@/utils/types";
import { validateFragmentContent } from "@/utils/validation";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function useFragmentUpdate(
  fragment: Fragment,
  user: User,
  refetch: () => void,
  // eslint-disable-next-line no-unused-vars
  clearAllCachedFormatsForFragment: (fragmentId: string) => void
) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const setEditedContentWithLog = (content: string) => {
    setEditedContent(content);
  };

  const updateFragmentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await fragmentsApi.updateUserFragment(user, fragment.id, content, fragment.type);
    },
    onSuccess: () => {
      setIsEditing(false);
      clearAllCachedFormatsForFragment(fragment.id);
      refetch();
      toast({
        title: "Fragment Updated",
        description: "Fragment content has been updated successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveClick = async () => {
    try {
      // Validate the content
      const validationMsg = await validateFragmentContent(fragment.type, editedContent, null);

      if (validationMsg) {
        setValidationError(validationMsg);
        return;
      }

      setValidationError(null);
      updateFragmentMutation.mutate(editedContent);
    } catch (err) {
      console.error("Validation error:", err);
      setValidationError("An unexpected error occurred during validation");
    }
  };

  const formatContentForEdit = (content: string, type: string) => {
    if (type === "application/json") {
      try {
        return JSON.stringify(JSON.parse(content), null, 2);
      } catch {
        return content;
      }
    }
    return content;
  };

  return {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent: setEditedContentWithLog,
    validationError,
    setValidationError,
    isPending: updateFragmentMutation.isPending,
    handleSaveClick,
    formatContentForEdit,
  };
}
