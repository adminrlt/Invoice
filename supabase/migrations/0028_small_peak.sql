/*
  # Update storage policies for admin access

  1. Changes
    - Add new storage policies for admin access to documents bucket
    - Grant full access (read/write/delete) to admin users
    - Maintain existing public access for PDFs
    - Keep user-specific upload policies

  2. Security
    - Verify admin role through profiles table
    - Maintain row-level security
*/

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to PDFs" ON storage.objects;

-- Create policy for admin full access
CREATE POLICY "Allow admin full access to documents"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Recreate policy for user uploads (non-admin)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Recreate policy for user downloads (non-admin)
CREATE POLICY "Allow authenticated downloads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Recreate public access for PDFs
CREATE POLICY "Allow public access to PDFs"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'documents' AND
  lower(storage.extension(name)) = 'pdf'
);