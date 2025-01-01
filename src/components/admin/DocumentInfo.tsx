import React from 'react';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface DocumentInfoProps {
  info: {
    vendor_name?: string;
    bank_name?: string;
    invoice_number?: string;
    invoice_date?: string;
    total_amount?: number;
    page_number: number;
  };
}

export const DocumentInfo: React.FC<DocumentInfoProps> = ({ info }) => {
  return (
    <div className="bg-gray-50 px-4 py-3 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        {info.vendor_name && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Vendor</dt>
            <dd className="mt-1 text-sm text-gray-900">{info.vendor_name}</dd>
          </div>
        )}
        {info.bank_name && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Bank</dt>
            <dd className="mt-1 text-sm text-gray-900">{info.bank_name}</dd>
          </div>
        )}
        {info.invoice_number && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Invoice Number</dt>
            <dd className="mt-1 text-sm text-gray-900">{info.invoice_number}</dd>
          </div>
        )}
        {info.invoice_date && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Invoice Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(info.invoice_date)}</dd>
          </div>
        )}
        {info.total_amount && (
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatCurrency(info.total_amount)}</dd>
          </div>
        )}
        <div>
          <dt className="text-sm font-medium text-gray-500">Page</dt>
          <dd className="mt-1 text-sm text-gray-900">{info.page_number}</dd>
        </div>
      </dl>
    </div>
  );
};