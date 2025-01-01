-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin access to departments" ON departments;
DROP POLICY IF EXISTS "Allow admin access to employees" ON employees;

-- Create comprehensive policies for departments table
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

-- Create comprehensive policies for employees table
CREATE POLICY "Allow admin access to employees"
ON employees
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

-- Ensure proper grants are in place
GRANT ALL ON departments TO authenticated;
GRANT ALL ON employees TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;