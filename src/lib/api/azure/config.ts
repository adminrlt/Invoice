import { supabase } from '../../supabase';

// Azure Form Recognizer configuration
export const AZURE_CONFIG = {
  endpoint: 'https://eastus.api.cognitive.microsoft.com',
  apiKey: '4b5373afd1954ac08b4e3db198215fb3',
  apiVersion: '2023-07-31'
};

// Document processing configuration
export const PROCESSING_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  batchSize: 5
};