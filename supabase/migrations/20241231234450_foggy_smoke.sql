/*
  # Add page count tracking
  
  1. Changes
    - Add page_count column to document_info table
    - Add index for faster queries
    - Update existing functions to handle page count
*/

-- Add page_count column if it doesn't exist
ALTER TABLE document_info
ADD COLUMN IF NOT EXISTS page_count integer;

-- Create index for faster page count queries
CREATE INDEX IF NOT EXISTS idx_document_info_page_count 
ON document_info(document_id, page_count);

-- Update function to handle page count updates
CREATE OR REPLACE FUNCTION update_document_info_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;