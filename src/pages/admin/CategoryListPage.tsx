import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Category } from '../../types';
import './CategoryListPage.css';

export default function CategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch {
            console.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setAdding(true);
        try {
            const created = await createCategory(newName.trim());
            setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
            setNewName('');
            showToast('success', `Category "${created.name}" created!`);
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Failed to create category');
        } finally {
            setAdding(false);
        }
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;
        try {
            const updated = await updateCategory(id, editName.trim());
            setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
            setEditingId(null);
            showToast('success', 'Category updated!');
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Failed to update category');
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCategory(deleteTarget.id);
            setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
            showToast('success', 'Category deleted!');
        } catch {
            showToast('error', 'Failed to delete category. It may still have articles.');
        }
        setDeleteTarget(null);
    };

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) return <LoadingSpinner text="Loading categories..." />;

    return (
        <div className="category-page" id="admin-category-list">
            <div className="category-page__header">
                <div>
                    <h1 className="category-page__title">Categories</h1>
                    <p className="category-page__count">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
                </div>
            </div>

            {/* Add new category */}
            <form className="category-page__add-form" onSubmit={handleAdd}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="New category name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={adding || !newName.trim()}>
                    {adding ? 'Adding...' : '➕ Add'}
                </button>
            </form>

            {categories.length === 0 ? (
                <div className="category-page__empty">
                    <span style={{ fontSize: '3rem' }}>🏷️</span>
                    <p>No categories yet. Create your first one above!</p>
                </div>
            ) : (
                <div className="category-page__table-wrap">
                    <table className="category-page__table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td>
                                        {editingId === cat.id ? (
                                            <input
                                                type="text"
                                                className="category-page__edit-input"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleUpdate(cat.id);
                                                    if (e.key === 'Escape') cancelEdit();
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <span style={{ fontWeight: 'var(--fw-medium)' }}>{cat.name}</span>
                                        )}
                                    </td>
                                    <td><span className="category-page__slug">{cat.slug}</span></td>
                                    <td className="category-page__date">{new Date(cat.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="category-page__actions">
                                            {editingId === cat.id ? (
                                                <>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(cat.id)}>
                                                        💾 Save
                                                    </button>
                                                    <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(cat)}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        style={{ color: 'var(--clr-error)' }}
                                                        onClick={() => setDeleteTarget(cat)}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </>
                                            )}
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
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? Articles in this category will become uncategorized.`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    );
}
