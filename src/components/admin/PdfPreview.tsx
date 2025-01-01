import React from 'react';
import { X } from 'lucide-react';
import { DocumentInfo } from './DocumentInfo';

interface PdfPreviewProps {
  url: string;
  documentInfo?: any;
  onClose: () => void;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ url, documentInfo, onClose }) => {
  console.log('PdfPreview - Rendering with URL:', url);
  console.log('PdfPreview - Document Info:', documentInfo);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-xl flex flex-col">
        {/* Close button */}
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Document Info Panel */}
        {documentInfo && (
          <div className="p-4 border-b">
            <DocumentInfo info={documentInfo} />
          </div>
        )}

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100">
          <iframe
            src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full rounded-b-lg"
            title="PDF Preview"
            onError={(e) => {
              console.error('PDF iframe loading error:', e);
            }}
            onLoad={() => {
              console.log('PDF iframe loaded successfully');
            }}
          />
        </div>
      </div>
    </div>
  );
};