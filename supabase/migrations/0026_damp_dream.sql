/*
  # Add document information tables

  1. New Tables
    - `document_info`: Stores extracted information from documents
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `vendor_name` (text)
      - `bank_name` (text)
      - `invoice_number` (text)
      - `invoice_date` (date)
      - `total_amount` (decimal)
      - `page_number` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add admin access policy
*/

CREATE TABLE document_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  vendor_name text,
  bank_name text,
  invoice_number text,
  invoice_date date,
  total_amount decimal(10,2),
  page_number integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE document_info ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to document_info"
ON document_info
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