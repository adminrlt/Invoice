-- Add ON DELETE CASCADE to document_info foreign key
ALTER TABLE document_info
DROP CONSTRAINT IF EXISTS document_info_document_id_fkey,
ADD CONSTRAINT document_info_document_id_fkey 
  FOREIGN KEY (document_id) 
  REFERENCES documents(id) 
  ON DELETE CASCADE;

-- Update unique constraint to handle null values
ALTER TABLE document_info
DROP CONSTRAINT IF EXISTS document_info_document_id_key,
ADD CONSTRAINT document_info_document_id_key 
  UNIQUE NULLS NOT DISTINCT (document_id);

-- Add trigger to handle concurrent updates
CREATE OR REPLACE FUNCTION handle_document_info_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if new data is more recent
  IF OLD.updated_at IS NULL OR NEW.updated_at > OLD.updated_at THEN
    RETURN NEW;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS document_info_update_trigger ON document_info;
CREATE TRIGGER document_info_update_trigger
  BEFORE UPDATE ON document_info
  FOR EACH ROW
  EXECUTE FUNCTION handle_document_info_update();