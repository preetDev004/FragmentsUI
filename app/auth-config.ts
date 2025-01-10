"use client"

import { Amplify } from 'aws-amplify';

export const authConfig = {
  Cognito: {
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID!,
    userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID!,
    loginWith: {
      oauth: {
        domain: process.env.NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN!,
        scopes: ['email', 'phone', 'openid'],
        redirectSignIn: [process.env.NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL!],
        redirectSignOut: [process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL!],
        responseType: 'code' as const,
      }
    }
  }
}
Amplify.configure({
    Auth: authConfig
  }, {ssr: true});

export default function ConfigureAmplifyClient(){
    return null
}