import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { AuthFormField } from './AuthFormField';

export const AdminLoginForm = () => {
  const { login, isLoading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

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
          disabled={isLoading}
        />
        <AuthFormField
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        ) : (
          'Sign in as Admin'
        )}
      </button>
    </form>
  );
};