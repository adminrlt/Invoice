import { supabase } from '../../supabase';
import { analyzeDocument } from '../azure/formRecognizer';
import { PROCESSING_CONFIG } from '../azure/config';

export const processDocumentWithAzure = async (documentId: string, fileUrl: string) => {
  try {
    // Update status to processing
    await updateProcessingStatus(documentId, 'processing');

    // Get public URL for Azure
    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('documents')
      .getPublicUrl(fileUrl);

    if (urlError) throw urlError;

    // Process with retries
    let result;
    let attempts = 0;

    while (attempts < PROCESSING_CONFIG.maxRetries) {
      try {
        result = await analyzeDocument(publicUrl);
        break;
      } catch (error) {
        attempts++;
        if (attempts === PROCESSING_CONFIG.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, PROCESSING_CONFIG.retryDelay * attempts));
      }
    }

    if (!result) {
      throw new Error('Failed to process document after retries');
    }

    // Store results
    await storeProcessingResults(documentId, result);
    await updateProcessingStatus(documentId, 'completed');

    return { success: true, data: result };
  } catch (error: any) {
    console.error('Document processing error:', error);
    await updateProcessingStatus(documentId, 'error', error.message);
    return { success: false, error: error.message };
  }
};

const updateProcessingStatus = async (
  documentId: string, 
  status: 'processing' | 'completed' | 'error',
  errorMessage?: string
) => {
  const { error } = await supabase
    .from('document_info')
    .upsert({
      document_id: documentId,
      processing_status: status,
      error_message: errorMessage,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
};

const storeProcessingResults = async (documentId: string, results: any) => {
  const { error } = await supabase
    .from('document_info')
    .upsert({
      document_id: documentId,
      vendor_name: results.vendorName,
      invoice_number: results.invoiceNumber,
      invoice_date: results.invoiceDate,
      total_amount: results.totalAmount,
      confidence_score: results.confidence,
      raw_data: results.fields,
      processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
};