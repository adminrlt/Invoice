import { supabase } from '../lib/supabase';

export const debugStorageAccess = async (path: string) => {
  console.log('Debugging storage access for path:', path);
  
  try {
    // 1. Check bucket existence
    const { data: bucket, error: bucketError } = await supabase.storage
      .getBucket('documents');
    
    console.log('Bucket check:', { bucket, error: bucketError });

    // 2. Try public URL
    const { data: publicUrlData, error: publicError } = await supabase.storage
      .from('documents')
      .getPublicUrl(path);
    
    console.log('Public URL check:', { 
      url: publicUrlData?.publicUrl, 
      error: publicError 
    });

    // 3. Try signed URL
    const { data: signedData, error: signedError } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 3600);
    
    console.log('Signed URL check:', { 
      url: signedData?.signedUrl, 
      error: signedError 
    });

    // 4. Check download access
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(path);
    
    console.log('Download access check:', { 
      hasData: !!downloadData, 
      error: downloadError 
    });

    return {
      bucket: !bucketError,
      publicUrl: !publicError,
      signedUrl: !signedError,
      download: !downloadError,
      urls: {
        public: publicUrlData?.publicUrl,
        signed: signedData?.signedUrl
      }
    };
  } catch (error) {
    console.error('Storage debug error:', error);
    throw error;
  }
};