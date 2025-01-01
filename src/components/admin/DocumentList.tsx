import React, { useState, useEffect } from 'react';
import { FileText, Eye, RefreshCw, ExternalLink, Book } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { getFileNameFromUrl } from '../../utils/file';
import { useDocumentProcessing } from '../../hooks/useDocumentProcessing';
import { PdfViewer } from '../pdf/PdfViewer';
import { getDocumentPageCount } from '../../utils/pdf/pageCount';
import type { Document } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface DocumentListProps {
  documents: Document[];
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({});
  const { isProcessing, processDocument } = useDocumentProcessing();

  useEffect(() => {
    const fetchPageCounts = async () => {
      const counts: Record<string, number> = {};
      
      for (const doc of documents) {
        for (const url of doc.file_urls) {
          try {
            counts[url] = await getDocumentPageCount(doc.id, url);
          } catch (error) {
            console.error(`Error fetching page count for ${url}:`, error);
            counts[url] = 1; // Default to 1 page on error
          }
        }
      }
      
      setPageCounts(counts);
    };

    fetchPageCounts();
  }, [documents]);

  const handlePreview = async (path: string) => {
    try {
      const { data: { publicUrl }, error: urlError } = await supabase.storage
        .from('documents')
        .getPublicUrl(path);
      
      if (urlError) throw urlError;
      setPreviewUrl(publicUrl);
    } catch (error: any) {
      console.error('Preview error:', error);
      toast.error('Failed to preview file: ' + error.message);
    }
  };

  const handleOpenInNewTab = async (path: string) => {
    try {
      const { data: { publicUrl }, error: urlError } = await supabase.storage
        .from('documents')
        .getPublicUrl(path);
      
      if (urlError) throw urlError;
      window.open(publicUrl, '_blank');
    } catch (error: any) {
      console.error('Open in new tab error:', error);
      toast.error('Failed to open file: ' + error.message);
    }
  };

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.name}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">{formatDate(doc.created_at)}</span>
                        <span className="mx-2">•</span>
                        <span className="truncate">{doc.file_urls.length} file(s)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {doc.file_urls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {getFileNameFromUrl(url)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Book className="h-4 w-4 mr-1" />
                        <span>{pageCounts[url] || 1} pages</span>
                      </div>
                      <button
                        onClick={() => handlePreview(url)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Preview PDF"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenInNewTab(url)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => processDocument(doc.id, url)}
                        disabled={isProcessing(url)}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Process document"
                      >
                        <RefreshCw 
                          className={`h-4 w-4 ${isProcessing(url) ? 'animate-spin' : ''}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {previewUrl && (
        <PdfViewer
          url={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </div>
  );
};