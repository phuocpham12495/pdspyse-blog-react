import type { Article, Category } from '../types';

export const mockCategories: Category[] = [
    { id: 'cat-1', name: 'Technology', slug: 'technology', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-2', name: 'Lifestyle', slug: 'lifestyle', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-3', name: 'Design', slug: 'design', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-4', name: 'Travel', slug: 'travel', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-5', name: 'Food', slug: 'food', created_at: '2026-01-01T00:00:00Z' },
];

const generateContent = (title: string) => `
<h2>Introduction</h2>
<p>${title} is a fascinating topic that has been gaining traction in recent years. In this article, we'll explore the key concepts, current trends, and what the future holds.</p>

<h2>Key Highlights</h2>
<ul>
  <li>Understanding the fundamentals and why they matter</li>
  <li>Exploring real-world applications and case studies</li>
  <li>Tips and best practices from industry experts</li>
</ul>

<blockquote>
  "The best way to predict the future is to create it." — Peter Drucker
</blockquote>

<h2>Deep Dive</h2>
<p>When we look at the landscape of modern development, there are several important aspects to consider. Each one plays a crucial role in shaping how we build and interact with technology.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

<h2>Conclusion</h2>
<p>As we continue to evolve in this space, staying informed and adaptable will be key to success. Keep experimenting, keep learning, and most importantly, enjoy the journey!</p>
`;

const thumbnails = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop',
];

const articleTitles = [
    'Getting Started with React 19: What\'s New',
    'The Art of Minimalist Design Systems',
    'Exploring Hidden Gems in Southeast Asia',
    'Building Scalable APIs with Supabase',
    '10 Healthy Recipes for Busy Developers',
    'The Future of Progressive Web Apps',
    'How to Build a Personal Brand in Tech',
    'Understanding TypeScript Generics Deeply',
    'A Traveler\'s Guide to Japanese Cuisine',
    'Modern CSS Techniques You Need to Know',
    'Creating Beautiful Data Visualizations',
    'The Psychology of User Experience',
];

const slugify = (text: string): string =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const viewCounts = [1243, 856, 3421, 672, 2105, 498, 1876, 3012, 945, 1567, 2890, 734];

export const mockArticles: Article[] = articleTitles.map((title, i) => ({
    id: `article-${i + 1}`,
    title,
    slug: slugify(title),
    content: generateContent(title),
    thumbnail_url: thumbnails[i % thumbnails.length],
    category_id: mockCategories[i % mockCategories.length].id,
    author_id: 'admin-1',
    is_published: true,
    view_count: viewCounts[i % viewCounts.length],
    created_at: new Date(2026, 0, i + 1).toISOString(),
    updated_at: new Date(2026, 0, i + 1).toISOString(),
    category: mockCategories[i % mockCategories.length],
}));
