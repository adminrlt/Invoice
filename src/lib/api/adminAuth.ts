import { supabase } from '../supabase';
import { AuthError, handleAuthError } from './errors';
import { getProfile } from './profiles';
import type { AuthResponse } from '../../types';

export const adminSignIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    
    if (error) throw error;
    if (!data.user) throw new Error('Authentication failed');

    // Verify admin role
    const profile = await getProfile(data.user.id);
    if (profile.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Access denied. Admin privileges required.');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: profile.role
      },
      session: data.session,
      profile
    };
  } catch (error: any) {
    throw new AuthError(handleAuthError(error));
  }
};