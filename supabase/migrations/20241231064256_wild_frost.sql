-- First clean up any existing admin user
DELETE FROM auth.users WHERE email = 'admin@example.com';

DO $$ 
DECLARE
  admin_id uuid := gen_random_uuid();
BEGIN
  -- Create admin user with proper password hashing
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
    role
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
    jsonb_build_object(
      'name', 'Admin User',
      'role', 'admin'
    ),
    false,
    'authenticated'
  );

  -- Ensure admin profile exists with correct role
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

  -- Call function to set admin role
  PERFORM set_admin_role('admin@example.com');
END $$;