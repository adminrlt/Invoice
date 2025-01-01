import { supabase } from '../../lib/supabase';

export interface PdfInfo {
  pageCount?: number;
  error?: string;
}

export const getPdfInfo = async (url: string): Promise<PdfInfo> => {
  try {
    // Get document info from the database first
    const docId = url.split('/').pop()?.split('.')[0];
    if (docId) {
      const { data: docInfo } = await supabase
        .from('document_info')
        .select('page_count')
        .eq('document_id', docId)
        .single();

      if (docInfo?.page_count) {
        return { pageCount: docInfo.page_count };
      }
    }

    // If no info in database, make a HEAD request to get content length
    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('documents')
      .getPublicUrl(url);

    if (urlError) throw urlError;

    const response = await fetch(publicUrl, { method: 'HEAD' });
    if (!response.ok) throw new Error('Failed to fetch document info');

    // Store the page count in the database for future use
    const pageCount = Math.max(1, Math.ceil(parseInt(response.headers.get('content-length') || '0') / (100 * 1024)));
    
    if (docId) {
      await supabase
        .from('document_info')
        .upsert({
          document_id: docId,
          page_count: pageCount,
          updated_at: new Date().toISOString()
        });
    }

    return { pageCount };
  } catch (error: any) {
    console.error('Error getting PDF info:', error);
    return { error: error.message };
  }
};