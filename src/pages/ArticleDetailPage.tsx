import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug, incrementViewCount } from '../services/articleService';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Article } from '../types';
import './ArticleDetailPage.css';

function formatViewCount(count: number): string {
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
}

export default function ArticleDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const viewCounted = useRef(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        getArticleBySlug(slug)
            .then((a) => {
                setArticle(a);
                // Increment view count once per page load
                if (a && !viewCounted.current) {
                    viewCounted.current = true;
                    incrementViewCount(a.id).catch(console.error);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <LoadingSpinner text="Loading article..." />;

    if (!article) {
        return (
            <div className="article-detail__not-found container">
                <span style={{ fontSize: '4rem' }}>😢</span>
                <h2>Article Not Found</h2>
                <p>The article you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--sp-4)' }}>
                    ← Back to Home
                </Link>
            </div>
        );
    }

    return (
        <main className="article-detail">
            {/* Banner */}
            <div className="article-detail__banner">
                <img src={article.thumbnail_url} alt={article.title} className="article-detail__banner-img" />
                <div className="article-detail__banner-overlay" />
            </div>

            <article className="article-detail__body container">
                <Link to="/" className="article-detail__back btn btn-ghost">← Back to articles</Link>

                <header className="article-detail__header">
                    {article.category && (
                        <span className="badge">{article.category.name}</span>
                    )}
                    <h1 className="article-detail__title">{article.title}</h1>
                    <div className="article-detail__meta">
                        <time className="article-detail__date">
                            Published on{' '}
                            {new Date(article.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                        <span className="article-detail__views">
                            <svg className="article-detail__views-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            {formatViewCount(article.view_count ?? 0)} views
                        </span>
                    </div>
                </header>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>
        </main>
    );
}
