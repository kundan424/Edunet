import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import type { Role } from '../features/auth/types';
import { LoadingState } from '../components/ui/States';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function RoleRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'INSTRUCTOR':
        return <Navigate to="/instructor" replace />;
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'STUDENT':
      default:
        return <Navigate to="/learn" replace />;
    }
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  if (isAuthenticated && user) {
    switch (user.role) {
      case 'INSTRUCTOR':
        return <Navigate to="/instructor" replace />;
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'STUDENT':
      default:
        return <Navigate to="/learn" replace />;
    }
  }

  return <Outlet />;
}
