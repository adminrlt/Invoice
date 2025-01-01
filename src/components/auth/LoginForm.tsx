import React from 'react';
import { Mail, Lock } from 'lucide-react';
import { useLoginForm } from '../../hooks/useLoginForm';
import { AuthFormField } from './AuthFormField';
import { AuthFormFooter } from './AuthFormFooter';
import type { AuthMode } from '../../types';

interface LoginFormProps {
  onModeChange: (mode: AuthMode) => void;
  isAdmin?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onModeChange, isAdmin = false }) => {
  const { email, password, isSubmitting, handleSubmit, setEmail, setPassword } = useLoginForm(isAdmin);

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <AuthFormField
          id="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
        />
        <AuthFormField
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
        />
      </div>

      <AuthFormFooter
        mode="login"
        isSubmitting={isSubmitting}
        onModeChange={onModeChange}
        isAdmin={isAdmin}
      />
    </form>
  );
};