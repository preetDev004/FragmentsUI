"use client";

import { FileUploadArea } from "@/components/FileUploadArea";
import { FormError } from "@/components/FormError";
import { FragmentTypeSelect } from "@/components/FragmentTypeSelect";
import { SubmitButton } from "@/components/SubmitButton";
import { TextContentInput } from "@/components/TextContentInput";
import { useToast } from "@/hooks/use-toast";
import { useDragHandling } from "@/hooks/utils/useDragHandling";
import { useFileHandling } from "@/hooks/utils/useFileHandling";
import type { FileWithPreview, FragmentType, User } from "@/utils/types";
import { validateFragmentContent } from "@/utils/validation";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { queryClient } from "./QueryProvider";
import { fragmentsApi } from "@/app/api";

export const CreateFragmentForm = ({
  onOpenChange,
  user,
}: {
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  user: User;
}) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<FragmentType>("text/plain");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { file, handleFileSelection, clearFile } = useFileHandling();
  const { isDragging, handleDrag } = useDragHandling();

  const mutation = useMutation({
    mutationFn: async ({
      type: selectedType,
      content,
      file,
      user,
    }: {
      type: FragmentType;
      content: string;
      file: FileWithPreview | null;
      user: User;
    }) =>
      await fragmentsApi.addUserFragment({
        type: selectedType,
        content,
        file,
        user: { ...user, contentType: selectedType },
      }),
    onSuccess: () => {
      toast({
        title: "Fragment Created Successfully!",
        description: `It's a ${selectedType} fragment.`,
        variant: "success",
      });
      setContent("");
      clearFile();
      queryClient.invalidateQueries({ queryKey: ["fragments"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Fragment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedType, content, file);

    try {
      // We need to await the validation result since it's now a Promise
      const validationMsg = await validateFragmentContent(selectedType, content, file);
      if (validationMsg) {
        setError(validationMsg);
        return;
      }
      setError("");
      mutation.mutate({ type: selectedType, content, file, user });
    } catch (err) {
      // Handle any unexpected errors during validation
      console.error("Validation error:", err);
      setError("An unexpected error occurred during validation");
    }
  };

  const isTextType = ["text/plain", "text/markdown", "text/html", "application/json"].includes(
    selectedType
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <FragmentTypeSelect
          selectedType={selectedType}
          onTypeChange={(type: FragmentType) => {
            setSelectedType(type);
            clearFile();
            setContent("");
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Content</label>
          {isTextType ? (
            <TextContentInput value={content} onChange={setContent} selectedType={selectedType} />
          ) : (
            <FileUploadArea
              selectedType={selectedType}
              file={file}
              isDragging={isDragging}
              handleDrag={handleDrag}
              handleFileSelection={(file: File) => handleFileSelection(file, selectedType)}
              clearFile={clearFile}
            />
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          {error && <FormError message={error} />}
        </motion.div>
      </motion.div>

      <SubmitButton isLoading={mutation.isPending} />
    </form>
  );
};
