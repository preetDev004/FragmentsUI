import { FragmentType } from "@/utils/types";
import { User } from "@/utils/types";

/**
 * Fetch all fragments for the authenticated user from the fragments microservice.
 * @param user - The authenticated user with an `idToken` attached.
 * @returns The user's fragments data or undefined if the request fails.
 */
export async function fetchUserFragments(user: User) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/fragments`, {
      headers: {"Authorization" : `Bearer ${user.idToken}`, "Content-Type" : user.contentType} as HeadersInit
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragments', { err });
  }
}

export const addUserFragment = async ({
  type,
  content,
  file,
  user
}: {
  type: FragmentType;
  content: string;
  file: File | null;
  user: User
}): Promise<unknown> => {
  const formData = new FormData();
  formData.append("type", type);
  if (file) {
    formData.append("file", file);
  } else {
    formData.append("content", content);
  }

  const response  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/fragments`, {
    method: "POST",
    body: content ? content : file,
    headers: {"Authorization" : `Bearer ${user.idToken}`, "Content-Type" : user.contentType} as HeadersInit,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
