/*
  # Add activity logging tables

  1. New Tables
    - `activity_logs`
      - Stores all system activities with timestamps and details
    - `document_processing_logs`
      - Stores detailed document processing logs
  
  2. Security
    - Enable RLS on new tables
    - Add admin-only access policies
*/

-- Create activity_logs table
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create document_processing_logs table
CREATE TABLE document_processing_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  status text NOT NULL,
  step text NOT NULL,
  details jsonb,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_processing_logs ENABLE ROW LEVEL SECURITY;

-- Create admin policies
CREATE POLICY "Allow admin access to activity_logs"
ON activity_logs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Allow admin access to document_processing_logs"
ON document_processing_logs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create indices for better performance
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX idx_document_processing_logs_document_id ON document_processing_logs(document_id);
CREATE INDEX idx_document_processing_logs_status ON document_processing_logs(status);
CREATE INDEX idx_document_processing_logs_created_at ON document_processing_logs(created_at);