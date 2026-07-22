/**
 * Login Form Component
 *
 * Uncontrolled form using React Hook Form with Zod validation.
 * Manages login state and error handling.
 * Does not handle page navigation - that's the parent page's responsibility.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../hooks/useLogin';
import { LoginInput } from '../types/auth.types';
import { toast } from 'sonner';

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => {
        toast.success('Successfully logged in!');
        onSuccess?.();
      },
      onError: (error: any) => {
        console.error('[LoginForm submission error]:', error);
        const apiErrorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Invalid email or password';
        toast.error(apiErrorMessage);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@email.com"
          {...register('email')}
          className="mt-1.5 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-neutral-400 transition-colors"
          disabled={isPending}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <a href="#forgot" className="text-xs text-blue-500 hover:text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          placeholder="********"
          {...register('password')}
          className="mt-1.5 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-neutral-400 transition-colors"
          disabled={isPending}
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#00C49F] hover:bg-[#00B08F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isPending ? 'Logging in...' : 'Log-In'}
      </button>
    </form>
  );
}
