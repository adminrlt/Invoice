export const getFileNameFromUrl = (url: string): string => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  // Remove any timestamp prefix if present (e.g., "1234567890-filename.pdf" -> "filename.pdf")
  return fileName.replace(/^\d+-/, '');
};

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    default:
      return 'document';
  }
};