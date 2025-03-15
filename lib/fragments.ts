// src/api/fragments.ts
import { FileWithPreview, FragmentType } from "@/utils/types";
import { User } from "@/utils/types";
import { addUserFragment, fetchUserFragments, fetchFragmentById } from "@/app/api";

export const fragmentApi = {
  getUserFragments: async (user: User) => {
    const fragments = await fetchUserFragments(user);
    return fragments || null;
  },

  getUserFragData : async (user: User, id: string) => {
    const fragData = await fetchFragmentById(user, id);
    return fragData || null;
  },

  createFragment: async ({
    type,
    content,
    file,
    user,
  }: {
    type: FragmentType;
    content: string;
    file: FileWithPreview | null;
    user: User;
  }) => {
    return addUserFragment({
      type,
      content,
      file,
      user: {...user, contentType: type} ,
    });
  },
};