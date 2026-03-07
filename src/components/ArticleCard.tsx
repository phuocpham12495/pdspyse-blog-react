import { Link } from 'react-router-dom';
import type { Article } from '../types';
import './ArticleCard.css';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Link to={`/article/${article.slug}`} className="article-card card" id={`article-card-${article.id}`}>
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
                <time className="article-card__date">
                    {new Date(article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </time>
            </div>
        </Link>
    );
}
