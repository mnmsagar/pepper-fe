import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, currentUserRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg-primary">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !currentUserRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    const userRoleType = currentUserRole.role;
    
    // Map roles for routing
    const roleRouteMap: { [key: string]: string } = {
      'admin': 'admin',
      'admin_employee': 'admin',
      'partner': 'partner',
      'partner_employee': 'partner',
      'member': 'member'
    };

    const expectedRoute = roleRouteMap[userRoleType];
    
    if (expectedRoute !== requiredRole) {
      return <Navigate to={`/${expectedRoute}`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;