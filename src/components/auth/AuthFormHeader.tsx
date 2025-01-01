import React from 'react';
import { Logo } from '../common/Logo';
import type { AuthMode } from '../../types';

interface AuthFormHeaderProps {
  mode: AuthMode;
  isAdmin?: boolean;
}

export const AuthFormHeader: React.FC<AuthFormHeaderProps> = ({ mode, isAdmin = false }) => {
  const getHeaderText = () => {
    if (mode === 'login') {
      return isAdmin ? 'Sign in to your admin account' : 'Sign in to your account';
    }
    if (mode === 'signup') return 'Create new account';
    return 'Reset your password';
  };

  return (
    <div className="text-center">
      <Logo />
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        {getHeaderText()}
      </h2>
    </div>
  );
};