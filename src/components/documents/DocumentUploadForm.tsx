import React from 'react';
import { Upload } from 'lucide-react';

interface DocumentUploadFormProps {
  name: string;
  email: string;
  files: File[];
  isUploading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  name,
  email,
  files,
  isUploading,
  onNameChange,
  onEmailChange,
  onFilesChange,
  onSubmit
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onFilesChange(selectedFiles);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Documents
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="files" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload files</span>
                <input
                  id="files"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX up to 10MB each
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isUploading || files.length === 0}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        ) : (
          'Upload Documents'
        )}
      </button>
    </form>
  );
};