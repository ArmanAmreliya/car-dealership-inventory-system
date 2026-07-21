/**
 * useRegister Hook
 *
 * Custom hook for user registration mutation.
 * Manages registration state and automatically updates AuthContext on success.
 * Uses TanStack Query for caching and state management.
 */

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { RegisterInput, AuthResponse } from '../types/auth.types';
import { useAuth } from '../../../hooks/useAuth';
import { AxiosError } from 'axios';

interface RegisterMutationError {
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Hook for registration mutation
 *
 * @returns Mutation object with mutate function, loading, error, and success states
 *
 * @example
 * ```tsx
 * const { mutate: register, isPending, error } = useRegister();
 *
 * const handleRegisterSubmit = (data: RegisterInput) => {
 *   register(data);
 * };
 * ```
 */
export function useRegister(): UseMutationResult<
  AuthResponse,
  AxiosError<RegisterMutationError>,
  RegisterInput,
  unknown
> {
  const { login: authLogin } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (response) => {
      // Update AuthContext with user and token
      authLogin(response.user, response.token);
    },
  });
}
