import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getArticleById, updateArticle } from '../../services/articleService';
import { getCategories } from '../../services/categoryService';
import { uploadThumbnail, validateFile } from '../../services/storageService';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Category } from '../../types';
import './ArticleForm.css';

interface ArticleFormData {
    title: string;
    content: string;
    category_id: string;
}

export default function EditArticlePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [fileError, setFileError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPublished, setIsPublished] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ArticleFormData>();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [article, cats] = await Promise.all([
                    getArticleById(id!),
                    getCategories(),
                ]);
                setCategories(cats);

                if (article) {
                    setValue('title', article.title);
                    setValue('content', article.content);
                    setValue('category_id', article.category_id);
                    if (article.thumbnail_url) setThumbnailPreview(article.thumbnail_url);
                    setIsPublished(article.is_published);
                }
            } catch {
                setError('Failed to load article');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            setFileError(validationError);
            return;
        }

        setFileError('');
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: ArticleFormData) => {
        setSubmitting(true);
        setError('');

        try {
            let thumbnailUrl: string | undefined;
            if (thumbnailFile) {
                const { url } = await uploadThumbnail(thumbnailFile);
                thumbnailUrl = url;
            }

            await updateArticle(id!, {
                title: data.title,
                content: data.content,
                category_id: data.category_id,
                is_published: isPublished,
                ...(thumbnailUrl && { thumbnail_url: thumbnailUrl }),
            });

            navigate('/admin/articles');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update article');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading article..." />;

    return (
        <div className="article-form-page" id="edit-article-page">
            <h1 className="article-form-page__title">Edit Article</h1>

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
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => {
                                        setThumbnailFile(null);
                                        setThumbnailPreview('');
                                    }}
                                >
                                    Change Image
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
                    <button
                        type="button"
                        className={`btn ${isPublished ? 'btn-ghost' : 'btn-primary'} btn-lg`}
                        onClick={() => setIsPublished(!isPublished)}
                    >
                        {isPublished ? '📋 Switch to Draft' : '🚀 Switch to Published'}
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                        {submitting ? 'Saving...' : '💾 Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
