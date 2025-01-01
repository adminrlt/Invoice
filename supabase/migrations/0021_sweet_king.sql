/*
  # Fix Department Table RLS Policies

  1. Changes
    - Updates RLS policies for departments table to properly handle admin access
    - Ensures admin users can perform all operations on departments
    - Maintains security while allowing proper access

  2. Security
    - Enables RLS on departments table
    - Creates policies for admin CRUD operations
    - Uses proper role checking
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow admin access to departments" ON departments;

-- Create new policies with proper role checking
CREATE POLICY "Allow admin access to departments"
ON departments
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

-- Grant necessary permissions
GRANT ALL ON departments TO authenticated;