import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset instructions sent to your email!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    isSubmitting,
    handleSubmit,
    setEmail
  };
};