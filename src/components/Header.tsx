import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="header">
            <div className="header__inner container">
                <Link to="/" className="header__logo">
                    <span className="header__logo-icon">✨</span>
                    <span className="header__logo-text">Pdspyse</span>
                </Link>

                <button
                    className={`header__hamburger ${menuOpen ? 'is-open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>

                <nav className={`header__nav ${menuOpen ? 'is-open' : ''}`}>
                    <Link to="/" className={`header__link ${isActive('/') ? 'is-active' : ''}`} onClick={() => setMenuOpen(false)}>
                        🏠 Home
                    </Link>
                    {user ? (
                        <>
                            <Link to="/admin" className={`header__link ${location.pathname.startsWith('/admin') ? 'is-active' : ''}`} onClick={() => setMenuOpen(false)}>
                                📊 Dashboard
                            </Link>
                            <button className="btn btn-ghost header__link" onClick={() => { signOut(); setMenuOpen(false); }}>
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className={`header__link ${isActive('/login') ? 'is-active' : ''}`} onClick={() => setMenuOpen(false)}>
                            🔑 Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
