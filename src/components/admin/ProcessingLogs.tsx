import React from 'react';
import { formatDate } from '../../utils/date';

interface ProcessingLog {
  id: string;
  status: string;
  step: string;
  details?: any;
  error_message?: string;
  created_at: string;
}

interface ProcessingLogsProps {
  logs: ProcessingLog[];
}

export const ProcessingLogs: React.FC<ProcessingLogsProps> = ({ logs }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Processing Logs</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {logs.map((log) => (
            <li key={log.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    log.status === 'completed' ? 'bg-green-100 text-green-800' :
                    log.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.status}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">{log.step}</span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(log.created_at)}</span>
              </div>
              {log.error_message && (
                <p className="mt-2 text-sm text-red-600">{log.error_message}</p>
              )}
              {log.details && (
                <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};