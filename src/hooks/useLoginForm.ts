import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signIn } from '../lib/api/auth';
import { validateCredentials } from '../utils/validation';
import toast from 'react-hot-toast';

export const useLoginForm = (isAdmin: boolean = false) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateCredentials(email, password);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const { user } = await signIn(email, password);
      
      if (!user) {
        throw new Error('Authentication failed');
      }

      if (isAdmin && user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      setEmail('');
      setPassword('');

      // Changed default redirect for non-admin users to root path
      const from = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/');
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    isSubmitting,
    handleSubmit,
    setEmail,
    setPassword
  };
};