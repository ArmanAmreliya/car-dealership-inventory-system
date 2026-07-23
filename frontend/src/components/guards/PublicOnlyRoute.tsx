/**
 * PublicOnlyRoute Guard
 *
 * Redirects already-authenticated users away from public-only pages
 * (login, register) to the dashboard. Unauthenticated users pass through.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { paths } from '../../routes/paths';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to={paths.dashboard} replace />;
  }

  return <>{children}</>;
}
