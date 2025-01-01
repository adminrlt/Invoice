import React from 'react';
import type { AuthMode } from '../../types';

interface AuthFormFooterProps {
  mode: AuthMode;
  isSubmitting: boolean;
  onModeChange: (mode: AuthMode) => void;
  isAdmin?: boolean;
}

export const AuthFormFooter: React.FC<AuthFormFooterProps> = ({
  mode,
  isSubmitting,
  onModeChange,
  isAdmin = false
}) => (
  <div>
    <button
      type="submit"
      disabled={isSubmitting}
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {isSubmitting ? (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
      ) : (
        mode === 'login' ? 'Sign in' :
        mode === 'signup' ? 'Sign up' :
        'Reset password'
      )}
    </button>

    {!isAdmin && (
      <div className="mt-4 text-center text-sm">
        {mode === 'login' ? (
          <>
            <button
              type="button"
              onClick={() => onModeChange('forgot')}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </button>
            <span className="mx-2">·</span>
            <button
              type="button"
              onClick={() => onModeChange('signup')}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Create new account
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Back to sign in
          </button>
        )}
      </div>
    )}
  </div>
);