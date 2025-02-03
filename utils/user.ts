import { User as OidcUser } from "oidc-client-ts";

export interface User {
  username: string;
  idToken: string;
  accessToken: string;
  authorizationHeaders: () => Record<string, string>;
}

export const covertAuthToUser = (auth: OidcUser, type: string): User => {
  return {
    username: auth.profile.name!,
    idToken: auth.id_token!,
    accessToken: auth.access_token!,
    authorizationHeaders: () => {
      const headers: Record<string, string> = { "Content-Type": type };
      headers["Authorization"] = `Bearer ${auth.id_token}`;
      return headers;
    },
  };
};
