import React from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useSignupForm } from '../../hooks/useSignupForm';
import { AuthFormField } from './AuthFormField';
import { AuthFormFooter } from './AuthFormFooter';
import type { AuthMode } from '../../types';

interface SignupFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onModeChange }) => {
  const { name, email, password, isSubmitting, handleSubmit, setName, setEmail, setPassword } = useSignupForm();

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <AuthFormField
          id="name"
          type="text"
          placeholder="Full name"
          value={name}
          onChange={setName}
          icon={<User className="h-5 w-5 text-gray-400" />}
        />
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
        mode="signup"
        isSubmitting={isSubmitting}
        onModeChange={onModeChange}
      />
    </form>
  );
};