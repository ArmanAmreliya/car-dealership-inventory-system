/**
 * Authentication Type Definitions
 *
 * Shared types for authentication state and context.
 * Mirrors User model from backend.
 */

/**
 * Authenticated user object
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication context state
 */
export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
}
