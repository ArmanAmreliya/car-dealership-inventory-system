/**
 * Register Form Component
 *
 * Uncontrolled form using React Hook Form with Zod validation.
 * Manages registration state and error handling.
 * Does not handle page navigation - that's the parent page's responsibility.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../hooks/useRegister';
import { RegisterInput } from '../types/auth.types';
import { toast } from 'sonner';

/**
 * Register form validation schema
 */
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { mutate: register, isPending } = useRegister();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    register(data, {
      onSuccess: () => {
        toast.success('Successfully created account!');
        onSuccess?.();
      },
      onError: (error: any) => {
        const apiErrorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to create account. Please try again.';
        toast.error(apiErrorMessage);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          {...formRegister('name')}
          className="mt-1.5 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-neutral-400 transition-colors"
          disabled={isPending}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@email.com"
          {...formRegister('email')}
          className="mt-1.5 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-neutral-400 transition-colors"
          disabled={isPending}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="********"
          {...formRegister('password')}
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
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
