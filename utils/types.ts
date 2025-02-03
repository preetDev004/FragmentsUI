import { VALID_FRAGMENT_TYPES } from "@/constants";

export type FragmentType = (typeof VALID_FRAGMENT_TYPES)[number];
export interface FileWithPreview extends File {
  preview?: string;
}