import React from 'react';
import { Mail } from 'lucide-react';
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm';
import { AuthFormField } from './AuthFormField';
import { AuthFormFooter } from './AuthFormFooter';
import type { AuthMode } from '../../types';

interface ForgotPasswordFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onModeChange }) => {
  const { email, isSubmitting, handleSubmit, setEmail } = useForgotPasswordForm();

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm">
        <AuthFormField
          id="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
        />
      </div>

      <AuthFormFooter
        mode="forgot"
        isSubmitting={isSubmitting}
        onModeChange={onModeChange}
      />
    </form>
  );
};