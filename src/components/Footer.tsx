import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner container">
                <div className="footer__brand">
                    <span className="footer__logo">✨ Pdspyse Blog</span>
                    <p className="footer__tagline">Cute stories, cool ideas.</p>
                </div>
                <div className="footer__links">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="mailto:hello@pdspyse.dev">Contact</a>
                </div>
                <p className="footer__copy">
                    &copy; {new Date().getFullYear()} Pdspyse Blog. Built with 💜 React & Supabase.
                </p>
            </div>
        </footer>
    );
}
