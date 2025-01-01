import { supabase } from '../../supabase';

export const updateDocumentStatus = async (
  documentId: string,
  status: 'pending' | 'processing' | 'completed' | 'error',
  errorDetails?: { message: string; timestamp: string }
) => {
  try {
    const { error } = await supabase
      .from('document_info')
      .upsert({
        document_id: documentId,
        processing_status: status,
        error_details: errorDetails,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
};