import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNeedsOnboarding } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRole?: 'admin' | 'moderator' | 'user';
  skipOnboardingCheck?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requiredRole,
  skipOnboardingCheck = false
}) => {
  const { user, loading, isAdmin } = useAuth();
  const needsAdmin = requireAdmin || requiredRole === 'admin';
  const location = useLocation();
  
  // Check if user needs onboarding (only for non-admin users)
  const { data: needsOnboarding, isLoading: onboardingLoading } = useNeedsOnboarding(
    !isAdmin && !skipOnboardingCheck && user ? user.id : ''
  );

  // Determine if this is a user dashboard route (not admin)
  const isUserRoute = location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/admin');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOnboardingRoute = location.pathname === '/onboarding';

  if (loading || (!isAdmin && !skipOnboardingCheck && !isOnboardingRoute && onboardingLoading)) {
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
    return <Navigate to="/admin" replace />;
  }

  // CRITICAL: Regular user trying to access admin routes - redirect to user dashboard
  if (!isAdmin && (needsAdmin || isAdminRoute)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Regular user needs onboarding and not on onboarding page
  if (!isAdmin && !isOnboardingRoute && needsOnboarding && !skipOnboardingCheck) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
