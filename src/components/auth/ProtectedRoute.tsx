import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRole?: 'admin' | 'moderator' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requiredRole
}) => {
  const { user, loading, isAdmin } = useAuth();
  const needsAdmin = requireAdmin || requiredRole === 'admin';
  const location = useLocation();

  // Determine if this is a user dashboard route (not admin)
  const isUserRoute = location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/admin');
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to appropriate login page
  if (!user) {
    const loginPath = needsAdmin || isAdminRoute ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // CRITICAL: Admin trying to access user dashboard - redirect to admin dashboard
  if (isAdmin && isUserRoute) {
    console.log('Admin detected on user route, redirecting to admin dashboard');
    return <Navigate to="/admin" replace />;
  }

  // CRITICAL: Regular user trying to access admin routes - redirect to user dashboard
  if (!isAdmin && (needsAdmin || isAdminRoute)) {
    console.log('Non-admin user detected on admin route, redirecting to user dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
