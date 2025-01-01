import { AZURE_CONFIG, PROCESSING_CONFIG } from './config';

export const analyzeDocument = async (fileUrl: string) => {
  try {
    // Start analysis
    const analyzeResponse = await fetch(
      `${AZURE_CONFIG.endpoint}/formrecognizer/documentModels/prebuilt-invoice:analyze?api-version=${AZURE_CONFIG.apiVersion}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': AZURE_CONFIG.apiKey
        },
        body: JSON.stringify({ urlSource: fileUrl })
      }
    );

    if (!analyzeResponse.ok) {
      throw new Error(`Analysis request failed: ${await analyzeResponse.text()}`);
    }

    const operationLocation = analyzeResponse.headers.get('operation-location');
    if (!operationLocation) {
      throw new Error('No operation location returned');
    }

    // Poll for results
    const result = await pollForResults(operationLocation);
    return parseAnalysisResult(result);
  } catch (error: any) {
    console.error('Document analysis error:', error);
    throw new Error(`Failed to analyze document: ${error.message}`);
  }
};

const pollForResults = async (operationLocation: string): Promise<any> => {
  const startTime = Date.now();

  while (Date.now() - startTime < PROCESSING_CONFIG.timeout) {
    try {
      const response = await fetch(operationLocation, {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_CONFIG.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Polling failed: ${await response.text()}`);
      }

      const result = await response.json();
      
      if (result.status === 'succeeded') {
        return result;
      }
      
      if (result.status === 'failed') {
        throw new Error(result.error?.message || 'Analysis failed');
      }

      await new Promise(resolve => setTimeout(resolve, PROCESSING_CONFIG.retryDelay));
    } catch (error) {
      throw error;
    }
  }

  throw new Error('Operation timed out');
};

const parseAnalysisResult = (result: any) => {
  const document = result.analyzeResult?.documents?.[0];
  if (!document) {
    throw new Error('No document content found');
  }

  const fields = document.fields;
  return {
    vendorName: fields.VendorName?.content,
    invoiceNumber: fields.InvoiceId?.content,
    invoiceDate: fields.InvoiceDate?.content,
    totalAmount: fields.InvoiceTotal?.content?.amount,
    confidence: document.confidence,
    fields: document.fields
  };
};