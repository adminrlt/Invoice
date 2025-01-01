import React from 'react';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface InvoiceDataProps {
  data: {
    vendor_name?: string;
    invoice_number?: string;
    invoice_date?: string;
    total_amount?: number;
    status: string;
    error_message?: string;
  };
}

export const InvoiceData: React.FC<InvoiceDataProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Invoice Information</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          data.status === 'completed' ? 'bg-green-100 text-green-800' :
          data.status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
      </div>

      {data.error_message ? (
        <div className="text-red-600 text-sm">{data.error_message}</div>
      ) : (
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          {data.vendor_name && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Vendor</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.vendor_name}</dd>
            </div>
          )}
          {data.invoice_number && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Invoice Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.invoice_number}</dd>
            </div>
          )}
          {data.invoice_date && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(data.invoice_date)}</dd>
            </div>
          )}
          {data.total_amount && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatCurrency(data.total_amount)}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
};