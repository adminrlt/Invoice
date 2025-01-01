import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthFormHeader } from './AuthFormHeader';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface AuthFormProps {
  isAdmin?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isAdmin = false }) => {
  const { mode, setMode } = useAuth();

  return (
    <div className="max-w-md w-full space-y-8">
      <AuthFormHeader mode={mode} isAdmin={isAdmin} />
      {mode === 'login' && <LoginForm onModeChange={setMode} isAdmin={isAdmin} />}
      {mode === 'signup' && <SignupForm onModeChange={setMode} />}
      {mode === 'forgot' && <ForgotPasswordForm onModeChange={setMode} />}
    </div>
  );
};