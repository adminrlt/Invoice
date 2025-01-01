-- Update existing user to admin role
DO $$ 
BEGIN
  -- Update user metadata and role
  UPDATE auth.users
  SET 
    raw_app_meta_data = jsonb_build_object(
      'provider', COALESCE(raw_app_meta_data->>'provider', 'email'),
      'providers', ARRAY['email'],
      'role', 'admin'
    ),
    raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'admin'),
    role = 'authenticated',
    updated_at = now()
  WHERE email = 'kanthedgaurav@gmail.com';

  -- Update or create admin profile
  INSERT INTO public.profiles (
    id,
    role,
    created_at,
    updated_at
  )
  SELECT 
    id,
    'admin',
    COALESCE(created_at, now()),
    now()
  FROM auth.users
  WHERE email = 'kanthedgaurav@gmail.com'
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      updated_at = now();

END $$;