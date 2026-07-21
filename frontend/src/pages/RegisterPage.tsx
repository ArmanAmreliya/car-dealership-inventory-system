/**
 * Register Page
 *
 * Public route for user registration.
 * Displays registration form and handles post-registration navigation.
 */

import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../features/auth/components/RegisterForm';

/**
 * RegisterPage Component
 *
 * Provides registration interface for new users.
 * Redirects to dashboard after successful registration.
 */
export function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/dashboard', { replace: true });
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
            Create your account
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm onSuccess={handleRegisterSuccess} />

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
