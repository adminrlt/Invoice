import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Employee } from '../types';

export const useEmployeeForm = (employee?: Employee) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setDepartmentId(employee.department_id);
    }
  }, [employee]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const data = { name, email, department_id: departmentId };
      
      const { error } = employee
        ? await supabase
            .from('employees')
            .update(data)
            .eq('id', employee.id)
        : await supabase
            .from('employees')
            .insert(data);

      if (error) throw error;
      
      toast.success(`Employee ${employee ? 'updated' : 'added'} successfully`);
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    departmentId,
    setDepartmentId,
    isSubmitting,
    handleSubmit
  };
};