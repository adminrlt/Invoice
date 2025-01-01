import { useState } from 'react';
import { processDocument } from '../lib/api/document/process';
import { getDocumentInfo } from '../lib/api/documents';
import toast from 'react-hot-toast';

export const useDocumentProcessing = () => {
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());

  const handleProcessDocument = async (documentId: string, fileUrl: string) => {
    if (processingFiles.has(fileUrl)) {
      toast.error('This document is already being processed');
      return false;
    }

    setProcessingFiles(prev => new Set([...prev, fileUrl]));
    const toastId = toast.loading('Processing document...');

    try {
      // First check if document info already exists
      const existingInfo = await getDocumentInfo(documentId);
      if (existingInfo?.processing_status === 'completed') {
        toast.success('Document already processed', { id: toastId });
        return true;
      }

      const result = await processDocument(documentId, fileUrl);
      if (result.success) {
        toast.success('Document processed successfully', { id: toastId });
        return true;
      } else {
        toast.error(result.error || 'Failed to process document', { id: toastId });
        return false;
      }
    } catch (error: any) {
      console.error('Document processing error:', error);
      toast.error(error.message || 'Failed to process document', { id: toastId });
      return false;
    } finally {
      setProcessingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileUrl);
        return next;
      });
    }
  };

  return {
    processDocument: handleProcessDocument,
    isProcessing: (fileUrl: string) => processingFiles.has(fileUrl)
  };
};