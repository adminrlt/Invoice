/*
  # Fix PDF Preview Access

  1. Changes
    - Add public access policy for PDF files
    - Update storage bucket configuration
*/

-- Enable public access for PDF files in the documents bucket
CREATE POLICY "Allow public access to PDFs"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'documents' AND
  lower(storage.extension(name)) = 'pdf'
);