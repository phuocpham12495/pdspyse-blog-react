import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

interface RegisterForm {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const { signUp, isConfigured } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>();

    const password = watch('password');

    const onSubmit = async (data: RegisterForm) => {
        if (!isConfigured) {
            setError('Supabase is not configured. Please add your credentials to .env file.');
            return;
        }
        setLoading(true);
        setError('');
        const { error } = await signUp(data.email, data.password);
        setLoading(false);
        if (error) {
            setError(error);
        } else {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-page__card">
                <div className="auth-page__header">
                    <span className="auth-page__icon">✨</span>
                    <h1 className="auth-page__title">Create Account</h1>
                    <p className="auth-page__subtitle">Join as an admin to manage content</p>
                </div>

                {error && <div className="auth-page__error">{error}</div>}
                {success && (
                    <div className="auth-page__success">
                        🎉 Account created! Check your email for verification. Redirecting to login...
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit(onSubmit)} className="auth-page__form" id="register-form">
                        <div className="form-group">
                            <label htmlFor="reg-email" className="input-label">Email</label>
                            <input
                                id="reg-email"
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                                })}
                            />
                            {errors.email && <span className="input-error">{errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-password" className="input-label">Password</label>
                            <input
                                id="reg-password"
                                type="password"
                                className="input-field"
                                placeholder="Min 6 characters"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                })}
                            />
                            {errors.password && <span className="input-error">{errors.password.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-confirm" className="input-label">Confirm Password</label>
                            <input
                                id="reg-confirm"
                                type="password"
                                className="input-field"
                                placeholder="Re-enter your password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) => value === password || 'Passwords do not match',
                                })}
                            />
                            {errors.confirmPassword && <span className="input-error">{errors.confirmPassword.message}</span>}
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg auth-page__submit" disabled={loading}>
                            {loading ? 'Creating account...' : '🚀 Sign Up'}
                        </button>
                    </form>
                )}

                <p className="auth-page__footer-text">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </main>
    );
}
