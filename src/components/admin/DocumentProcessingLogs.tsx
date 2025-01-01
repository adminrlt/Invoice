import React from 'react';
import { formatDate } from '../../utils/date';
import { AlertCircle, CheckCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { formatDuration } from '../../utils/time';

interface ProcessingLog {
  id: string;
  status: string;
  step: string;
  details?: {
    fileUrl?: string;
    azureEndpoint?: string;
    responseStatus?: number;
    processingTime?: number;
    documentInfo?: any;
    error?: string;
  };
  error_message?: string;
  created_at: string;
}

interface DocumentProcessingLogsProps {
  documentId: string;
  logs: ProcessingLog[];
  isLoading?: boolean;
}

export const DocumentProcessingLogs: React.FC<DocumentProcessingLogsProps> = ({ 
  logs,
  isLoading 
}) => {
  const [expandedLogs, setExpandedLogs] = React.useState<Set<string>>(new Set());

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Processing Logs</h3>
        <p className="mt-1 text-sm text-gray-500">
          Detailed log of document processing steps and Azure AI analysis
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No processing logs available
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => {
              const isExpanded = expandedLogs.has(log.id);
              return (
                <li key={log.id} className="px-4 py-4">
                  <button 
                    onClick={() => toggleLogExpansion(log.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(log.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">{log.step}</p>
                            {(log.details || log.error_message) && (
                              isExpanded ? 
                                <ChevronDown className="h-4 w-4 text-gray-400" /> :
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(log.created_at)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        log.status === 'completed' ? 'bg-green-100 text-green-800' :
                        log.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (log.details || log.error_message) && (
                    <div className="mt-4 pl-8 space-y-3">
                      {/* Processing Details */}
                      {log.details && (
                        <div className="space-y-2">
                          {log.details.processingTime && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Duration:</span>{' '}
                              {formatDuration(log.details.processingTime)}
                            </p>
                          )}
                          {log.details.responseStatus && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Response Status:</span>{' '}
                              {log.details.responseStatus}
                            </p>
                          )}
                          {log.details.documentInfo && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Extracted Information:
                              </p>
                              <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto max-h-60">
                                {JSON.stringify(log.details.documentInfo, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Error Messages */}
                      {(log.error_message || log.details?.error) && (
                        <div className="rounded-md bg-red-50 p-3">
                          <p className="text-sm text-red-700">
                            {log.error_message || log.details?.error}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};