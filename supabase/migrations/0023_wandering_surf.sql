/*
  # Fix Document-User Relationship

  1. Changes
    - Add foreign key constraint for user_id to auth.users
    - Update documents table structure
    - Add RLS policies for admin access
*/

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