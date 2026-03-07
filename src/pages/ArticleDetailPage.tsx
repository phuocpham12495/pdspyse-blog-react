import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug } from '../services/articleService';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Article } from '../types';
import './ArticleDetailPage.css';

export default function ArticleDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        getArticleBySlug(slug)
            .then(setArticle)
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
                    <time className="article-detail__date">
                        Published on{' '}
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                </header>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>
        </main>
    );
}
