/**
 * Authentication Context
 *
 * Manages application-wide authentication state including:
 * - Current authenticated user profile
 * - JWT token storage and lifecycle
 * - Login/logout operations
 * - Session restoration from localStorage on app startup
 *
 * Context is provided at the application root via Providers component.
 */

import { createContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthContextType } from '../types/auth';
import { getStoredToken, setStoredToken, getStoredUser, setStoredUser, clearAuthStorage } from '../lib/storage';

/**
 * Create the authentication context
 * Default value is undefined - must be wrapped in AuthProvider
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 *
 * Wraps the application and provides authentication context.
 * Restores session from localStorage on initial mount.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Restore authentication session from localStorage on app startup.
   * No auto-login — if no stored session exists the user must log in manually.
   */
  useEffect(() => {
    const restoreSession = () => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUserState(storedUser);
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /**
   * Handle user login
   * Stores user and token in localStorage and updates context state
   */
  const login = (newUser: AuthUser, newToken: string) => {
    setStoredUser(newUser);
    setStoredToken(newToken);
    setUserState(newUser);
    setTokenState(newToken);
  };

  /**
   * Handle user logout
   * Clears authentication data from localStorage and context
   */
  const logout = () => {
    clearAuthStorage();
    setUserState(null);
    setTokenState(null);
  };

  /**
   * Update user state directly (used for profile updates, etc.)
   */
  const setUser = (newUser: AuthUser | null) => {
    if (newUser) {
      setStoredUser(newUser);
    } else {
      clearAuthStorage();
    }
    setUserState(newUser);
  };

  /**
   * Update token state directly
   */
  const setToken = (newToken: string | null) => {
    if (newToken) {
      setStoredToken(newToken);
    } else {
      clearAuthStorage();
    }
    setTokenState(newToken);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
