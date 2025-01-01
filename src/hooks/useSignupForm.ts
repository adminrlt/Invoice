import { useState } from 'react';
import { signUp } from '../lib/api/auth/signUp';
import toast from 'react-hot-toast';
import { validatePassword } from '../utils/validation';

export const useSignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePassword(password);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    setIsSubmitting(true);

    try {
      await signUp(email, password, name);
      toast.success('Account created successfully! You can now sign in.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    email,
    password,
    isSubmitting,
    handleSubmit,
    setName,
    setEmail,
    setPassword
  };
};