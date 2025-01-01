import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log('AdminRoute - Auth state:', { user, isLoading });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'admin') {
    console.log('Access denied - redirecting to admin auth');
    return <Navigate to="/admin/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};