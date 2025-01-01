export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

export const validateCredentials = (email: string, password: string): string | null => {
  const emailError = validateEmail(email);
  if (emailError) return emailError;
  
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;
  
  return null;
};