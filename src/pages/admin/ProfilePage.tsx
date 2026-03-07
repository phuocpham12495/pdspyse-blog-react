import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile } from '../../services/profileService';
import { uploadAvatar, validateFile } from '../../services/storageService';
import { isSupabaseConfigured } from '../../lib/supabase';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Profile } from '../../types';
import './ProfilePage.css';

interface ProfileFormData {
    email: string;
    date_of_birth: string;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const { register, handleSubmit, setValue } = useForm<ProfileFormData>();

    useEffect(() => {
        if (!user || !isSupabaseConfigured()) {
            setLoading(false);
            return;
        }
        getProfile(user.id)
            .then((p) => {
                if (p) {
                    setProfile(p);
                    setValue('email', p.email);
                    setValue('date_of_birth', p.date_of_birth || '');
                    if (p.avatar_url) setAvatarPreview(p.avatar_url);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user, setValue]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const error = validateFile(file);
        if (error) {
            showToast('error', error);
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: ProfileFormData) => {
        if (!user) return;
        setSubmitting(true);

        try {
            let avatarUrl: string | undefined;
            if (avatarFile) {
                const { url } = await uploadAvatar(avatarFile, user.id);
                avatarUrl = url;
            }

            const updated = await updateProfile(user.id, {
                email: data.email,
                date_of_birth: data.date_of_birth || undefined,
                ...(avatarUrl && { avatar_url: avatarUrl }),
            });

            setProfile(updated);
            showToast('success', 'Profile updated successfully!');
        } catch {
            showToast('error', 'Failed to update profile.');
        } finally {
            setSubmitting(false);
        }
    };

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) return <LoadingSpinner text="Loading profile..." />;

    if (!isSupabaseConfigured()) {
        return (
            <div className="profile-page" style={{ textAlign: 'center', padding: 'var(--sp-16) 0' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--sp-4)' }}>👤 Profile Settings</h2>
                <p style={{ color: 'var(--clr-text-muted)' }}>
                    Configure Supabase to manage your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="profile-page" id="profile-page">
            <h1 className="profile-page__title">Profile Settings</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                {/* Avatar */}
                <div className="profile-form__avatar-section">
                    <div className="profile-form__avatar-wrap">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="profile-form__avatar-img" />
                        ) : (
                            <div className="profile-form__avatar-placeholder">👤</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="avatar-input" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                            📷 Change Avatar
                        </label>
                        <input
                            id="avatar-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-light)', marginTop: 'var(--sp-2)' }}>
                            JPEG, PNG, or WebP (max 5MB)
                        </p>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="profile-email" className="input-label">Email</label>
                    <input
                        id="profile-email"
                        type="email"
                        className="input-field"
                        {...register('email')}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profile-dob" className="input-label">Date of Birth</label>
                    <input
                        id="profile-dob"
                        type="date"
                        className="input-field"
                        {...register('date_of_birth')}
                    />
                </div>

                <div className="article-form__actions">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                        {submitting ? 'Saving...' : '💾 Save Profile'}
                    </button>
                </div>
            </form>

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    );
}
