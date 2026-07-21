/**
 * Local Storage Helpers
 *
 * Provides type-safe utilities for persisting authentication state to localStorage.
 * Centralizes token and user object persistence for session management.
 */

const TOKEN_KEY = 'dealerflow_token' as const;
const USER_KEY = 'dealerflow_user' as const;

/**
 * User object persisted in localStorage
 * Mirrors the User model from the backend
 */
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Retrieve stored authentication token from localStorage
 * @returns JWT token string or null if not found
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to read token from storage:', error);
    return null;
  }
}

/**
 * Persist authentication token to localStorage
 * @param token JWT token string to store
 */
export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to write token to storage:', error);
  }
}

/**
 * Retrieve stored user object from localStorage
 * @returns Parsed user object or null if not found
 */
export function getStoredUser(): StoredUser | null {
  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to read user from storage:', error);
    return null;
  }
}

/**
 * Persist user object to localStorage
 * @param user User object to store
 */
export function setStoredUser(user: StoredUser): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to write user to storage:', error);
  }
}

/**
 * Clear all authentication data from localStorage
 * Used during logout or session expiration
 */
export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to clear auth storage:', error);
  }
}

/**
 * Check if user is currently authenticated (has valid token)
 * @returns true if token exists in storage, false otherwise
 */
export function isAuthenticated(): boolean {
  return getStoredToken() !== null;
}
