import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockCategories } from '../lib/mockData';
import type { Category } from '../types';

export async function getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured()) {
        return mockCategories;
    }

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return (data as Category[]) || [];
}

export async function createCategory(name: string): Promise<Category> {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
        .from('categories')
        .insert({ name, slug })
        .select()
        .single();

    if (error) throw error;
    return data as Category;
}
