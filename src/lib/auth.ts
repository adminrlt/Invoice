import { supabase } from './supabase';

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user || null;
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      // If profile doesn't exist, create it with default role
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({ id: userId, role: 'user' })
          .select('role')
          .single();
          
        if (createError) throw createError;
        return newProfile;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    // Return default profile if all else fails
    return { role: 'user' };
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  
  if (error) throw error;
  
  // Create profile immediately after signup
  if (data.user) {
    await getUserProfile(data.user.id);
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};