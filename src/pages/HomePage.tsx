import { useState, useEffect, useCallback } from 'react';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticles } from '../services/articleService';
import { getCategories } from '../services/categoryService';
import type { Article, Category } from '../types';
import './HomePage.css';

export default function HomePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getArticles(page, selectedCategory ?? undefined, search || undefined);
            setArticles(result.data);
            setTotalPages(result.totalPages);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
        } finally {
            setLoading(false);
        }
    }, [page, selectedCategory, search]);

    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategorySelect = (catId: string | null) => {
        setSelectedCategory(catId);
        setPage(1);
    };

    return (
        <main className="home-page">
            {/* Hero */}
            <section className="hero">
                <div className="hero__inner container">
                    <span className="hero__emoji">✨</span>
                    <h1 className="hero__title">Pdspyse Blog</h1>
                    <p className="hero__subtitle">Cute stories. Cool ideas. Fresh perspectives.</p>
                </div>
                <div className="hero__blur hero__blur--1" />
                <div className="hero__blur hero__blur--2" />
            </section>

            {/* Filters */}
            <section className="home-page__filters container">
                <SearchBar value={search} onChange={handleSearch} />
                <CategoryFilter categories={categories} selected={selectedCategory} onSelect={handleCategorySelect} />
            </section>

            {/* Article Grid */}
            <section className="home-page__content container">
                {loading ? (
                    <LoadingSpinner text="Loading articles..." />
                ) : articles.length === 0 ? (
                    <div className="home-page__empty">
                        <span className="home-page__empty-icon">📭</span>
                        <h3>No articles found</h3>
                        <p>Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                ) : (
                    <>
                        <div className="article-grid">
                            {articles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                )}
            </section>
        </main>
    );
}
