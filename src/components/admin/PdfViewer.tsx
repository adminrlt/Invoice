import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { DocumentInfo } from './DocumentInfo';
import { debugStorageAccess } from '../../utils/storageDebug';
import { supabase } from '../../lib/supabase';

interface PdfViewerProps {
  url: string;
  documentId: string;
  documentInfo?: any;
  onClose: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ 
  url, 
  documentId,
  documentInfo, 
  onClose 
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Debug storage access
        const debug = await debugStorageAccess(url);
        console.log('Storage access debug results:', debug);

        // Try signed URL first
        const { data: signedData, error: signedError } = await supabase.storage
          .from('documents')
          .createSignedUrl(url, 3600);

        if (signedError) {
          console.warn('Failed to get signed URL:', signedError);
          
          // Fallback to public URL
          const { data: { publicUrl }, error: publicError } = await supabase.storage
            .from('documents')
            .getPublicUrl(url);

          if (publicError) throw publicError;
          setPdfUrl(publicUrl);
        } else {
          setPdfUrl(signedData.signedUrl);
        }
      } catch (err: any) {
        console.error('PDF viewer initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeViewer();
  }, [url]);

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Document Preview</h3>
          <div className="flex items-center space-x-2">
            {pdfUrl && (
              <>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Download PDF"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Document Info */}
        {documentInfo && (
          <div className="p-4 border-b">
            <DocumentInfo info={documentInfo} />
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 p-4">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-center">{error}</p>
            </div>
          )}

          {pdfUrl && !error && (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              className="w-full h-full rounded-b-lg"
              title="PDF Preview"
              onError={(e) => {
                console.error('PDF iframe error:', e);
                setError('Failed to load PDF viewer');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};