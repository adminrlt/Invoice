import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function DocumentUpload() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      // Validate file types and sizes
      const validFiles = selectedFiles.filter(file => {
        const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        if (!isValidType) toast.error(`${file.name} is not a valid file type`);
        if (!isValidSize) toast.error(`${file.name} exceeds 10MB size limit`);
        return isValidType && isValidSize;
      });
      setFiles(validFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      // Upload each file
      const uploadPromises = files.map(async (file) => {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        return data.path;
      });

      const filePaths = await Promise.all(uploadPromises);

      // Store document metadata
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name,
          email,
          file_urls: filePaths
        });

      if (insertError) throw insertError;

      toast.success('Documents uploaded successfully!');
      setName('');
      setEmail('');
      setFiles([]);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Error uploading documents');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Submit Documents</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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

          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
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
          </div>
        </form>
      </div>
    </div>
  );
}