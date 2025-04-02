// src/hooks/utils/useFileHandling.ts
import { useState, useEffect } from "react";
import { FileWithPreview } from "@/utils/types";

export const useFileHandling = () => {
  const [file, setFile] = useState<FileWithPreview | null>(null);

  const handleFileSelection = (selectedFile: File, expectedType: string) => {
    if (selectedFile.type !== expectedType) return;

    const fileWithPreview = selectedFile as FileWithPreview;
    if (selectedFile.type.startsWith("image/")) {
      fileWithPreview.preview = URL.createObjectURL(selectedFile);
    }
    setFile(fileWithPreview);
  };

  const clearFile = () => {
    if (file?.preview) URL.revokeObjectURL(file.preview);
    setFile(null);
  };

  useEffect(
    () => () => {
      if (file?.preview) URL.revokeObjectURL(file.preview);
    },
    [file]
  );

  return { file, setFile, handleFileSelection, clearFile };
};
