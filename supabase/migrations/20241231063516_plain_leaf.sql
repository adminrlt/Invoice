-- Add function to safely set admin role
CREATE OR REPLACE FUNCTION set_admin_role(user_email text)
RETURNS void AS $$
BEGIN
  -- Update user metadata if user exists
  UPDATE auth.users
  SET 
    raw_app_meta_data = jsonb_build_object(
      'provider', COALESCE(raw_app_meta_data->>'provider', 'email'),
      'providers', ARRAY['email'],
      'role', 'admin'
    ),
    raw_user_meta_data = jsonb_build_object(
      'role', 'admin'
    ),
    role = 'authenticated',
    updated_at = now()
  WHERE email = user_email;

  -- Update profile if user exists
  UPDATE public.profiles
  SET 
    role = 'admin',
    updated_at = now()
  WHERE id IN (
    SELECT id FROM auth.users WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql;