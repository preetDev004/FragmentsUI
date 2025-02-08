"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FragmentTypeSelect } from "@/components/FragmentTypeSelect";
import { TextContentInput } from "@/components/TextContentInput";
import { FileUploadArea } from "@/components/FileUploadArea";
import { FormError } from "@/components/FormError";
import { SubmitButton } from "@/components/SubmitButton";
import { validateFragmentContent } from "@/utils/validation";
import { fragmentApi } from "@/lib/fragments";
import type { FragmentType, User } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { useFileHandling } from "@/hooks/utils/useFileHandling";
import { useDragHandling } from "@/hooks/utils/useDragHandling";
import { queryClient } from "./QueryProvider";

export const CreateFragmentForm = ({
  onOpenChange,
  user,
}: {
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
    mutationFn: fragmentApi.createFragment,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateFragmentContent(
      selectedType,
      content,
      file
    );
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    mutation.mutate({ type: selectedType, content, file, user });
  };

  const isTextType = [
    "text/plain",
    "text/markdown",
    "text/html",
    "application/json",
  ].includes(selectedType);

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
            <TextContentInput
              value={content}
              onChange={setContent}
              selectedType={selectedType}
            />
          ) : (
            <FileUploadArea
              selectedType={selectedType}
              file={file}
              isDragging={isDragging}
              handleDrag={handleDrag}
              handleFileSelection={(file: File) =>
                handleFileSelection(file, selectedType)
              }
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
