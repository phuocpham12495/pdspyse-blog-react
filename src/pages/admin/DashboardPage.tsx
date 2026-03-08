import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '../../services/articleService';
import { getCategories } from '../../services/categoryService';
import type { Article, Category } from '../../types';
import './DashboardPage.css';

export default function DashboardPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getAllArticles().then(setArticles).catch(console.error);
        getCategories().then(setCategories).catch(console.error);
    }, []);

    const publishedCount = articles.filter((a) => a.is_published).length;

    return (
        <div className="dashboard" id="admin-dashboard">
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__subtitle">Welcome back! Here's an overview of your blog.</p>

            <div className="dashboard__stats">
                <div className="dashboard__stat-card">
                    <span className="dashboard__stat-icon">📝</span>
                    <div>
                        <p className="dashboard__stat-value">{articles.length}</p>
                        <p className="dashboard__stat-label">Total Articles</p>
                    </div>
                </div>
                <div className="dashboard__stat-card">
                    <span className="dashboard__stat-icon">✅</span>
                    <div>
                        <p className="dashboard__stat-value">{publishedCount}</p>
                        <p className="dashboard__stat-label">Published</p>
                    </div>
                </div>
                <div className="dashboard__stat-card">
                    <span className="dashboard__stat-icon">🏷️</span>
                    <div>
                        <p className="dashboard__stat-value">{categories.length}</p>
                        <p className="dashboard__stat-label">Categories</p>
                    </div>
                </div>
            </div>

            <div className="dashboard__actions">
                <Link to="/admin/articles/create" className="btn btn-primary btn-lg">
                    ➕ Create Article
                </Link>
                <Link to="/admin/articles" className="btn btn-secondary btn-lg">
                    📋 Manage Articles
                </Link>
                <Link to="/admin/categories" className="btn btn-secondary btn-lg">
                    🏷️ Manage Categories
                </Link>
            </div>

            {articles.length > 0 && (
                <div className="dashboard__recent">
                    <h2 className="dashboard__section-title">Recent Articles</h2>
                    <div className="dashboard__recent-list">
                        {articles.slice(0, 5).map((article) => (
                            <div key={article.id} className="dashboard__recent-item">
                                <img src={article.thumbnail_url} alt="" className="dashboard__recent-thumb" />
                                <div className="dashboard__recent-info">
                                    <p className="dashboard__recent-title">{article.title}</p>
                                    <p className="dashboard__recent-date">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link to={`/admin/articles/edit/${article.id}`} className="btn btn-ghost btn-sm">
                                    Edit
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
