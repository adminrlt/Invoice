interface FileValidation {
  isValid: boolean;
  error?: string;
}

export const validateFile = (file: File): FileValidation => {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `${file.name} is not a valid file type. Please upload PDF or Word documents only.`
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `${file.name} exceeds the 10MB size limit.`
    };
  }

  return { isValid: true };
};