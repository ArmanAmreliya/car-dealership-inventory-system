import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { paths } from '../../routes/paths';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role !== 'admin') {
    return <Navigate to={paths.dashboard} replace />;
  }

  return <>{children}</>;
}
