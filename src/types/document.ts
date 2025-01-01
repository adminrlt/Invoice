export interface ProcessingResult {
  success: boolean;
  error?: string;
}

export interface DocumentInfo {
  vendorName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  errorDetails?: {
    message: string;
    timestamp: string;
  };
}