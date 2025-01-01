-- First, remove duplicates keeping only the most recent record per document
WITH ranked_records AS (
  SELECT id,
         document_id,
         ROW_NUMBER() OVER (
           PARTITION BY document_id 
           ORDER BY created_at DESC
         ) as rn
  FROM document_info
)
DELETE FROM document_info
WHERE id IN (
  SELECT id 
  FROM ranked_records 
  WHERE rn > 1
);

-- Now safely add the unique constraint
ALTER TABLE document_info
DROP CONSTRAINT IF EXISTS document_info_document_id_key,
ADD CONSTRAINT document_info_document_id_key UNIQUE (document_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_document_info_lookup 
ON document_info(document_id, created_at DESC);