import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            {/* Mobile toggle */}
            <button
                className="admin-layout__toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
                <div className="admin-sidebar__header">
                    <span className="admin-sidebar__logo">✨</span>
                    <span className="admin-sidebar__title">Admin Panel</span>
                </div>

                <nav className="admin-sidebar__nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <span className="admin-sidebar__link-icon">📊</span>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/articles" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <span className="admin-sidebar__link-icon">📝</span>
                        Articles
                    </NavLink>
                    <NavLink to="/admin/articles/create" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <span className="admin-sidebar__link-icon">➕</span>
                        New Article
                    </NavLink>
                    <NavLink to="/admin/profile" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <span className="admin-sidebar__link-icon">👤</span>
                        Profile
                    </NavLink>
                </nav>

                <div className="admin-sidebar__footer">
                    <NavLink to="/" className="admin-sidebar__link" onClick={() => setSidebarOpen(false)}>
                        <span className="admin-sidebar__link-icon">🏠</span>
                        View Blog
                    </NavLink>
                    <button className="admin-sidebar__link admin-sidebar__logout" onClick={handleLogout}>
                        <span className="admin-sidebar__link-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && <div className="admin-layout__overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Main content */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
