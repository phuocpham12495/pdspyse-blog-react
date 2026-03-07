import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) return null;
    return data as Profile;
}

export async function updateProfile(
    userId: string,
    updates: Partial<{
        avatar_url: string;
        email: string;
        date_of_birth: string;
    }>
): Promise<Profile> {
    const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data as Profile;
}
