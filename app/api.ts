import { User } from "@/utils/user";

// Fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';


/**
 * Fetch all fragments for the authenticated user from the fragments microservice.
 * @param user - The authenticated user with an `idToken` attached.
 * @returns The user's fragments data or undefined if the request fails.
 */
export async function getUserFragments(user: User) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers: user.authorizationHeaders(),
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
