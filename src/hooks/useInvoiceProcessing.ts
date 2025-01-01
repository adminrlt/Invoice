import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { extractInvoiceData } from '../lib/api/invoice';
import toast from 'react-hot-toast';

export const useInvoiceProcessing = () => {
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());

  const processInvoice = async (documentId: string, fileUrl: string, pageNumber: number = 1) => {
    if (processingFiles.has(fileUrl)) {
      toast.error('This file is already being processed');
      return false;
    }

    setProcessingFiles(prev => new Set([...prev, fileUrl]));
    let toastId: string | undefined;

    try {
      toastId = toast.loading('Processing invoice...');

      // Get public URL for processing
      const { data: { publicUrl }, error: urlError } = await supabase.storage
        .from('documents')
        .getPublicUrl(fileUrl);

      if (urlError) throw urlError;

      // Extract invoice data
      const extractedData = await extractInvoiceData(publicUrl);

      // Store invoice data
      const { error: dbError } = await supabase
        .from('invoice_data')
        .upsert({
          document_id: documentId,
          page_number: pageNumber,
          vendor_name: extractedData.vendorName,
          invoice_number: extractedData.invoiceNumber,
          invoice_date: extractedData.invoiceDate,
          total_amount: extractedData.totalAmount,
          status: 'completed',
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      toast.success('Invoice processed successfully', { id: toastId });
      return true;
    } catch (error: any) {
      console.error('Invoice processing error:', error);
      
      // Store error state
      await supabase
        .from('invoice_data')
        .upsert({
          document_id: documentId,
          page_number: pageNumber,
          status: 'error',
          error_message: error.message,
          updated_at: new Date().toISOString()
        });

      toast.error(error.message || 'Failed to process invoice', { id: toastId });
      return false;
    } finally {
      setProcessingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileUrl);
        return next;
      });
    }
  };

  const isProcessing = (fileUrl: string) => processingFiles.has(fileUrl);

  return {
    processInvoice,
    isProcessing
  };
};