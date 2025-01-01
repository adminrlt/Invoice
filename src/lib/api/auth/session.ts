import { supabase } from '../../supabase';
import { getProfile } from '../profiles';
import { AuthError, handleAuthError } from '../errors';
import type { AuthUser } from '../../../types';

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
    if (!session?.user) {
      console.log('No active session found');
      return null;
    }

    const profile = await getProfile(session.user.id);
    console.log('Retrieved profile:', profile);

    if (!profile) {
      console.log('No profile found for user');
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      role: profile.role || 'user'
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};