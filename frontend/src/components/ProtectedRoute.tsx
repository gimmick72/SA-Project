import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'admin';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/auth/login' 
}) => {
  const location = useLocation();
  
  // Check JWT token authentication
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  const isAuthenticated = !!token && !!user;
  const userRole = user ? JSON.parse(user).role : 'admin';

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user's actual role
    const defaultRedirect = userRole === 'admin' ? '/admin' : '/home';
    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
