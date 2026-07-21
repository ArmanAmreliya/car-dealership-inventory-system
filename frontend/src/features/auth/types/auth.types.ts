/**
 * Authentication Feature Types
 *
 * Type definitions for login and register forms,
 * and responses from auth API endpoints.
 */

/**
 * Login form input
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Register form input
 */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication response from backend
 * Returned by both login and register endpoints
 */
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

/**
 * API error response
 */
export interface ApiError {
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
