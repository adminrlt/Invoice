import { useState, useEffect } from 'react';
import { checkSupabaseConnection, monitorConnection } from '../utils/supabaseHealth';
import toast from 'react-hot-toast';

export const useSupabaseStatus = (showToasts = true) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastCheck, setLastCheck] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const status = await checkSupabaseConnection();
      setIsConnected(status.isConnected);
      setLastCheck(new Date().toISOString());
      setError(status.error || null);

      if (showToasts) {
        if (!status.isConnected) {
          toast.error('Lost connection to database');
        } else if (error) { // If previously had error
          toast.success('Connection restored');
        }
      }
    };

    // Initial check
    checkConnection();

    // Set up monitoring
    const cleanup = monitorConnection(30000, (status) => {
      setIsConnected(status);
      setLastCheck(new Date().toISOString());
      
      if (showToasts) {
        if (!status) {
          toast.error('Lost connection to database');
        } else {
          toast.success('Connection restored');
        }
      }
    });

    return cleanup;
  }, [showToasts, error]);

  return {
    isConnected,
    lastCheck,
    error,
    checkNow: checkSupabaseConnection
  };
};