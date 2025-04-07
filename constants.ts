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
};
