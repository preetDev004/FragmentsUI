'use client';

import { createContext, useContext, useState, ReactNode, useLayoutEffect } from 'react';
import { signOut, getCurrentUser, fetchUserAttributes, signInWithRedirect } from 'aws-amplify/auth';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { AuthContextType, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const tokens = await cognitoUserPoolsTokenProvider.getTokens();
      
      // Check if we have the required tokens
      if (!tokens?.idToken || !tokens?.accessToken) {
        throw new Error('No valid tokens found');
      }

      const userInfo: User = {
        username: currentUser.username,
        idToken: tokens.idToken.toString(),
        accessToken: tokens.accessToken.toString(),
        attributes,
        authorizationHeaders: (type = 'application/json') => ({
          'Content-Type': type,
          'Authorization': `Bearer ${tokens.idToken?.toString()}`
        })
      };
      setUser(userInfo);
    } catch (err) {
      console.log('Not authenticated', err);
      setUser(null);
    }
    setLoading(false);
  }

  const handleSignIn = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn: handleSignIn, 
      signOut: handleSignOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);