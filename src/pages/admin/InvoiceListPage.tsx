import React from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DocumentList } from '../../components/admin/DocumentList';

export const InvoiceListPage = () => {
  const { documents, isLoading, error } = useDocuments();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Uploaded Documents</h1>
      <DocumentList documents={documents} />
    </div>
  );
};