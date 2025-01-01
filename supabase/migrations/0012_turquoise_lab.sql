/*
  # Create admin user with proper configuration
  
  1. Changes
    - Create admin user with proper metadata and role
    - Set up admin profile
    - Remove attempt to set generated columns
    - Use proper password hashing
*/

DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- Clean up any existing admin user
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
    is_sso_user,
    is_super_admin
  )
  VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('admin123456', gen_salt('bf', 10)),
    now(),
    now(),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email'],
      'role', 'admin'
    ),
    jsonb_build_object(
      'name', 'Admin User'
    ),
    false,
    true
  );

  -- Ensure admin profile exists
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