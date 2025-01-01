/*
  # Create admin user with proper ID handling

  1. Changes
    - Uses DO block for better error handling
    - Properly generates and handles UUID for user
    - Ensures profile creation with admin role
*/

DO $$ 
DECLARE
  admin_id uuid := gen_random_uuid();
BEGIN
  -- Delete existing admin if exists
  DELETE FROM auth.users WHERE email = 'admin@example.com';

  -- Create admin user with proper ID
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
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
      'providers', array['email']
    ),
    jsonb_build_object(
      'name', 'Admin User'
    )
  );

  -- Ensure admin profile exists with correct role
  INSERT INTO public.profiles (id, role)
  VALUES (admin_id, 'admin')
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin';
END $$;