/*
  # Fix profiles table policies

  1. Changes
    - Add policy for users to insert their own profile
    - Add policy for users to update their own profile
    - Add policy for system functions to manage profiles
  
  2. Security
    - Maintain existing RLS
    - Add more granular policies
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin users can update profiles" ON profiles;

-- Create new policies
CREATE POLICY "Users can manage their own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin users can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role
  WHERE profiles.id = EXCLUDED.id;
  RETURN new;
END;
$$;