/*
  # Invoice Processing Setup

  1. New Tables
    - `invoice_data`
      - Stores extracted invoice information
      - Links to documents and pages
      - Includes vendor, amount, date fields
    
  2. Security
    - Enable RLS
    - Add admin access policies
*/

-- Create invoice_data table
CREATE TABLE invoice_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  vendor_name text,
  invoice_number text,
  invoice_date date,
  total_amount decimal(10,2),
  status text DEFAULT 'pending',
  processed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoice_data ENABLE ROW LEVEL SECURITY;

-- Create admin policy
CREATE POLICY "Allow admin access to invoice_data"
ON invoice_data
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

-- Create indices
CREATE INDEX idx_invoice_data_document_id ON invoice_data(document_id);
CREATE INDEX idx_invoice_data_status ON invoice_data(status);