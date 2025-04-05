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
