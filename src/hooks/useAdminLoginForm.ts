import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminSignIn } from '../lib/api/adminAuth';
import { validateCredentials } from '../utils/validation';
import toast from 'react-hot-toast';

export const useAdminLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate credentials before submission
    const validationError = validateCredentials(email, password);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await adminSignIn(email, password);
      
      // Clear form on success
      setEmail('');
      setPassword('');

      // Navigate to admin dashboard or requested page
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast.error(error.message);
      setPassword(''); // Clear password on error for security
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