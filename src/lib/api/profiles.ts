import { supabase } from '../supabase';
import type { Profile } from '../../types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProfile = async (userId: string, retryCount = 0): Promise<Profile> => {
  try {
    console.log(`Fetching profile for user ${userId} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Profile fetch error:', error);
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile');
        return createProfile(userId);
      }
      throw error;
    }
    
    console.log('Profile fetched successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Error fetching profile:', error);

    if (retryCount < MAX_RETRIES && (error.message?.includes('fetch') || error.code === '20')) {
      console.log(`Retrying profile fetch in ${RETRY_DELAY}ms...`);
      await wait(RETRY_DELAY * (retryCount + 1));
      return getProfile(userId, retryCount + 1);
    }

    console.warn('Creating default profile after error');
    return createProfile(userId);
  }
};

const createProfile = async (userId: string): Promise<Profile> => {
  const defaultProfile = {
    id: userId,
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    console.log('Creating new profile:', defaultProfile);
    const { data, error } = await supabase
      .from('profiles')
      .insert(defaultProfile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    console.log('Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    return defaultProfile;
  }
};