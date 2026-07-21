/**
 * useAuth Hook
 *
 * Custom hook for consuming authentication context.
 * Provides type-safe access to authentication state and actions.
 * Throws error if used outside AuthProvider.
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types/auth';

/**
 * Hook to access authentication context
 *
 * @returns Authentication context with user, token, isAuthenticated, and auth actions
 * @throws Error if used outside AuthProvider
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, logout } = useAuth();
 * if (isAuthenticated) {
 *   return <div>Welcome, {user?.name}</div>;
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
