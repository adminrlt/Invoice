import { supabase } from '../../supabase';
import { getProfile } from '../profiles';
import { AuthError, handleAuthError } from '../errors';
import type { AuthResponse } from '../../../types';

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    
    if (error) throw new AuthError(handleAuthError(error));
    if (!data.user) throw new AuthError('Authentication failed');
    
    const profile = await getProfile(data.user.id);
    
    // Log the profile data for debugging
    console.log('User profile:', profile);
    
    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: profile.role || 'user' // Ensure role is never undefined
      },
      session: data.session,
      profile
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error instanceof AuthError ? error : new AuthError(handleAuthError(error));
  }
};