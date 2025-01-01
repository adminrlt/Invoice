/*
  # Create storage bucket for documents
  
  1. New Storage
    - Create 'documents' bucket for file storage
  2. Security
    - Enable authenticated access for document uploads
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('documents', 'documents')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policy for authenticated downloads
CREATE POLICY "Allow authenticated downloads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);