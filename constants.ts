import { FragmentType } from "./utils/types";

export const VALID_FRAGMENT_TYPES = [
  "text/plain",
  "text/markdown",
  "text/html",
  "application/json",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const VALID_FRAGMENT_GROUPS = {
  textTypes: ["text/plain", "text/markdown", "text/html", "application/json"] as FragmentType[],
  imageTypes: ["image/png", "image/jpeg", "image/webp"] as FragmentType[],
};