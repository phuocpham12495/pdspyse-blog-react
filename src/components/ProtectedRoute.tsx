import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, isConfigured } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!isConfigured) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: 'var(--sp-16) 0' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--sp-4)' }}>🔒 Admin Access</h2>
                <p style={{ color: 'var(--clr-text-muted)' }}>
                    Supabase is not configured. Please add your credentials to <code>.env</code> to enable authentication.
                </p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
