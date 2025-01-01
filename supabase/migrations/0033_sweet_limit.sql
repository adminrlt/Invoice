/*
  # Fix document_info table structure and error handling

  1. Changes
    - Add missing columns for proper status tracking
    - Add indices for better performance
    - Add trigger for automatic status updates

  2. New Columns
    - processing_status: Track document processing state
    - error_details: Store detailed error information
    - retry_count: Track processing attempts
*/

-- Add missing columns to document_info
ALTER TABLE document_info
ADD COLUMN IF NOT EXISTS processing_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS error_details jsonb,
ADD COLUMN IF NOT EXISTS retry_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_retry_at timestamptz;

-- Create better indices
CREATE INDEX IF NOT EXISTS idx_document_info_processing_status 
ON document_info(processing_status, document_id);

-- Create status update function
CREATE OR REPLACE FUNCTION update_document_processing_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update timestamps
  NEW.updated_at = now();
  
  -- Update retry information if status changes to error
  IF NEW.processing_status = 'error' AND OLD.processing_status != 'error' THEN
    NEW.retry_count = COALESCE(OLD.retry_count, 0) + 1;
    NEW.last_retry_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace trigger
DROP TRIGGER IF EXISTS document_processing_status_update ON document_info;
CREATE TRIGGER document_processing_status_update
BEFORE UPDATE ON document_info
FOR EACH ROW
EXECUTE FUNCTION update_document_processing_status();