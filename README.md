# ✨ Pdspyse Blog React

A cute & cool blog application built with **React 19 + TypeScript + Vite**, powered by **Supabase** for authentication, database, and storage.

> **Vai trò:** Kỹ Sư DevOps

---

## 📋 Yêu Cầu Tiên Quyết

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | >= 18.x | `node -v` |
| npm | >= 9.x | `npm -v` |
| Git | >= 2.x | `git --version` |
| Supabase Account | Free tier | [supabase.com](https://supabase.com) |

---

## 🚀 Các Bước Cài Đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd pdspyse-blog-react
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

```bash
# Copy template
cp .env.example .env

# Mở file .env và điền thông tin Supabase
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Lưu ý:** App có thể chạy **không cần Supabase** bằng mock data. Chỉ cần chạy `npm run dev` mà không cần cấu hình `.env`.

### 4. Thiết lập Supabase Database (tùy chọn)

```bash
# Mở Supabase Dashboard → SQL Editor
# Copy và chạy nội dung file supabase-schema.sql
```

Hoặc dùng Supabase CLI:
```bash
# Cài Supabase CLI
npm install -g supabase

# Login
supabase login

# Áp dụng schema
supabase db push
```

### 5. Tạo Storage Buckets (tùy chọn)

Trong Supabase Dashboard → Storage:
1. Tạo bucket `article-thumbnails` (Public)
2. Tạo bucket `avatars` (Public)

### 6. Khởi động máy chủ phát triển

```bash
npm run dev
```

App sẽ chạy tại: **http://localhost:5173/**

---

## 📦 Scripts

| Script | Command | Mô tả |
|--------|---------|-------|
| Dev server | `npm run dev` | Khởi động Vite dev server với HMR |
| Build | `npm run build` | Build production bundle |
| Preview | `npm run preview` | Preview production build locally |
| Type check | `npx tsc --noEmit` | Kiểm tra TypeScript errors |

---

## 🌐 Biến Môi Trường

| Biến | Bắt buộc | Mô tả | Ví dụ |
|------|----------|-------|-------|
| `VITE_SUPABASE_URL` | Không* | Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Không* | Supabase anonymous API key | `eyJhbGciOiJIUzI1NiIs...` |

> *Không bắt buộc vì app có mock data fallback. Bắt buộc nếu muốn dùng auth, database, và storage thật.

---

## 📂 Cấu Trúc Dự Án

```
pdspyse-blog-react/
├── public/                  # Static assets
├── src/
│   ├── components/          # Shared UI components
│   │   ├── Header.tsx       # Glassmorphism navigation bar
│   │   ├── Footer.tsx       # Site footer
│   │   ├── ArticleCard.tsx  # Blog card with hover effects
│   │   ├── SearchBar.tsx    # Debounced search input
│   │   ├── CategoryFilter.tsx # Tag cloud filter
│   │   ├── Pagination.tsx   # Page navigation
│   │   ├── ConfirmDialog.tsx # Delete confirmation modal
│   │   ├── LoadingSpinner.tsx # Multi-ring spinner
│   │   └── ProtectedRoute.tsx # Auth route guard
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state provider
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client initialization
│   │   └── mockData.ts     # Mock articles & categories
│   ├── pages/
│   │   ├── HomePage.tsx     # Public article listing
│   │   ├── ArticleDetailPage.tsx # Full article view
│   │   ├── LoginPage.tsx    # Admin login
│   │   ├── RegisterPage.tsx # Admin registration
│   │   └── admin/
│   │       ├── AdminLayout.tsx     # Sidebar layout
│   │       ├── DashboardPage.tsx   # Stats overview
│   │       ├── ArticleListPage.tsx # Article management (publish/draft toggle)
│   │       ├── CreateArticlePage.tsx # New article form (publish or save as draft)
│   │       ├── EditArticlePage.tsx   # Edit article form (draft/publish toggle)
│   │       ├── CategoryListPage.tsx # Category CRUD (inline add/edit/delete)
│   │       └── ProfilePage.tsx     # Profile settings
│   ├── services/
│   │   ├── articleService.ts  # Article CRUD (with draft/publish support)
│   │   ├── categoryService.ts # Category CRUD (get, create, update, delete)
│   │   ├── storageService.ts  # File upload operations
│   │   └── profileService.ts  # Profile operations
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx              # Route definitions
│   ├── main.tsx             # React entry point
│   └── index.css            # Design system & global styles
├── docs/                    # Documentation
├── supabase-schema.sql      # Database schema reference
├── .env.example             # Environment template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies & scripts
```

---

## 🎨 Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6
- **Styling:** Vanilla CSS with Custom Properties, Google Fonts (Quicksand, Poppins)
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Forms:** react-hook-form
- **Routing:** react-router-dom v7
- **PWA:** vite-plugin-pwa + Workbox
