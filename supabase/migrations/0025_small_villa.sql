-- Add foreign key constraint to documents table
ALTER TABLE documents
DROP CONSTRAINT IF EXISTS documents_user_id_fkey,
ADD CONSTRAINT documents_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Update RLS policies for admin access
DROP POLICY IF EXISTS "Allow admin access to documents" ON documents;

CREATE POLICY "Allow admin access to documents"
ON documents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Drop existing policy if it exists before creating
DROP POLICY IF EXISTS "Allow public access to PDFs" ON storage.objects;

-- Enable public access for PDF files in the documents bucket
CREATE POLICY "Allow public access to PDFs"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'documents' AND
  lower(storage.extension(name)) = 'pdf'
);