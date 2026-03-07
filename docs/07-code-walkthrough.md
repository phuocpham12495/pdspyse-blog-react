# 🎓 Hướng Dẫn Mã Nguồn – Pdspyse Blog React
> **Vai trò:** Mentor Lập Trình Viên Cao Cấp

---

## 1. Điểm Vào (Entry Point)

### `src/main.tsx` – React khởi động tại đây

```tsx
// BrowserRouter bọc toàn bộ app → cho phép react-router hoạt động
// AuthProvider bọc toàn bộ app → mọi component con có thể truy cập auth state
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>        {/* ← Cung cấp routing context */}
      <AuthProvider>       {/* ← Cung cấp user/session state */}
        <App />            {/* ← Route definitions */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

**Tại sao thứ tự wrapper quan trọng?**
- `BrowserRouter` phải ngoài cùng vì `AuthProvider` có thể cần `useNavigate()`
- `AuthProvider` bọc `App` vì các route components cần truy cập `useAuth()`

---

## 2. Duyệt Cây Component

```
App
├── Header                    ← Sticky nav, glassmorphism
│   ├── Logo (Link to /)
│   ├── NavLinks (Home, Login/Dashboard)
│   └── HamburgerMenu (mobile)
│
├── Routes
│   ├── / → HomePage
│   │   ├── Hero Section
│   │   ├── SearchBar         ← Debounced input (350ms)
│   │   ├── CategoryFilter    ← Tag buttons
│   │   ├── ArticleCard[]     ← Grid of cards
│   │   └── Pagination        ← Prev/Next + page numbers
│   │
│   ├── /article/:slug → ArticleDetailPage
│   │   ├── Banner Image
│   │   ├── Back Link
│   │   ├── Article Header (badge, title, date)
│   │   └── Article Content (dangerouslySetInnerHTML)
│   │
│   ├── /login → LoginPage    ← react-hook-form
│   ├── /register → RegisterPage
│   │
│   └── /admin/* → ProtectedRoute → AdminLayout
│       ├── Sidebar Navigation
│       └── Outlet (child routes)
│           ├── /admin → DashboardPage
│           ├── /admin/articles → ArticleListPage
│           ├── /admin/articles/create → CreateArticlePage
│           ├── /admin/articles/edit/:id → EditArticlePage
│           └── /admin/profile → ProfilePage
│
└── Footer
```

---

## 3. Luồng Quản Lý State

### AuthContext Pattern

```tsx
// AuthContext.tsx – Provider Pattern
// State: user, session, loading
// Methods: signIn, signUp, signOut

// Luồng:
// 1. App khởi động → AuthProvider mount
// 2. useEffect gọi supabase.auth.getSession() → set initial state
// 3. onAuthStateChange listener → auto update khi token refresh/expire
// 4. ProtectedRoute kiểm tra user → redirect nếu null

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook đảm bảo type safety
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
}
```

### Component-level State (HomePage)

```tsx
// HomePage.tsx – Local state cho UI filtering
const [articles, setArticles] = useState([]);     // Data from API
const [search, setSearch] = useState('');          // Search keyword
const [selectedCategory, setSelectedCategory] = useState(null); // Filter
const [page, setPage] = useState(1);              // Pagination
const [loading, setLoading] = useState(true);      // Loading indicator

// useCallback memoize fetchArticles → chỉ re-create khi dependencies thay đổi
const fetchArticles = useCallback(async () => {
  const result = await getArticles(page, selectedCategory, search);
  setArticles(result.data);
}, [page, selectedCategory, search]);

// useEffect trigger fetch khi filter thay đổi
useEffect(() => { fetchArticles(); }, [fetchArticles]);
```

---

## 4. Chiến Lược Fetch & Cache Dữ Liệu

### Service Layer Pattern

```tsx
// Mỗi service module follow pattern:
// 1. Check isSupabaseConfigured()
// 2. If false → return mock data
// 3. If true → call Supabase client

export async function getArticles(page, categoryId, search) {
  if (!isSupabaseConfigured()) {
    return getArticlesMock(page, categoryId, search);  // ← Mock fallback
  }

  // Supabase query builder pattern:
  let query = supabase
    .from('articles')
    .select('*, category:categories(*)', { count: 'exact' })  // ← JOIN
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // Dynamic filtering – chain conditionally
  if (categoryId) query = query.eq('category_id', categoryId);
  if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

  // Pagination via range()
  query = query.range(from, to);

  return query;
}
```

### PWA Caching

```typescript
// vite.config.ts – Workbox strategy
workbox: {
  runtimeCaching: [{
    urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
    handler: 'NetworkFirst',    // ← API: fresh data preferred, fallback to cache
    options: {
      cacheName: 'supabase-api-cache',
      expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
    }
  }]
}
// Static assets (JS, CSS, images) → CacheFirst by default
```

---

## 5. Các Mẫu Thiết Kế Chính

### Pattern 1: Compound Component (AdminLayout)
```tsx
// AdminLayout sử dụng React Router Outlet
// → Sidebar persistent, chỉ main content thay đổi
<AdminLayout>          {/* Parent route */}
  <Outlet />           {/* Child route renders here */}
</AdminLayout>
```

### Pattern 2: Render Props via Children (ProtectedRoute)
```tsx
// ProtectedRoute wrap children → conditional rendering
<ProtectedRoute>
  <AdminLayout />      {/* Only renders if user is authenticated */}
</ProtectedRoute>
```

### Pattern 3: Controlled Filter State (HomePage)
```tsx
// SearchBar và CategoryFilter là controlled components
// Parent (HomePage) owns the state, children emit changes
<SearchBar value={search} onChange={handleSearch} />
<CategoryFilter selected={selectedCategory} onSelect={handleCategorySelect} />
// Handlers reset page to 1 when filter changes → avoid empty page
```

### Pattern 4: Confirmation Before Destructive Action
```tsx
// ArticleListPage: state-driven modal
const [deleteTarget, setDeleteTarget] = useState(null);
// Click delete → set target → modal shows
// Confirm → call deleteArticle() → clear target
// Cancel → set target null → modal hides
```

### Pattern 5: File Upload Preview
```tsx
// FileReader API for client-side preview before upload
const reader = new FileReader();
reader.onload = (e) => setPreview(e.target.result);
reader.readAsDataURL(file);
// Validation happens BEFORE preview → reject invalid files early
```
