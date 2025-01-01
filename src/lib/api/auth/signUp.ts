import { supabase } from '../../supabase';
import { getProfile } from '../profiles';
import { AuthError, handleAuthError } from '../errors';
import type { AuthResponse } from '../../../types';

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw new AuthError(handleAuthError(error));
    if (!data.user) throw new AuthError('Account creation failed');

    const profile = await getProfile(data.user.id);

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: profile.role
      },
      session: data.session,
      profile
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error instanceof AuthError ? error : new AuthError(handleAuthError(error));
  }
};