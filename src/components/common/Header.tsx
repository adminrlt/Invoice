import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/api/auth';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          {isAuthenticated && (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-gray-900 focus:outline-none transition"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};