// Date format utilities
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const parseDate = (dateString: string): string | null => {
  try {
    // Handle common European date format (DD.MM.YYYY)
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Parse other formats and return ISO date string
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};