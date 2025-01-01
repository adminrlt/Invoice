import React from 'react';
import { AuthForm } from '../components/auth/AuthForm';

export const AuthPage = () => {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm />
    </div>
  );
};