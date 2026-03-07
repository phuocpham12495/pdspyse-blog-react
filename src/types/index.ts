export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string;
    category_id: string;
    author_id: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    /* Joined fields */
    category?: Category;
}

export interface Profile {
    id: string;
    email: string;
    avatar_url: string | null;
    date_of_birth: string | null;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
