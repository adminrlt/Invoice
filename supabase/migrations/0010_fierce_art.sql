/*
  # Fix admin user authentication

  1. Changes
    - Properly recreates admin user with correct password hashing
    - Ensures profile exists with admin role
    - Adds proper metadata
*/

DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- First clean up any existing admin user
  DELETE FROM auth.users WHERE email = 'admin@example.com';
  
  -- Generate new admin ID
  admin_id := gen_random_uuid();

  -- Create admin user with proper ID and password
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_sso_user,
    is_super_admin
  )
  VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('admin123456', gen_salt('bf', 10)), -- Using proper password hashing
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
    '{"name":"Admin User"}'::jsonb,
    false,
    true
  );

  -- Ensure admin profile exists with correct role
  INSERT INTO public.profiles (id, role)
  VALUES (admin_id, 'admin')
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      updated_at = now();

END $$;