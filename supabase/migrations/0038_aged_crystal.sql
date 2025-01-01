-- First, ensure the documents bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin full access to documents" ON storage.objects;
DROP POLICY IF EXISTS "admin_access_policy" ON storage.objects;
DROP POLICY IF EXISTS "user_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "user_access_policy" ON storage.objects;
DROP POLICY IF EXISTS "public_pdf_access_policy" ON storage.objects;

-- Create simplified policies

-- 1. Admin full access
CREATE POLICY "admin_full_access"
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

-- 2. Public read access for PDFs
CREATE POLICY "public_pdf_read"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'documents' AND
  storage.extension(name) = 'pdf'
);

-- 3. Authenticated user access
CREATE POLICY "authenticated_access"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO public;