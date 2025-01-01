/*
  # Fix admin authentication
  
  1. Changes
    - Ensure admin user has correct metadata
    - Set proper role in both auth and profiles tables
    - Clean up any existing problematic data
*/

DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- Clean up existing admin user
  DELETE FROM auth.users WHERE email = 'admin@example.com';
  
  -- Generate new admin ID
  admin_id := gen_random_uuid();

  -- Create admin user with confirmed email
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
    is_sso_user
  )
  VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('admin123456', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']::text[],
      'role', 'admin'
    ),
    jsonb_build_object('name', 'Admin User'),
    false
  );

  -- Create admin profile with correct role
  INSERT INTO public.profiles (id, role, created_at, updated_at)
  VALUES (
    admin_id,
    'admin',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      updated_at = now();

END $$;