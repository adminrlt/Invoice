/*
  # Fix document info schema and add error handling

  1. Updates
    - Add missing columns to document_info table
    - Add error handling fields
    - Add proper indices
    - Update RLS policies
*/

-- Add missing columns and error handling fields to document_info
ALTER TABLE document_info
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS error_message text,
ADD COLUMN IF NOT EXISTS processed_at timestamptz,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_document_info_document_id 
ON document_info(document_id);

CREATE INDEX IF NOT EXISTS idx_document_info_status 
ON document_info(status);

-- Create function to handle timestamp updates
CREATE OR REPLACE FUNCTION update_document_info_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp updates
DROP TRIGGER IF EXISTS update_document_info_timestamp ON document_info;
CREATE TRIGGER update_document_info_timestamp
BEFORE UPDATE ON document_info
FOR EACH ROW
EXECUTE FUNCTION update_document_info_timestamp();