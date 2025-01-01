import type { AuthUser } from '../types';

export const validateUserRole = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return ['admin', 'user'].includes(user.role);
};

export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === 'admin';
};