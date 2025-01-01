import { supabase } from '../supabase';

export const getDocumentInfo = async (documentId: string) => {
  try {
    // First try to get the most recent document info
    const { data, error } = await supabase
      .from('document_info')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No document info found, return null
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching document info:', error);
    throw error;
  }
};

export const createDocumentInfo = async (documentId: string, info: any) => {
  try {
    const { data, error } = await supabase
      .from('document_info')
      .insert({
        document_id: documentId,
        ...info,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating document info:', error);
    throw error;
  }
};

export const updateDocumentInfo = async (documentId: string, info: any) => {
  try {
    const { data, error } = await supabase
      .from('document_info')
      .update({
        ...info,
        updated_at: new Date().toISOString()
      })
      .eq('document_id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating document info:', error);
    throw error;
  }
};