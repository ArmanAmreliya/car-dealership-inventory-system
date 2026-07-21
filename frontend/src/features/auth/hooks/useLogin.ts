/**
 * useLogin Hook
 *
 * Custom hook for user login mutation.
 * Manages login state and automatically updates AuthContext on success.
 * Uses TanStack Query for caching and state management.
 */

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { LoginInput, AuthResponse } from '../types/auth.types';
import { useAuth } from '../../../hooks/useAuth';
import { AxiosError } from 'axios';

interface LoginMutationError {
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Hook for login mutation
 *
 * @returns Mutation object with mutate function, loading, error, and success states
 *
 * @example
 * ```tsx
 * const { mutate: login, isPending, error } = useLogin();
 *
 * const handleLoginSubmit = (data: LoginInput) => {
 *   login(data);
 * };
 * ```
 */
export function useLogin(): UseMutationResult<
  AuthResponse,
  AxiosError<LoginMutationError>,
  LoginInput,
  unknown
> {
  const { login: authLogin } = useAuth();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      // Update AuthContext with user and token
      authLogin(response.user, response.token);
    },
  });
}
