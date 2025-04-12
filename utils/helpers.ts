import { VALID_FRAGMENT_GROUPS } from "@/constants";
import { FragmentType } from "./types";

export function downloadFragmentContent(
  fragmentId: string,
  fragmentData: string,
  currentType: string,
  viewFormat: string
) {
  if (!fragmentData) return;

  // Determine the file extension based on current viewFormat
  const extension =
    viewFormat === "original" ? currentType.split("/")[1] : viewFormat.split("/")[1];

  // Create a temporary anchor element for download
  const link = document.createElement("a");
  link.href = fragmentData;
  link.download = `fragment-${fragmentId}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper function to check if fragment type is editable (text-based)
export const isEditableType = (type: FragmentType) => {
  return VALID_FRAGMENT_GROUPS.textTypes.includes(type);
};
