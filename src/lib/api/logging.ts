import { supabase } from '../supabase';

export interface LogEntry {
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  userId?: string;
}

export interface ProcessingLogEntry {
  documentId: string;
  status: string;
  step: string;
  details?: any;
  errorMessage?: string;
}

export const logActivity = async (entry: LogEntry) => {
  try {
    if (!entry.entityId) {
      console.warn('Invalid entity ID for activity log');
      return;
    }

    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: entry.userId,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId,
        details: entry.details
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const logProcessing = async (entry: ProcessingLogEntry) => {
  try {
    // Validate document ID
    if (!entry.documentId || !isValidUUID(entry.documentId)) {
      console.warn('Invalid document ID for processing log:', entry.documentId);
      return;
    }

    const { error } = await supabase
      .from('document_processing_logs')
      .insert({
        document_id: entry.documentId,
        status: entry.status,
        step: entry.step,
        details: entry.details,
        error_message: entry.errorMessage
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging processing:', error);
  }
};

// UUID validation helper
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}