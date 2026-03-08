# 📡 API Reference – Pdspyse Blog React
> **Vai trò:** Người Viết Kỹ Thuật

---

## Supabase Client Services

Tất cả API calls được thực hiện qua Supabase JS Client (`@supabase/supabase-js`). Dưới đây là tài liệu cho service layer.

---

## 1. Article Service (`src/services/articleService.ts`)

### `getArticles(page, categoryId?, search?)`

| Property | Value |
|---|---|
| **Method** | Supabase `SELECT` with `range()` |
| **Table** | `articles` JOIN `categories` |
| **Auth Required** | ❌ No |

**Parameters:**
```typescript
interface GetArticlesParams {
  page: number;          // 1-indexed page number
  categoryId?: string;   // UUID – filter by category
  search?: string;       // Keyword – searches title + content (ilike)
}
```

**Response:**
```typescript
interface PaginatedResult<Article> {
  data: Article[];       // Articles for current page
  total: number;         // Total matching articles
  page: number;          // Current page
  pageSize: number;      // Items per page (6)
  totalPages: number;    // Total pages
}
```

**Error Codes:**
| Code | Description |
|------|-------------|
| `PGRST116` | No rows returned (empty result, not an error) |
| `42501` | RLS policy violation |

---

### `getArticleBySlug(slug)`

| Property | Value |
|---|---|
| **Method** | Supabase `SELECT` with `.single()` |
| **Table** | `articles` JOIN `categories` |
| **Auth Required** | ❌ No |

**Parameters:** `slug: string`
**Response:** `Article | null`

---

### `createArticle(article)`

| Property | Value |
|---|---|
| **Method** | Supabase `INSERT` |
| **Table** | `articles` |
| **Auth Required** | ✅ Admin only |

**Request:**
```typescript
interface CreateArticleRequest {
  title: string;           // Required
  content: string;         // Required, supports HTML
  category_id: string;     // Required, UUID referencing categories.id
  thumbnail_url: string;   // URL from storage upload
  author_id: string;       // UUID from auth.users.id
  is_published?: boolean;  // Optional, defaults to true. Set false to save as draft.
}
```

**Response:** `Article` (created article with generated slug)

---

### `updateArticle(id, updates)`

| Property | Value |
|---|---|
| **Method** | Supabase `UPDATE` |
| **Table** | `articles` |
| **Auth Required** | ✅ Admin only |

**Parameters:**
```typescript
id: string;  // Article UUID
updates: Partial<{
  title: string;
  content: string;
  category_id: string;
  thumbnail_url: string;
  is_published: boolean;   // Toggle draft/published status
}>
```

---

### `deleteArticle(id)`

| Property | Value |
|---|---|
| **Method** | Supabase `DELETE` |
| **Table** | `articles` |
| **Auth Required** | ✅ Admin only |

**Parameters:** `id: string` (Article UUID)
**Response:** `void`

---

## 2. Category Service (`src/services/categoryService.ts`)

### `getCategories()`

| Property | Value |
|---|---|
| **Method** | Supabase `SELECT` ordered by name ASC |
| **Table** | `categories` |
| **Auth Required** | ❌ No |

**Response:** `Category[]`

### `createCategory(name)`

| Property | Value |
|---|---|
| **Method** | Supabase `INSERT` |
| **Table** | `categories` |
| **Auth Required** | ✅ Admin only |

**Parameters:** `name: string` — Category name (slug auto-generated)
**Response:** `Category`

### `updateCategory(id, name)`

| Property | Value |
|---|---|
| **Method** | Supabase `UPDATE` |
| **Table** | `categories` |
| **Auth Required** | ✅ Admin only |

**Parameters:** `id: string` (Category UUID), `name: string` (new name, slug auto-regenerated)
**Response:** `Category`

### `deleteCategory(id)`

| Property | Value |
|---|---|
| **Method** | Supabase `DELETE` |
| **Table** | `categories` |
| **Auth Required** | ✅ Admin only |

**Parameters:** `id: string` (Category UUID)
**Response:** `void`

> **Lưu ý:** Xóa category sẽ set `category_id = NULL` trên articles thuộc category đó (ON DELETE SET NULL).

---

## 3. Storage Service (`src/services/storageService.ts`)

### `uploadThumbnail(file)`

| Property | Value |
|---|---|
| **Method** | Supabase Storage `upload` |
| **Bucket** | `article-thumbnails` |
| **Auth Required** | ✅ Admin only |

**Validation:**
| Rule | Value |
|------|-------|
| Max file size | 5 MB |
| Allowed types | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |

**Response:**
```typescript
interface UploadResult {
  url: string;   // Public URL of uploaded file
  path: string;  // Storage path (thumbnails/{timestamp}-{random}.ext)
}
```

### `uploadAvatar(file, userId)`

| Property | Value |
|---|---|
| **Method** | Supabase Storage `upload` (upsert) |
| **Bucket** | `avatars` |
| **Auth Required** | ✅ Owner only |

---

## 4. Profile Service (`src/services/profileService.ts`)

### `getProfile(userId)`

| Property | Value |
|---|---|
| **Method** | Supabase `SELECT` with `.single()` |
| **Table** | `profiles` |
| **Auth Required** | ✅ Authenticated |

**Response:** `Profile | null`

### `updateProfile(userId, updates)`

| Property | Value |
|---|---|
| **Method** | Supabase `UPDATE` |
| **Table** | `profiles` |
| **Auth Required** | ✅ Owner only |

**Parameters:**
```typescript
updates: Partial<{
  avatar_url: string;
  email: string;
  date_of_birth: string;  // ISO date format: "YYYY-MM-DD"
}>
```

---

## 5. TypeScript Interfaces

```typescript
// src/types/index.ts

interface Category {
  id: string;          // UUID
  name: string;        // "Technology"
  slug: string;        // "technology"
  created_at: string;  // ISO timestamp
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;         // HTML content
  thumbnail_url: string;
  category_id: string;     // FK → categories.id
  author_id: string;       // FK → profiles.id
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;     // Joined field
}

interface Profile {
  id: string;              // FK → auth.users.id
  email: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}
```

---

## 6. Authentication (Supabase Auth)

### Sign In
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email: string,
  password: string  // Min 6 characters
});
```

### Sign Up
```typescript
const { error } = await supabase.auth.signUp({
  email: string,
  password: string
});
```

### Sign Out
```typescript
await supabase.auth.signOut();
```

### Auth State Listener
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  // event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED'
});
```
