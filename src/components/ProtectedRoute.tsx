import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '@/utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component that handles authentication-based routing
 * 
 * @param children - The component to render if authentication check passes
 * @param requireAuth - If true, redirects to login if not authenticated
 *                      If false, redirects to quiz if already authenticated
 * @returns The children or a redirect based on authentication status
 */
const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const location = useLocation();
  const authenticated = isLoggedIn();

  useEffect(() => {
    // This effect is just for debugging purposes
    console.log('ProtectedRoute: authenticated =', authenticated);
    console.log('ProtectedRoute: requireAuth =', requireAuth);
  }, [authenticated, requireAuth]);

  // If requireAuth is true and user is not authenticated, redirect to login
  if (requireAuth && !authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If requireAuth is false and user is authenticated, redirect to dashboard
  // This is for routes like /login that should redirect if already logged in
  if (!requireAuth && authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authentication check passes, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
