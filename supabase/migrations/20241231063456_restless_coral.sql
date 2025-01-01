-- Ensure proper role and permissions setup
DO $$ 
BEGIN
  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

  -- Create admin role policy for profiles
  DROP POLICY IF EXISTS "admin_access_policy" ON profiles;
  CREATE POLICY "admin_access_policy"
    ON profiles
    FOR ALL
    TO authenticated
    USING (role = 'admin')
    WITH CHECK (role = 'admin');

  -- Update existing profiles with proper timestamps if needed
  UPDATE public.profiles
  SET 
    updated_at = COALESCE(updated_at, now()),
    created_at = COALESCE(created_at, now());

END $$;