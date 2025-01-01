/*
  # Update storage policies for document access

  1. Changes
    - Drop existing storage policies
    - Create comprehensive admin access policy
    - Update user access policies
    - Enable public PDF access
    
  2. Security
    - Ensure admin users have full access to all documents
    - Maintain user access to their own documents
    - Allow public access to PDFs
*/

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin full access to documents" ON storage.objects;

-- Create comprehensive admin access policy
CREATE POLICY "Allow admin full access to documents"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create policy for regular user uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create policy for regular user downloads
CREATE POLICY "Allow authenticated downloads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable public access for PDFs
CREATE POLICY "Allow public access to PDFs"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'documents' AND
  lower(storage.extension(name)) = 'pdf'
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO public;