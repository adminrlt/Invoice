import { supabase } from '../lib/supabase';

export const getSignedUrl = async (path: string): Promise<string> => {
  try {
    console.log('Getting signed URL for path:', path);
    
    // First try to get a signed URL
    const { data: { signedUrl }, error: signedError } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (signedError) {
      console.warn('Failed to get signed URL:', signedError);
      
      // Fallback to public URL
      const { data: { publicUrl }, error: publicError } = await supabase.storage
        .from('documents')
        .getPublicUrl(path);

      if (publicError) throw publicError;
      
      console.log('Using public URL as fallback');
      return publicUrl;
    }

    console.log('Successfully generated signed URL');
    return signedUrl;
  } catch (error) {
    console.error('Storage error:', error);
    throw new Error('Failed to generate URL for document');
  }
};

export const validateStorageAccess = async (path: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(path);

    if (error) {
      console.error('Storage access validation error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Storage validation error:', error);
    return false;
  }
};