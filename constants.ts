import { FragmentType } from "./utils/types";

export const VALID_FRAGMENT_TYPES = [
  "text/plain",
  "text/markdown",
  "text/html",
  "text/csv",
  "application/json",

  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

export const VALID_FRAGMENT_GROUPS = {
  textTypes: [
    "text/plain",
    "text/markdown",
    "text/html",
    "text/csv",
    "application/json",
  ] as FragmentType[],

  imageTypes: [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "image/gif",
  ] as FragmentType[],
};

export const VALID_FRAGMENT_CONVERSIONS = {
  "text/plain": [],
  "text/markdown": ["text/plain", "text/html"],
  "text/html": ["text/plain"],
  "text/csv": ["text/plain", "application/json"],
  "application/json": ["text/plain", "text/yaml"],
  "application/yaml": ["text/plain"],

  "image/png": ["image/jpeg", "image/webp", "image/gif", "image/avif"],
  "image/jpeg": ["image/png", "image/webp", "image/gif", "image/avif"],
  "image/webp": ["image/jpeg", "image/png", "image/gif", "image/avif"],
  "image/avif": [],
  // "image/avif": ["image/jpeg", "image/webp", "image/gif", "image/png"],
  "image/gif": ["image/jpeg", "image/webp", "image/png", "image/avif"],
};
