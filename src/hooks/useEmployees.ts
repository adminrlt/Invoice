import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Employee } from '../types';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select(`
            *,
            department:departments(name)
          `)
          .order('name');

        if (error) throw error;
        setEmployees(data || []);
      } catch (err: any) {
        const message = err.message || 'Failed to fetch employees';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, isLoading, error };
};