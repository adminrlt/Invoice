import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLoginForm } from '../components/auth/AdminLoginForm';
import { AuthFormHeader } from '../components/auth/AuthFormHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminAuthPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/departments" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthFormHeader mode="login" isAdmin={true} />
        <AdminLoginForm />
      </div>
    </div>
  );
};