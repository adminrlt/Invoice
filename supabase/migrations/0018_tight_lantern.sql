/*
  # Make User Admin

  1. Changes
    - Update user's profile role to 'admin'
    - Update user's metadata to include admin role
*/

DO $$ 
BEGIN
  -- Update profile role to admin
  UPDATE public.profiles 
  SET role = 'admin',
      updated_at = now()
  WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email = 'kanthedgaurav@yahoo.com'
  );

  -- Update user metadata to include admin role
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || 
      jsonb_build_object('role', 'admin'),
      raw_user_meta_data = raw_user_meta_data || 
      jsonb_build_object('role', 'admin')
  WHERE email = 'kanthedgaurav@yahoo.com';

END $$;