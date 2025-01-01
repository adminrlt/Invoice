/*
  # Update Document Processing Schema

  1. Changes
    - Add status tracking columns to document_info and document_pages
    - Add processing timestamps and error tracking
    - Create indices for better query performance
    - Set up triggers for status updates

  2. Security
    - Maintain existing RLS policies
*/

-- Update document_info table
ALTER TABLE document_info
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS processed_at timestamptz,
ADD COLUMN IF NOT EXISTS error_message text;

-- Create index for faster document info queries
CREATE INDEX IF NOT EXISTS idx_document_info_document_id 
ON document_info(document_id);

CREATE INDEX IF NOT EXISTS idx_document_info_status 
ON document_info(status);

-- Add status column to document_pages first
ALTER TABLE document_pages
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS content text,
ADD COLUMN IF NOT EXISTS vendor_name text,
ADD COLUMN IF NOT EXISTS bank_name text,
ADD COLUMN IF NOT EXISTS invoice_number text,
ADD COLUMN IF NOT EXISTS invoice_date date,
ADD COLUMN IF NOT EXISTS total_amount decimal(10,2),
ADD COLUMN IF NOT EXISTS tax_amount decimal(10,2),
ADD COLUMN IF NOT EXISTS subtotal decimal(10,2),
ADD COLUMN IF NOT EXISTS processed_at timestamptz;

-- Create indices for document_pages
CREATE INDEX IF NOT EXISTS idx_document_pages_document_id 
ON document_pages(document_id);

-- Update document_line_items table
ALTER TABLE document_line_items
ADD COLUMN IF NOT EXISTS page_number integer,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS processed_at timestamptz;

-- Create indices for document_line_items
CREATE INDEX IF NOT EXISTS idx_document_line_items_document_id 
ON document_line_items(document_id);

CREATE INDEX IF NOT EXISTS idx_document_line_items_page_number 
ON document_line_items(document_id, page_number);

-- Create function to update document processing status
CREATE OR REPLACE FUNCTION update_document_processing_status()
RETURNS trigger AS $$
BEGIN
  UPDATE document_info
  SET 
    status = 
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM document_pages 
          WHERE document_id = NEW.document_id 
          AND status = 'error'
        ) THEN 'error'
        WHEN EXISTS (
          SELECT 1 FROM document_pages 
          WHERE document_id = NEW.document_id 
          AND status = 'pending'
        ) THEN 'processing'
        ELSE 'completed'
      END,
    processed_at = CASE 
      WHEN NEW.status = 'completed' THEN NOW()
      ELSE processed_at
    END
  WHERE document_id = NEW.document_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for document processing status
DROP TRIGGER IF EXISTS update_document_status ON document_pages;
CREATE TRIGGER update_document_status
AFTER INSERT OR UPDATE OF status
ON document_pages
FOR EACH ROW
EXECUTE FUNCTION update_document_processing_status();