/**
 * Login Page
 *
 * Public route for user authentication.
 * Displays login form and handles post-login navigation.
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';

interface LocationState {
  from?: {
    pathname: string;
  };
}

/**
 * LoginPage Component
 *
 * Provides authentication interface for users.
 * Redirects to dashboard or previous location after successful login.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? '/dashboard';

  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            DealerFlow
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <LoginForm onSuccess={handleLoginSuccess} />

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
