import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useProcessingLogs = (documentId: string) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      // Only fetch logs if we have a valid document ID
      if (!documentId) {
        setLogs([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('document_processing_logs')
          .select('*')
          .eq('document_id', documentId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLogs(data || []);
      } catch (err: any) {
        const message = err.message || 'Failed to fetch processing logs';
        setError(message);
        console.error('Error fetching logs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();

    // Subscribe to real-time updates if we have a valid document ID
    let subscription;
    if (documentId) {
      subscription = supabase
        .channel('document_processing_logs')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'document_processing_logs',
          filter: `document_id=eq.${documentId}`
        }, (payload) => {
          setLogs(current => [payload.new, ...current]);
        })
        .subscribe();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [documentId]);

  return { logs, isLoading, error };
};