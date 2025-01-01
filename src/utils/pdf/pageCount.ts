import { supabase } from '../../lib/supabase';

export const getDocumentPageCount = async (documentId: string, fileUrl: string): Promise<number> => {
  try {
    // First try to get existing page count
    const { data: docInfo, error } = await supabase
      .from('document_info')
      .select('page_count')
      .eq('document_id', documentId)
      .maybeSingle();

    if (!error && docInfo?.page_count) {
      return docInfo.page_count;
    }

    // If no stored count, estimate from file size
    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('documents')
      .getPublicUrl(fileUrl);

    if (urlError) throw urlError;

    const response = await fetch(publicUrl, { method: 'HEAD' });
    if (!response.ok) throw new Error('Failed to fetch document info');

    const contentLength = parseInt(response.headers.get('content-length') || '0');
    const estimatedPages = Math.max(1, Math.ceil(contentLength / (100 * 1024))); // Rough estimate

    // Store the page count using upsert
    await supabase
      .from('document_info')
      .upsert({
        document_id: documentId,
        page_count: estimatedPages,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'document_id',
        ignoreDuplicates: false
      });

    return estimatedPages;
  } catch (error) {
    console.error('Error getting page count:', error);
    return 1; // Default to 1 page on error
  }
};