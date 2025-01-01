export * from './signIn';
export * from './signUp';
export * from './signOut';
export * from './session';

export const AUTH_ERROR_MESSAGES = {
  NO_SESSION: 'No active session',
  NO_PROFILE: 'No profile found',
  INVALID_ROLE: 'Invalid user role',
  ACCESS_DENIED: 'Access denied',
} as const;