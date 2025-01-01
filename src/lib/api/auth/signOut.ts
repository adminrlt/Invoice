import { supabase } from '../../supabase';
import { AuthError, handleAuthError } from '../errors';

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new AuthError(handleAuthError(error));
  } catch (error) {
    console.error('Sign out error:', error);
    throw error instanceof AuthError ? error : new AuthError(handleAuthError(error));
  }
};