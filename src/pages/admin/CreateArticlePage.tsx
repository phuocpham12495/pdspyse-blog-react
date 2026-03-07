import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createArticle } from '../../services/articleService';
import { getCategories } from '../../services/categoryService';
import { uploadThumbnail, validateFile } from '../../services/storageService';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { Category } from '../../types';
import './ArticleForm.css';

interface ArticleFormData {
    title: string;
    content: string;
    category_id: string;
}

export default function CreateArticlePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [fileError, setFileError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ArticleFormData>();

    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            setFileError(validationError);
            setThumbnailFile(null);
            setThumbnailPreview('');
            return;
        }

        setFileError('');
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: ArticleFormData) => {
        if (!isSupabaseConfigured()) {
            setError('Supabase is not configured. Please add your credentials to .env file.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            let thumbnailUrl = '';
            if (thumbnailFile) {
                const { url } = await uploadThumbnail(thumbnailFile);
                thumbnailUrl = url;
            }

            await createArticle({
                title: data.title,
                content: data.content,
                category_id: data.category_id,
                thumbnail_url: thumbnailUrl,
                author_id: user?.id || '',
            });

            navigate('/admin/articles');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create article');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="article-form-page" id="create-article-page">
            <h1 className="article-form-page__title">Create New Article</h1>

            {error && <div className="auth-page__error" style={{ maxWidth: '700px' }}>{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="article-form">
                <div className="form-group">
                    <label htmlFor="title" className="input-label">Title</label>
                    <input
                        id="title"
                        type="text"
                        className="input-field"
                        placeholder="Enter article title"
                        {...register('title', { required: 'Title is required' })}
                    />
                    {errors.title && <span className="input-error">{errors.title.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category" className="input-label">Category</label>
                    <select
                        id="category"
                        className="input-field"
                        {...register('category_id', { required: 'Category is required' })}
                    >
                        <option value="">Select a category...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <span className="input-error">{errors.category_id.message}</span>}
                </div>

                <div className="form-group">
                    <label className="input-label">Thumbnail</label>
                    <div className="article-form__upload">
                        {thumbnailPreview ? (
                            <div className="article-form__preview-wrap">
                                <img src={thumbnailPreview} alt="Preview" className="article-form__preview" />
                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setThumbnailFile(null); setThumbnailPreview(''); }}>
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <label className="article-form__upload-area" htmlFor="thumbnail-input">
                                <span style={{ fontSize: '2rem' }}>📷</span>
                                <span>Click to upload thumbnail</span>
                                <span className="article-form__upload-hint">JPEG, PNG, WebP (max 5MB)</span>
                            </label>
                        )}
                        <input
                            id="thumbnail-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    {fileError && <span className="input-error">{fileError}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="content" className="input-label">Content</label>
                    <textarea
                        id="content"
                        className="input-field article-form__textarea"
                        placeholder="Write your article content here... (HTML supported)"
                        rows={15}
                        {...register('content', { required: 'Content is required' })}
                    />
                    {errors.content && <span className="input-error">{errors.content.message}</span>}
                </div>

                <div className="article-form__actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                        {submitting ? 'Publishing...' : '🚀 Publish Article'}
                    </button>
                </div>
            </form>
        </div>
    );
}
