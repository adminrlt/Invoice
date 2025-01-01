export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const handleAuthError = (error: any): string => {
  if (!error) return 'An unknown error occurred';

  // Handle specific error codes
  switch (error.code) {
    case 'invalid_credentials':
      return 'Invalid email or password';
    case 'invalid_grant':
      return 'Invalid login credentials';
    case '23505': // Unique violation
      return 'Account already exists';
    case 'P0001': // Raise exception
      return error.message;
    default:
      break;
  }

  // Handle specific error messages
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('invalid login credentials')) {
    return 'Invalid admin credentials. Please check your password and try again.';
  }
  if (message.includes('access denied')) {
    return 'Access denied. Admin privileges required.';
  }
  if (message.includes('admin')) {
    return 'Admin authentication failed';
  }

  return error.message || 'Authentication failed';
};