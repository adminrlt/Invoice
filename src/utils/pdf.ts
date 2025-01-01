export const validatePdfUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (
      (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') &&
      url.toLowerCase().endsWith('.pdf')
    );
  } catch (error) {
    console.error('PDF URL validation error:', error);
    return false;
  }
};