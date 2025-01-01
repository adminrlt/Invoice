import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminSignIn } from '../lib/api/adminAuth';
import { validateCredentials } from '../utils/validation';
import toast from 'react-hot-toast';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const validationError = validateCredentials(email, password);
    if (validationError) {
      toast.error(validationError);
      return false;
    }

    setIsLoading(true);

    try {
      const { user } = await adminSignIn(email, password);
      
      if (!user) {
        throw new Error('Authentication failed');
      }

      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      const from = location.state?.from?.pathname || '/admin/departments';
      navigate(from, { replace: true });
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Invalid admin credentials');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading
  };
};