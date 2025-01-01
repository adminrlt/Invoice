import React from 'react';

export const LoadingSpinner = () => (
  <div className="min-h-[calc(100vh-theme(spacing.32))] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);