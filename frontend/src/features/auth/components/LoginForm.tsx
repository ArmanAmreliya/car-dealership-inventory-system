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
import { Zap } from 'lucide-react';

const DEMO_EMAIL = 'admin@dealerflow.com';
const DEMO_PASSWORD = 'admin123';

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const currentEmail = watch('email');
  const isDemoFilled = currentEmail === DEMO_EMAIL;

  /** One-click fill of demo credentials */
  const fillDemoCredentials = () => {
    setValue('email', DEMO_EMAIL, { shouldValidate: true });
    setValue('password', DEMO_PASSWORD, { shouldValidate: true });
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* ── Demo credentials banner ──────────────────────────────────── */}
      <button
        type="button"
        onClick={fillDemoCredentials}
        disabled={isPending}
        className={`w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 disabled:opacity-50 ${
          isDemoFilled
            ? 'border-teal-400/60 bg-teal-500/8 ring-1 ring-teal-400/30'
            : 'border-slate-200 bg-slate-50 hover:border-teal-400/50 hover:bg-teal-500/5'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-600">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Demo Account
            </p>
            <p className="text-xs font-semibold text-slate-700 truncate">
              {DEMO_EMAIL}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
            isDemoFilled
              ? 'bg-teal-500 text-white'
              : 'bg-slate-200 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-700'
          }`}
        >
          {isDemoFilled ? '✓ Filled' : 'Use Demo'}
        </span>
      </button>

      {/* ── Email ────────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@email.com"
          {...register('email')}
          className="mt-1.5 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm placeholder-neutral-400 transition-colors"
          disabled={isPending}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* ── Password ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <a href="#forgot" className="text-xs text-teal-600 hover:text-teal-700 hover:underline">
            Forgot Password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className="mt-1.5 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm placeholder-neutral-400 transition-colors"
          disabled={isPending}
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* ── Submit ───────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#00C49F] hover:bg-[#00B08F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isPending ? 'Logging in…' : 'Log In'}
      </button>
    </form>
  );
}
