/*
  # Add document processing tables and functions

  1. New Tables
    - `document_pages` - Stores individual page information from multi-page PDFs
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `page_number` (integer)
      - `file_url` (text)
      - `created_at` (timestamptz)

    - `document_line_items` - Stores line items extracted from invoices
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `page_id` (uuid, references document_pages)
      - `description` (text)
      - `quantity` (numeric)
      - `unit_price` (numeric)
      - `amount` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on new tables
    - Add admin-only policies
*/

-- Create document_pages table
CREATE TABLE document_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create document_line_items table
CREATE TABLE document_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  page_id uuid REFERENCES document_pages(id) ON DELETE CASCADE,
  description text,
  quantity numeric,
  unit_price numeric,
  amount numeric,
  created_at timestamptz DEFAULT now()
);

-- Add tax_amount and subtotal to document_info
ALTER TABLE document_info 
ADD COLUMN tax_amount numeric,
ADD COLUMN subtotal numeric;

-- Enable RLS
ALTER TABLE document_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_line_items ENABLE ROW LEVEL SECURITY;

-- Create admin policies for document_pages
CREATE POLICY "Allow admin access to document_pages"
ON document_pages
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

-- Create admin policies for document_line_items
CREATE POLICY "Allow admin access to document_line_items"
ON document_line_items
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