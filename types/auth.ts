import { FetchUserAttributesOutput } from 'aws-amplify/auth';

export interface User {
  username: string;
  idToken: string;
  accessToken: string;
  attributes: FetchUserAttributesOutput;
  authorizationHeaders: (type?: string) => {
    'Content-Type': string;
    'Authorization': string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
}