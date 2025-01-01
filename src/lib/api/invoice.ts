import { supabase } from '../supabase';

interface ExtractedInvoiceData {
  vendorName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: number;
}

export const extractInvoiceData = async (pdfUrl: string): Promise<ExtractedInvoiceData> => {
  try {
    // Here we would integrate with a PDF processing service
    // For now, we'll use a mock implementation
    const mockData: ExtractedInvoiceData = {
      vendorName: 'Sample Vendor',
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      totalAmount: 100.00
    };

    return mockData;
  } catch (error: any) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to extract invoice data');
  }
};

export const getInvoiceData = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from('invoice_data')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number');

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching invoice data:', error);
    throw error;
  }
};