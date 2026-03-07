import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { signIn, isConfigured } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        if (!isConfigured) {
            setError('Supabase is not configured. Please add your credentials to .env file.');
            return;
        }
        setLoading(true);
        setError('');
        const { error } = await signIn(data.email, data.password);
        setLoading(false);
        if (error) {
            setError(error);
        } else {
            navigate('/admin');
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-page__card">
                <div className="auth-page__header">
                    <span className="auth-page__icon">🔑</span>
                    <h1 className="auth-page__title">Welcome Back</h1>
                    <p className="auth-page__subtitle">Sign in to your admin account</p>
                </div>

                {error && <div className="auth-page__error">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="auth-page__form" id="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="input-field"
                            placeholder="admin@example.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                            })}
                        />
                        {errors.email && <span className="input-error">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input-field"
                            placeholder="Enter your password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            })}
                        />
                        {errors.password && <span className="input-error">{errors.password.message}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg auth-page__submit" disabled={loading}>
                        {loading ? 'Signing in...' : '🚀 Sign In'}
                    </button>
                </form>

                <p className="auth-page__footer-text">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </main>
    );
}
