/*
  # Create admin user
  
  1. Changes
    - Creates initial admin user with credentials:
      Email: admin@example.com
      Password: admin123456
    - Sets user role to 'admin' in profiles table
*/

-- Create admin user
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
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('admin123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}'
);

-- Set admin role
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@example.com'
);