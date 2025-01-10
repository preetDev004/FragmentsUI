"use client"

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_AWS_COGNITO_AUTHORITY,
  client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL,
  response_type: "code",
  scope: "email openid phone",
};

const MaxWidthWrapper = ({
  classname,
  children,
}: {
  classname?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-2xl px-2.5 md:px-20",
        classname
      )}
    >
      <AuthProvider {...cognitoAuthConfig}>
        {children}
      </AuthProvider>
    </div>
  );
};

export default MaxWidthWrapper;
