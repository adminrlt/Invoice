/*
  # Create admin user and set permissions

  1. Changes
    - Creates admin user if it doesn't exist
    - Sets admin role in profiles table
    - Ensures idempotent execution
*/

DO $$ 
BEGIN
  -- Create admin user if not exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
  ) THEN
    INSERT INTO auth.users (
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
      '00000000-0000-0000-0000-000000000000',
      'admin@example.com',
      crypt('admin123456', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User"}'
    );
  END IF;

  -- Ensure admin role is set
  UPDATE profiles 
  SET role = 'admin' 
  WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email = 'admin@example.com'
  );
END $$;