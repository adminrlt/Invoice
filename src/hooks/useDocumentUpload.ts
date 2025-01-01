import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { validateFile } from '../utils/fileValidation';

export const useDocumentUpload = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const setValidatedFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return false;
      }
      return true;
    });
    setFiles(validFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return {
    name,
    setName,
    email,
    setEmail,
    files,
    setFiles: setValidatedFiles,
    isUploading,
    handleSubmit,
    removeFile
  };
};