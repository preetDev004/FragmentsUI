import { User as OidcUser } from "oidc-client-ts";

import { User } from "@/utils/types";

export const authUtils = {
  getUser: (authUser: OidcUser): User => ({
    id: authUser?.profile.sub,
    name: authUser?.profile.name || "",
    email: authUser?.profile.email || "",
    idToken: authUser?.id_token || "",
  }),
};
