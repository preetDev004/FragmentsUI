// src/utils/validation.ts
import { FragmentType, FileWithPreview } from "@/utils/types";

export const validateFragmentContent = (
  type: FragmentType,
  content: string,
  file: FileWithPreview | null
): string => {
  if (!content.trim() && !file) return "Content cannot be empty";

  if (type === "application/json" && !file) {
    try {
      JSON.parse(content);
    } catch {
      return "Invalid JSON format";
    }
  }

  return "";
};