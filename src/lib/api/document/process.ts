import { supabase } from '../../supabase';
import { extractDocumentInfo } from '../azure';
import { logProcessing } from '../logging';
import { parseDate } from '../../../utils/date';
import type { ProcessingResult } from '../../../types/document';

export const processDocument = async (documentId: string, fileUrl: string): Promise<ProcessingResult> => {
  const startTime = Date.now();
  
  try {
    if (!documentId) {
      throw new Error('Invalid document ID');
    }

    // Log initial processing status
    await logProcessing({
      documentId,
      status: 'processing',
      step: 'Starting document processing',
      details: { fileUrl }
    });

    // Get public URL for processing
    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('documents')
      .getPublicUrl(fileUrl);

    if (urlError) {
      throw new Error('Failed to get document URL');
    }

    // Extract document info
    const extractedInfo = await extractDocumentInfo(publicUrl);
    
    if (!extractedInfo) {
      throw new Error('Failed to extract document information');
    }

    // Parse and validate date
    const parsedDate = extractedInfo.invoiceDate ? parseDate(extractedInfo.invoiceDate) : null;
    if (extractedInfo.invoiceDate && !parsedDate) {
      throw new Error(`Invalid date format: ${extractedInfo.invoiceDate}`);
    }

    // Store document info using upsert with ON CONFLICT handling
    const { error: dbError } = await supabase
      .from('document_info')
      .upsert({
        document_id: documentId,
        vendor_name: extractedInfo.vendorName,
        invoice_number: extractedInfo.invoiceNumber,
        invoice_date: parsedDate,
        total_amount: extractedInfo.totalAmount,
        processing_status: 'completed',
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        file_url: fileUrl
      }, {
        onConflict: 'document_id',
        ignoreDuplicates: false
      });

    if (dbError) {
      throw new Error(`Failed to save document information: ${dbError.message}`);
    }

    // Log successful completion
    await logProcessing({
      documentId,
      status: 'completed',
      step: 'Document processing completed',
      details: {
        processingTime: Date.now() - startTime,
        documentInfo: {
          ...extractedInfo,
          invoice_date: parsedDate
        }
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Document processing error:', error);
    
    // Log error details
    await logProcessing({
      documentId,
      status: 'error',
      step: 'Document processing failed',
      details: {
        error: error.message,
        processingTime: Date.now() - startTime
      },
      errorMessage: error.message
    });
    
    // Update document status
    await supabase
      .from('document_info')
      .upsert({
        document_id: documentId,
        processing_status: 'error',
        error_message: error.message,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'document_id',
        ignoreDuplicates: false
      });

    return {
      success: false,
      error: error.message || 'Failed to process document'
    };
  }
};