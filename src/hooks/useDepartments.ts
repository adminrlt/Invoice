import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Department } from '../types';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (err: any) {
      const message = err.message || 'Failed to fetch departments';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const addDepartment = async (name: string, description: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .insert({ name, description });

      if (error) throw error;
      toast.success('Department added successfully');
      fetchDepartments();
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const updateDepartment = async (id: string, name: string, description: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .update({ name, description })
        .eq('id', id);

      if (error) throw error;
      toast.success('Department updated successfully');
      fetchDepartments();
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return { 
    departments, 
    isLoading, 
    error,
    addDepartment,
    updateDepartment
  };
};