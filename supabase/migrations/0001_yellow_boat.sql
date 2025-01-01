/*
  # Create Documents Schema

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text)
      - `file_urls` (text array)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `documents` table
    - Add policies for authenticated users to:
      - Insert their own documents
      - Read their own documents
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  file_urls text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);