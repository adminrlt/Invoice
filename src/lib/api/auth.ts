import { supabase } from '../supabase';
import { getProfile } from './profiles';
import { AuthError, handleAuthError } from './errors';
import type { AuthResponse, AuthUser } from '../../types';

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new AuthError(handleAuthError(error));
    return session;
  } catch (error) {
    console.error('Session error:', error);
    throw new AuthError(handleAuthError(error));
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const session = await getCurrentSession();
    if (!session?.user) return null;

    const profile = await getProfile(session.user.id);
    return {
      id: session.user.id,
      email: session.user.email!,
      role: profile.role
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    
    if (error) throw new AuthError(handleAuthError(error));
    if (!data.user) throw new AuthError('Authentication failed');
    
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
    console.error('Sign in error:', error);
    throw error instanceof AuthError ? error : new AuthError(handleAuthError(error));
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new AuthError(handleAuthError(error));
  } catch (error) {
    console.error('Sign out error:', error);
    throw error instanceof AuthError ? error : new AuthError(handleAuthError(error));
  }
};