import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center gap-2">
    <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
    <span className="text-xl font-bold text-gray-900">Invoice Intelligence</span>
  </div>
);