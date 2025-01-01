import React from 'react';
import { X } from 'lucide-react';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove }) => (
  <div className="mt-4">
    <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
    <ul className="mt-2 divide-y divide-gray-200">
      {files.map((file, index) => (
        <li key={index} className="py-2 flex justify-between items-center">
          <span className="text-sm text-gray-500">{file.name}</span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </li>
      ))}
    </ul>
  </div>
);