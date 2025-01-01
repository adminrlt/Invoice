-- Drop existing policies by all possible names
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin full access to documents" ON storage.objects;
DROP POLICY IF EXISTS "admin_access_policy" ON storage.objects;
DROP POLICY IF EXISTS "user_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "user_access_policy" ON storage.objects;
DROP POLICY IF EXISTS "public_pdf_access_policy" ON storage.objects;

-- Create policy for admin access
CREATE POLICY "admin_access_policy"
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

-- Create policy for user uploads
CREATE POLICY "user_upload_policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for user access to their own files
CREATE POLICY "user_access_policy"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);

-- Create policy for public access to PDFs
CREATE POLICY "public_pdf_access_policy"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'documents' AND
  storage.extension(name) = 'pdf'
);

-- Ensure proper permissions are granted
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO public;