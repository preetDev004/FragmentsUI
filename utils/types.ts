import { VALID_FRAGMENT_TYPES } from "@/constants";

export type FragmentType = (typeof VALID_FRAGMENT_TYPES)[number];

export interface FileWithPreview extends File {
  preview?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  idToken: string;
  contentType?: string;
}

export type Fragment = {
  id: string;
  ownerId: string;
  created: string;
  updated: string;
  type: FragmentType;
  content: string;
};

export type FragmentsResponse = {
  status: string;
  fragments: Fragment[];
};
export type FragmentsIDsResponse = {
  status: string;
  fragments: string[];
};
