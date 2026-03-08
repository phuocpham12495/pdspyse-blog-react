# 📋 Nhật Ký Xây Dựng – Pdspyse Blog React
> **Vai trò:** Người Quan Sát Xây Dựng

---

## Bước 1: Khởi tạo cấu trúc dự án
**Thời gian:** 2026-03-07T12:05:26+07:00
**Hành động:** Tạo scaffold dự án thủ công (Vite interactive bị từ chối do thư mục có sẵn file)
**Quyết định:** Tạo `package.json`, `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`, `vite-env.d.ts` thủ công
**Lý do:** Thư mục đã có file spec (user-stories.md, technical-specs.md, test-cases.md), nên `create-vite` interactive bị lỗi → chuyển sang tạo thủ công để kiểm soát hoàn toàn

---

## Bước 2: Thiết lập Design System
**Thời gian:** 2026-03-07T12:07:30+07:00
**Hành động:** Tạo `src/index.css` với toàn bộ CSS custom properties
**Quyết định:**
- Color palette: Pastel violet (#a78bfa) → lavender, peach accent, mint secondary
- Typography: Quicksand (display) + Poppins (body) từ Google Fonts
- Dark mode hỗ trợ via `prefers-color-scheme`
- Animations: fadeIn, slideUp, slideDown, pulse, spin, float
**Lý do:** Technical specs yêu cầu "cute and cool" aesthetic → chọn pastel colors + rounded fonts

---

## Bước 3: Tạo Types & Supabase Client
**Thời gian:** 2026-03-07T12:08:00+07:00
**Hành động:** Tạo `src/types/index.ts`, `src/lib/supabase.ts`, `src/lib/mockData.ts`
**Quyết định:** Sử dụng mock data fallback khi Supabase chưa được cấu hình
**Lý do:** Cho phép phát triển và demo ngay lập tức mà không cần Supabase project

---

## Bước 4: Xây dựng Service Layer
**Thời gian:** 2026-03-07T12:09:00+07:00
**Hành động:** Tạo 4 service files: `articleService.ts`, `categoryService.ts`, `storageService.ts`, `profileService.ts`
**Quyết định:**
- Mỗi service có dual mode: Supabase (production) + Mock (development)
- File validation: max 5MB, chỉ JPEG/PNG/WebP/GIF
- Pagination: 6 articles per page
**Lý do:** Tách biệt data layer khỏi UI components → dễ test và maintain

---

## Bước 5: Tạo Authentication Context
**Thời gian:** 2026-03-07T12:10:00+07:00
**Hành động:** Tạo `AuthContext.tsx` + `ProtectedRoute.tsx`
**Quyết định:** Sử dụng React Context API thay vì Zustand/Redux
**Lý do:** Auth state đơn giản (user, session, loading) → Context API đủ dùng, không cần thêm dependency

---

## Bước 6: Xây dựng Shared Components
**Thời gian:** 2026-03-07T12:11:00+07:00
**Hành động:** Tạo 8 components: Header, Footer, ArticleCard, SearchBar, CategoryFilter, Pagination, ConfirmDialog, LoadingSpinner
**Quyết định:**
- Header: Glassmorphism backdrop-filter + hamburger menu cho mobile
- SearchBar: Debounce 350ms để giảm re-render
- CategoryFilter: Tag cloud horizontal layout
- ArticleCard: Image zoom on hover + text clamping
**Lý do:** Component-driven architecture → reusable, testable

---

## Bước 7: Tạo Public Pages
**Thời gian:** 2026-03-07T12:13:00+07:00
**Hành động:** Tạo `HomePage.tsx`, `ArticleDetailPage.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`
**Quyết định:**
- Homepage: Hero section + search + filter + paginated grid (3→2→1 columns responsive)
- ArticleDetail: Banner with gradient overlay + rich HTML rendering via `dangerouslySetInnerHTML`
- Auth pages: react-hook-form validation, centered card layout
**Lý do:** User stories yêu cầu public browsing không cần login + admin login/register

---

## Bước 8: Tạo Admin Pages
**Thời gian:** 2026-03-07T12:15:00+07:00
**Hành động:** Tạo `AdminLayout.tsx`, `DashboardPage.tsx`, `ArticleListPage.tsx`, `CreateArticlePage.tsx`, `EditArticlePage.tsx`, `ProfilePage.tsx`
**Quyết định:**
- AdminLayout: Sidebar navigation + collapsible trên mobile (FAB toggle button)
- Dashboard: Stat cards + recent articles list
- Article management: Full CRUD with table view, thumbnail preview, confirmation dialog
**Lý do:** User stories yêu cầu admin dashboard với CRUD articles + profile management

---

## Bước 9: Assembling & Routing
**Thời gian:** 2026-03-07T12:17:00+07:00
**Hành động:** Tạo `main.tsx`, `App.tsx`, cấu hình routes
**Quyết định:** Nested routes cho admin (`/admin/*`) wrapped bởi `ProtectedRoute`
**Lý do:** Test cases TC-025, TC-032 yêu cầu admin routes redirect về login khi chưa đăng nhập

---

## Bước 10: Install, Build & Verify
**Thời gian:** 2026-03-07T12:19:00+07:00
**Hành động:** `npm install` → `npx tsc --noEmit` → `npm run build` → `npx vite --host`
**Kết quả:**
- TypeScript: 0 errors (sau fix `useRef` initial value trong SearchBar.tsx)
- Build: ✅ `built in 1.97s`
- Dev server: ✅ Running on `http://localhost:5173/`
- Browser verification: ✅ Homepage, ArticleDetail, LoginPage đều render đúng

---

## Bước 11: Thêm Category CRUD Admin Page
**Thời gian:** 2026-03-08T10:59:00+07:00
**Hành động:** Thêm `updateCategory()`, `deleteCategory()` vào `categoryService.ts`. Tạo `CategoryListPage.tsx` + `CategoryListPage.css`. Cập nhật route trong `App.tsx`, sidebar trong `AdminLayout.tsx`, và dashboard actions trong `DashboardPage.tsx`.
**Quyết định:** Thiết kế inline edit (click edit → input field → save/cancel) thay vì separate edit page
**Lý do:** Category chỉ có 1 field (name), không cần form riêng → inline edit UX tốt hơn

---

## Bước 12: Thêm Draft Article Support
**Thời gian:** 2026-03-08T11:00:00+07:00
**Hành động:** Cập nhật `createArticle()` và `updateArticle()` trong `articleService.ts` để chấp nhận `is_published` param. Thêm "Save as Draft" button vào `CreateArticlePage.tsx`. Thêm draft/publish toggle vào `EditArticlePage.tsx` và `ArticleListPage.tsx`.
**Quyết định:** Sử dụng `publishMode` state cho create form, `isPublished` state cho edit form
**Lý do:** DB schema đã có `is_published` column → chỉ cần expose tính năng ra UI mà không cần migration

---

## Bước 13: Xóa Footer Social Links
**Thời gian:** 2026-03-08T11:01:00+07:00
**Hành động:** Xóa `footer__links` div (GitHub, Twitter, Contact) khỏi `Footer.tsx`. Dọn dẹp CSS tương ứng trong `Footer.css`.
**Quyết định:** Xóa hoàn toàn thay vì ẩn
**Lý do:** Yêu cầu từ user, links không còn cần thiết

---

## Tổng kết
| Metric | Value |
|--------|-------|
| Tổng số files tạo mới | 35 files |
| Tổng số files cập nhật | 9 files |
| Tổng thời gian build | ~18 phút |
| TypeScript errors | 0 |
| Build time (production) | 1.97s |
| Pages created | 9 pages |
| Components created | 8 components |
| Services created | 4 services (categoryService mở rộng CRUD) |
