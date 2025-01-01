import { supabase } from '../lib/supabase';

export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    
    // Try a simple query to check connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return {
        isConnected: false,
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details
        }
      };
    }

    console.log('Supabase connection successful');
    return {
      isConnected: true,
      url: supabase.supabaseUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Connection check failed:', error);
    return {
      isConnected: false,
      error: error.message,
      details: error
    };
  }
};

export const monitorConnection = (
  interval = 30000,
  onStatusChange?: (status: boolean) => void
) => {
  let lastStatus = true;
  
  const check = async () => {
    const { isConnected } = await checkSupabaseConnection();
    
    if (isConnected !== lastStatus) {
      lastStatus = isConnected;
      onStatusChange?.(isConnected);
    }
  };

  // Initial check
  check();
  
  // Set up periodic monitoring
  const timer = setInterval(check, interval);
  
  // Return cleanup function
  return () => clearInterval(timer);
};