"use client";

import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function AmplifyWrapper({ children }: { children: React.ReactNode }) {
  return <Authenticator>{children}</Authenticator>;
}

export default withAuthenticator(AmplifyWrapper, {
    signUpAttributes: ['email'],
}) ;