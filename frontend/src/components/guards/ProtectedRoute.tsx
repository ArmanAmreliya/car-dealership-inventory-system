/**
 * Protected Route Component
 *
 * Route wrapper that enforces authentication before rendering child routes.
 * Redirects unauthenticated users to login page and preserves the originally
 * requested location for post-login redirect.
 *
 * Used with React Router to protect authenticated feature routes.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * @param children - The protected route element(s)
 * @returns Protected element if authenticated, redirect to login otherwise
 *
 * @example
 * ```tsx
 * <Routes>
 *   <Route path="/login" element={<LoginPage />} />
 *   <Route
 *     path="/dashboard"
 *     element={
 *       <ProtectedRoute>
 *         <DashboardPage />
 *       </ProtectedRoute>
 *     }
 *   />
 * </Routes>
 * ```
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while restoring session from localStorage
  if (isLoading) {
    return null;
  }

  // Redirect to login if not authenticated, preserving the location they tried to access
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
