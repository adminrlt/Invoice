import { supabase } from '../supabase';
import { logProcessing } from './logging';

const AZURE_ENDPOINT = 'https://eastus.api.cognitive.microsoft.com';
const AZURE_API_KEY = '4b5373afd1954ac08b4e3db198215fb3';

interface ExtractedInfo {
  vendorName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: number;
}

export const extractDocumentInfo = async (fileUrl: string): Promise<ExtractedInfo> => {
  const startTime = Date.now();
  const documentId = fileUrl.split('/').pop()?.split('.')[0] || 'unknown';

  try {
    // Log analysis start
    await logProcessing({
      documentId,
      status: 'processing',
      step: 'Starting Azure AI analysis',
      details: {
        fileUrl,
        azureEndpoint: AZURE_ENDPOINT
      }
    });

    // Start analysis
    const analyzeResponse = await fetch(
      `${AZURE_ENDPOINT}/formrecognizer/documentModels/prebuilt-invoice:analyze?api-version=2023-07-31`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': AZURE_API_KEY
        },
        body: JSON.stringify({
          urlSource: fileUrl
        })
      }
    );

    if (!analyzeResponse.ok) {
      const errorText = await analyzeResponse.text();
      throw new Error(`Analysis request failed: ${errorText}`);
    }

    // Log successful analysis request
    await logProcessing({
      documentId,
      status: 'processing',
      step: 'Analysis request successful',
      details: {
        responseStatus: analyzeResponse.status,
        processingTime: Date.now() - startTime
      }
    });

    const operationLocation = analyzeResponse.headers.get('operation-location');
    if (!operationLocation) {
      throw new Error('No operation location returned');
    }

    // Poll for results
    const result = await pollForResults(operationLocation, documentId);
    if (!result) {
      throw new Error('Document analysis timed out');
    }

    const extractedInfo = parseExtractedInfo(result);

    // Log successful extraction
    await logProcessing({
      documentId,
      status: 'completed',
      step: 'Document analysis completed',
      details: {
        processingTime: Date.now() - startTime,
        documentInfo: extractedInfo
      }
    });

    return extractedInfo;
  } catch (error: any) {
    // Log error
    await logProcessing({
      documentId,
      status: 'error',
      step: 'Azure AI analysis failed',
      details: {
        error: error.message,
        processingTime: Date.now() - startTime
      },
      errorMessage: error.message
    });

    console.error('Document analysis error:', error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
};

const pollForResults = async (operationLocation: string, documentId: string, timeout = 30000): Promise<any> => {
  const startTime = Date.now();
  const interval = 1000; // 1 second

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(operationLocation, {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Polling failed: ${await response.text()}`);
      }

      const result = await response.json();
      
      // Log polling status
      await logProcessing({
        documentId,
        status: 'processing',
        step: 'Polling for results',
        details: {
          status: result.status,
          processingTime: Date.now() - startTime
        }
      });
      
      if (result.status === 'succeeded') {
        return result;
      }
      
      if (result.status === 'failed') {
        throw new Error(result.error?.message || 'Analysis failed');
      }

      await new Promise(resolve => setTimeout(resolve, interval));
    } catch (error) {
      console.error('Polling error:', error);
      throw error;
    }
  }

  throw new Error('Operation timed out');
};

const parseExtractedInfo = (result: any): ExtractedInfo => {
  try {
    const document = result.analyzeResult?.documents?.[0];
    if (!document) {
      throw new Error('No document content found');
    }

    const fields = document.fields;
    return {
      vendorName: fields.VendorName?.content,
      invoiceNumber: fields.InvoiceId?.content,
      invoiceDate: fields.InvoiceDate?.content,
      totalAmount: fields.InvoiceTotal?.content?.amount
    };
  } catch (error: any) {
    console.error('Parsing error:', error);
    throw new Error(`Failed to parse document info: ${error.message}`);
  }
};