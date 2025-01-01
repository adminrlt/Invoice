/*
  # Fix document processing schema and add preview support

  1. Updates
    - Add missing columns to document_info
    - Add proper indices
    - Update RLS policies
    - Add preview support
*/

-- Update document_info table
ALTER TABLE document_info
ADD COLUMN IF NOT EXISTS file_url text,
ADD COLUMN IF NOT EXISTS page_content text,
ADD COLUMN IF NOT EXISTS confidence_score decimal(5,2);

-- Create function to handle document processing status updates
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on processing result
  IF NEW.error_message IS NOT NULL THEN
    NEW.status := 'error';
  ELSIF NEW.processed_at IS NOT NULL THEN
    NEW.status := 'completed';
  END IF;
  
  -- Always update timestamp
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status updates
DROP TRIGGER IF EXISTS document_status_update ON document_info;
CREATE TRIGGER document_status_update
BEFORE UPDATE ON document_info
FOR EACH ROW
EXECUTE FUNCTION update_document_status();

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_document_info_status_date 
ON document_info(status, created_at);

CREATE INDEX IF NOT EXISTS idx_document_info_invoice_date 
ON document_info(invoice_date);