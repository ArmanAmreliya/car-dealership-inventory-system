/**
 * Authentication Service
 *
 * Wraps backend authentication endpoints with the shared Axios client.
 * Provides login and register API methods.
 */

import { apiClient } from '../../../api/axios-client';
import { LoginInput, RegisterInput, AuthResponse } from '../types/auth.types';

/**
 * Authentication API service
 */
export const authService = {
  /**
   * Register a new user account
   *
   * @param data - Registration form data (name, email, password)
   * @returns User object and JWT token
   */
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/register', data);
    return response.data;
  },

  /**
   * Login with email and password
   *
   * @param data - Login form data (email, password)
   * @returns User object and JWT token
   */
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', data);
    return response.data;
  },
};
