import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ArticleListPage from './pages/admin/ArticleListPage';
import CreateArticlePage from './pages/admin/CreateArticlePage';
import EditArticlePage from './pages/admin/EditArticlePage';
import ProfilePage from './pages/admin/ProfilePage';

export default function App() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/article/:slug" element={<ArticleDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="articles" element={<ArticleListPage />} />
                    <Route path="articles/create" element={<CreateArticlePage />} />
                    <Route path="articles/edit/:id" element={<EditArticlePage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>
            </Routes>

            <Footer />
        </div>
    );
}
