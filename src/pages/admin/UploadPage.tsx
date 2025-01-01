import React from 'react';
import { DocumentUpload } from '../../components/documents/DocumentUpload';

export const AdminUploadPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Upload Documents</h1>
      <div className="max-w-3xl">
        <DocumentUpload />
      </div>
    </div>
  );
};