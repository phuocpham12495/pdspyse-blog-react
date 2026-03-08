import { Link } from 'react-router-dom';
import type { Article } from '../types';
import type { ViewMode } from './ViewToggle';
import './ArticleCard.css';

interface ArticleCardProps {
    article: Article;
    viewMode?: ViewMode;
    featured?: boolean;
}

function formatViewCount(count: number): string {
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
}

export default function ArticleCard({ article, viewMode = 'grid', featured = false }: ArticleCardProps) {
    const classNames = [
        'article-card',
        'card',
        `article-card--${viewMode}`,
        featured ? 'article-card--featured' : '',
    ].filter(Boolean).join(' ');

    return (
        <Link to={`/article/${article.slug}`} className={classNames} id={`article-card-${article.id}`}>
            <div className="article-card__img-wrap">
                <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="article-card__img"
                    loading="lazy"
                />
                {article.category && (
                    <span className="article-card__category badge">{article.category.name}</span>
                )}
            </div>
            <div className="article-card__body">
                <h3 className="article-card__title">{article.title}</h3>
                <div className="article-card__meta">
                    <time className="article-card__date">
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </time>
                    <span className="article-card__views">
                        <svg className="article-card__views-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        {formatViewCount(article.view_count ?? 0)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
