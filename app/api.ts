import { FileWithPreview, FragmentType, User } from "@/utils/types";

/**
 * Fetch all fragments for the authenticated user from the fragments microservice.
 * @param user - The authenticated user with an `idToken` attached.
 * @returns The user's fragments data or undefined if the request fails.
 */
const fetchUserFragments = async (user: User) => {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/fragments?expand=1`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": user.contentType,
      } as HeadersInit,
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Unable to call GET /v1/fragments", { err });
    throw err;
  }
};

const fetchFragmentById = async (user: User, id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/fragments/${id}`, {
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    } as HeadersInit,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch fragment details");
  }
  const contentType = response.headers.get("Content-Type");
  if (!contentType) {
    throw new Error("Failed to fetch fragment details");
  }
  return response.text();
};

const addUserFragment = async ({
  type,
  content,
  file,
  user,
}: {
  type: FragmentType;
  content: string;
  file: FileWithPreview | null;
  user: User;
}): Promise<unknown> => {
  const formData = new FormData();
  formData.append("type", type);
  if (file) {
    formData.append("file", file);
  } else {
    formData.append("content", content);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/fragments`, {
    method: "POST",
    body: content ? content : file,
    headers: {
      Authorization: `Bearer ${user.idToken}`,
      "Content-Type": user.contentType,
    } as HeadersInit,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
};
const deleteUserFragment = async (user: User, id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/fragments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    } as HeadersInit,
  });
  if (!response.ok) {
    throw new Error("Failed to delete fragment details");
  }
  return;
};
const deleteUserFragments = async (user: User, ids: string[]) => {
  const queryString = ids.map((id) => `ids=${encodeURIComponent(id)}`).join("&");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/fragments?${queryString}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    } as HeadersInit,
  });

  if (!response.ok) {
    throw new Error("Failed to delete fragments");
  }
};

export const fragmentsApi = {
  fetchUserFragments,
  fetchFragmentById,
  addUserFragment,
  deleteUserFragment,
  deleteUserFragments,
};
