import React from 'react';
import { DocumentUploadForm } from './DocumentUploadForm';
import { FileList } from './FileList';
import { useDocumentUpload } from '../../hooks/useDocumentUpload';

export const DocumentUpload = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    files,
    setFiles,
    isUploading,
    handleSubmit,
    removeFile
  } = useDocumentUpload();

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Submit Documents</h2>
      <DocumentUploadForm
        name={name}
        email={email}
        files={files}
        isUploading={isUploading}
        onNameChange={setName}
        onEmailChange={setEmail}
        onFilesChange={setFiles}
        onSubmit={handleSubmit}
      />
      {files.length > 0 && (
        <FileList files={files} onRemove={removeFile} />
      )}
    </div>
  );
};