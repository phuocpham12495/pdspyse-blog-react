# 🧪 Kế Hoạch Kiểm Thử – Pdspyse Blog React
> **Vai trò:** Kiến Trúc Sư QA

---

## 1. Unit Test Templates

### 1.1 Article Service Tests
```typescript
// src/services/__tests__/articleService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getArticles, getArticleBySlug } from '../articleService';

describe('articleService', () => {
  describe('getArticles (mock mode)', () => {
    it('should return paginated articles', async () => {
      const result = await getArticles(1);
      expect(result.data).toHaveLength(6); // PAGE_SIZE
      expect(result.page).toBe(1);
      expect(result.totalPages).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const result = await getArticles(1, 'cat-1');
      result.data.forEach(article => {
        expect(article.category_id).toBe('cat-1');
      });
    });

    it('should search by title keyword', async () => {
      const result = await getArticles(1, undefined, 'React');
      result.data.forEach(article => {
        const matchesTitle = article.title.toLowerCase().includes('react');
        const matchesContent = article.content.toLowerCase().includes('react');
        expect(matchesTitle || matchesContent).toBe(true);
      });
    });

    it('should return empty for non-matching search', async () => {
      const result = await getArticles(1, undefined, 'xyz123abc');
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('getArticleBySlug (mock mode)', () => {
    it('should return article by slug', async () => {
      const article = await getArticleBySlug('getting-started-with-react-19-whats-new');
      expect(article).not.toBeNull();
      expect(article?.title).toContain('React 19');
    });

    it('should return null for non-existent slug', async () => {
      const article = await getArticleBySlug('non-existent-article');
      expect(article).toBeNull();
    });
  });
});
```

### 1.2 Storage Service Tests
```typescript
// src/services/__tests__/storageService.test.ts
import { describe, it, expect } from 'vitest';
import { validateFile } from '../storageService';

describe('storageService', () => {
  describe('validateFile', () => {
    it('should accept valid JPEG file', () => {
      const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      expect(validateFile(file)).toBeNull();
    });

    it('should reject invalid file type', () => {
      const file = new File(['test'], 'doc.pdf', { type: 'application/pdf' });
      expect(validateFile(file)).toContain('Invalid file type');
    });

    it('should reject oversized file', () => {
      const file = new File(['test'], 'big.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB
      expect(validateFile(file)).toContain('exceeds');
    });
  });
});
```

### 1.3 Auth Context Tests
```typescript
// src/contexts/__tests__/AuthContext.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

describe('AuthContext', () => {
  it('should provide auth context values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBeDefined();
    expect(result.current.signIn).toBeInstanceOf(Function);
    expect(result.current.signUp).toBeInstanceOf(Function);
    expect(result.current.signOut).toBeInstanceOf(Function);
  });
});
```

---

### 1.4 Category Service Tests
```typescript
// src/services/__tests__/categoryService.test.ts
import { describe, it, expect } from 'vitest';
import { getCategories } from '../categoryService';

describe('categoryService', () => {
  describe('getCategories (mock mode)', () => {
    it('should return categories sorted by name', async () => {
      const categories = await getCategories();
      expect(categories.length).toBeGreaterThan(0);
      const names = categories.map(c => c.name);
      expect(names).toEqual([...names].sort());
    });

    it('should have unique slugs', async () => {
      const categories = await getCategories();
      const slugs = categories.map(c => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });
  });
});
```

---

## 2. Integration Test Scenarios

| ID | Kịch bản | Module liên quan | Mức ưu tiên |
|----|----------|------------------|-------------|
| INT-001 | Browse → Search → Filter → Paginate trên homepage | HomePage + Services | P0 |
| INT-002 | Login → Redirect to dashboard | Auth + Router | P0 |
| INT-003 | Create article → Verify on public homepage | Admin CRUD + Public | P0 |
| INT-004 | Edit article → Verify changes reflect publicly | Admin CRUD + Public | P0 |
| INT-005 | Delete article → Confirm dialog → Verify removed | Admin CRUD + Dialog | P0 |
| INT-006 | Upload thumbnail → Preview → Save → Display | Storage + Forms | P1 |
| INT-007 | Update profile → Verify changes persist | Profile + Auth | P1 |
| INT-008 | Protected route → Redirect unauthenticated user | ProtectedRoute + Router | P0 |
| INT-009 | Create category → Verify in category list + article form | Category CRUD | P0 |
| INT-010 | Edit category → Verify slug updates, name changes | Category CRUD | P1 |
| INT-011 | Delete category → Confirm → Verify articles uncategorized | Category CRUD + Dialog | P1 |
| INT-012 | Create article as draft → Verify NOT on homepage | Draft + Public | P0 |
| INT-013 | Toggle article published → Verify appears on homepage | Draft + Public | P0 |
| INT-014 | Toggle article to draft → Verify removed from homepage | Draft + Public | P0 |

---

## 3. E2E Test Flows

### Flow 1: Public User Journey (TC-001 → TC-016)
```
1. Open homepage → Verify article list displays (TC-001)
2. Verify cards show thumbnail, title, category (TC-002)
3. Use search bar → Search "React" → Verify filtered results (TC-008)
4. Clear search → Verify all articles return (TC-011)
5. Select "Technology" category → Verify filter (TC-014)
6. Click "All" → Verify reset (TC-016)
7. Click article card → Navigate to detail page (TC-004)
8. Verify title, content, thumbnail, date on detail page (TC-005)
9. Click "Back to articles" → Return to homepage
```

### Flow 2: Admin Authentication (TC-017 → TC-021)
```
1. Navigate to /register → Fill form → Submit (TC-017)
2. Navigate to /login → Enter credentials → Submit (TC-018)
3. Verify redirect to /admin dashboard (TC-020)
4. Try invalid credentials → Verify error message (TC-019)
5. Try accessing /admin without login → Verify redirect (TC-025)
```

### Flow 3: Article CRUD (TC-022 → TC-036)
```
1. Login as admin → Go to dashboard
2. Click "Create New Article" → Fill form → Click "Save as Draft" (TC-023)
3. Verify article in admin list with "Draft" status (TC-027)
4. Open public homepage → Verify draft NOT visible (NEW)
5. Go to article list → Click "Publish" toggle → Verify status changes to Published
6. Open public homepage → Verify article now visible (TC-024)
7. Edit article → Change title & content → Click "Switch to Draft" → Save (TC-028)
8. Verify article hidden from public page (NEW)
9. Click "Switch to Published" → Save → Verify visible again (TC-031)
10. Delete article → Confirm dialog → Delete (TC-033)
11. Verify article removed from public page (TC-034)
12. Cancel delete → Verify article persists (TC-035)
```

### Flow 4: Category CRUD
```
1. Login as admin → Go to /admin/categories
2. Verify existing categories displayed in table
3. Enter new category name → Click "Add" → Verify appears in table
4. Click "Edit" on category → Change name → Press Enter → Verify updated
5. Click "Delete" → Confirm dialog → Verify removed from table
6. Go to Create Article → Verify new category appears in dropdown
7. Delete category that has articles → Verify articles become "Uncategorized"
```

### Flow 5: Responsive Design (TC-048 → TC-051)
```
1. Open homepage on desktop (1920px) → Verify 3-column grid
2. Resize to tablet (768px) → Verify 2-column grid
3. Resize to mobile (375px) → Verify 1-column grid
4. Verify hamburger menu appears on mobile
5. Verify all buttons are tappable (44px minimum)
```

---

## 4. CI/CD Pipeline Config

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run build

  deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      # Deploy to Vercel/Netlify (configure accordingly)
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```
