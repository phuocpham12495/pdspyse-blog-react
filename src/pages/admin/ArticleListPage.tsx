import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles, deleteArticle, updateArticle } from '../../services/articleService';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Article } from '../../types';
import './ArticleListPage.css';

export default function ArticleListPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        setLoading(true);
        try {
            const data = await getAllArticles();
            setArticles(data);
        } catch {
            console.error('Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteArticle(deleteTarget.id);
            setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
            showToast('success', 'Article deleted successfully!');
        } catch {
            showToast('error', 'Failed to delete article.');
        }
        setDeleteTarget(null);
    };

    const handleTogglePublish = async (article: Article) => {
        try {
            const updated = await updateArticle(article.id, { is_published: !article.is_published });
            setArticles((prev) => prev.map((a) => (a.id === article.id ? updated : a)));
            showToast('success', updated.is_published ? 'Article published!' : 'Article moved to draft.');
        } catch {
            showToast('error', 'Failed to update article status.');
        }
    };

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) return <LoadingSpinner text="Loading articles..." />;

    return (
        <div className="article-list-page" id="admin-article-list">
            <div className="article-list-page__header">
                <div>
                    <h1 className="article-list-page__title">Articles</h1>
                    <p className="article-list-page__count">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
                </div>
                <Link to="/admin/articles/create" className="btn btn-primary">
                    ➕ New Article
                </Link>
            </div>

            {articles.length === 0 ? (
                <div className="article-list-page__empty">
                    <span style={{ fontSize: '3rem' }}>📭</span>
                    <p>No articles yet. Create your first one!</p>
                </div>
            ) : (
                <div className="article-list-page__table-wrap">
                    <table className="article-list-page__table">
                        <thead>
                            <tr>
                                <th>Article</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td>
                                        <div className="article-list-page__article-cell">
                                            <img src={article.thumbnail_url} alt="" className="article-list-page__thumb" />
                                            <span className="article-list-page__article-title">{article.title}</span>
                                        </div>
                                    </td>
                                    <td><span className="badge">{article.category?.name || 'Uncategorized'}</span></td>
                                    <td className="article-list-page__date">{new Date(article.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${article.is_published ? 'badge-success' : 'badge-accent'}`}>
                                            {article.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="article-list-page__actions">
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => handleTogglePublish(article)}
                                                title={article.is_published ? 'Move to draft' : 'Publish'}
                                            >
                                                {article.is_published ? '📋 Draft' : '🚀 Publish'}
                                            </button>
                                            <Link to={`/admin/articles/edit/${article.id}`} className="btn btn-ghost btn-sm">✏️ Edit</Link>
                                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--clr-error)' }} onClick={() => setDeleteTarget(article)}>
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Article"
                message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    );
}
