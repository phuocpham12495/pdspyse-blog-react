import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockArticles } from '../lib/mockData';
import type { Article, PaginatedResult } from '../types';

const PAGE_SIZE = 6;

export async function getArticles(
    page: number = 1,
    categoryId?: string,
    search?: string
): Promise<PaginatedResult<Article>> {
    if (!isSupabaseConfigured()) {
        return getArticlesMock(page, categoryId, search);
    }

    let query = supabase
        .from('articles')
        .select('*, category:categories(*)', { count: 'exact' })
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    const total = count ?? 0;
    return {
        data: (data as Article[]) || [],
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(total / PAGE_SIZE),
    };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    if (!isSupabaseConfigured()) {
        return mockArticles.find((a) => a.slug === slug) || null;
    }

    const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error) return null;
    return data as Article;
}

export async function getAllArticles(): Promise<Article[]> {
    if (!isSupabaseConfigured()) {
        return mockArticles;
    }

    const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Article[]) || [];
}

export async function getArticleById(id: string): Promise<Article | null> {
    if (!isSupabaseConfigured()) {
        return mockArticles.find((a) => a.id === id) || null;
    }

    const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single();

    if (error) return null;
    return data as Article;
}

export async function createArticle(article: {
    title: string;
    content: string;
    category_id: string;
    thumbnail_url: string;
    author_id: string;
    is_published?: boolean;
}): Promise<Article> {
    const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
        .from('articles')
        .insert({ ...article, slug, is_published: article.is_published ?? true })
        .select('*, category:categories(*)')
        .single();

    if (error) throw error;
    return data as Article;
}

export async function updateArticle(
    id: string,
    updates: Partial<{
        title: string;
        content: string;
        category_id: string;
        thumbnail_url: string;
        is_published: boolean;
    }>
): Promise<Article> {
    const updateData: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() };

    if (updates.title) {
        updateData.slug = updates.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    const { data, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select('*, category:categories(*)')
        .single();

    if (error) throw error;
    return data as Article;
}

export async function deleteArticle(id: string): Promise<void> {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
}

/* ---- Mock helpers ---- */
function getArticlesMock(
    page: number,
    categoryId?: string,
    search?: string
): PaginatedResult<Article> {
    let filtered = [...mockArticles];

    if (categoryId) {
        filtered = filtered.filter((a) => a.category_id === categoryId);
    }
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (a) =>
                a.title.toLowerCase().includes(q) ||
                a.content.toLowerCase().includes(q)
        );
    }

    const total = filtered.length;
    const start = (page - 1) * PAGE_SIZE;
    const data = filtered.slice(start, start + PAGE_SIZE);

    return {
        data,
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(total / PAGE_SIZE),
    };
}
