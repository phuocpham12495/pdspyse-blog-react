# Technical Specification: Antigravity Blog App (React + Supabase)

## 1. Introduction

This document outlines the technical architecture, design, and implementation details for a simple blog application, developed using React for the frontend UI, powered by Supabase as the backend-as-a-service, and leveraging Antigravity for UI components. The application is designed to be user-friendly with a "cute and cool" aesthetic, offering distinct experiences for public users and administrators, while adhering to modern web standards such as Responsive Web Design (RWD) and Progressive Web App (PWA) capabilities.

## 2. Overall Architecture

The application adopts a client-server architecture. The frontend is a Single-Page Application (SPA) built with React, consuming services provided by Supabase.

*   **Frontend (Client-side):** React.js application using Antigravity UI components, responsible for rendering the user interface, handling user interactions, and communicating with the Supabase backend.
*   **Backend (Serverless / BaaS):** Supabase provides a comprehensive set of backend services including:
    *   **PostgreSQL Database:** For structured data storage (articles, categories, users, profiles).
    *   **Authentication:** User registration, login, and session management.
    *   **Storage:** For hosting user-uploaded assets like article thumbnails.
    *   **Realtime (Optional):** Potential for instant content updates or notifications.

## 3. Frontend Specification (React with Antigravity)

### 3.1. Core Technologies

*   **Framework:** React.js (latest stable version)
*   **UI Library:** Antigravity (Ant Design variant or custom components adhering to the Antigravity design principles).
*   **Language:** TypeScript (recommended for type safety and maintainability)
*   **Routing:** React Router DOM
*   **State Management:** React Context API for global state (e.g., authentication status, user profile), local component state for forms and UI elements. Alternatively, a lightweight solution like Zustand or Jotai could be considered for more complex state needs.
*   **Data Fetching:** Supabase JS client library for all backend interactions.
*   **Form Handling:** React Hook Form for efficient and performant form management with validation.
*   **Styling:** Tailwind CSS or Styled Components for custom styles, combined with Antigravity's built-in styling, ensuring adherence to the "pastel, round font, cute and cool" design concept.

### 3.2. UI/UX Design Principles

*   **Aesthetics:** Bright pastel colors, rounded fonts (e.g., Poppins, Quicksand, or a custom rounded font), large and easily clickable buttons.
*   **Usability:** Intuitive navigation, clear content presentation, minimal clutter.
*   **Accessibility:** Adherence to WCAG guidelines where possible, ensuring good contrast and keyboard navigability.

### 3.3. Key Frontend Modules & Features

#### 3.3.1. Public User Interface

*   **Homepage:**
    *   Displays a paginated list of articles.
    *   Each article card includes a thumbnail, title, and category tag.
    *   Search bar for keywords (title, content).
    *   Category filter (dropdown or tag cloud).
    *   Responsive layout for various screen sizes.
*   **Article Detail Page:**
    *   Displays full article content, title, thumbnail, author (optional), and publication date.
    *   Uses a rich text renderer for article content.
*   **Navigation:**
    *   Simple header with blog title and potentially a link to Admin login (if applicable for anonymous users).

#### 3.3.2. Admin User Interface (Authenticated)

*   **Login/Registration Page:**
    *   Dedicated forms for user registration and login using email and password.
    *   Password reset functionality.
    *   Supabase Auth integration.
*   **Admin Dashboard:**
    *   Overview of articles (list, perhaps with draft/published status).
    *   Navigation to create, edit, or delete articles.
*   **Article Management Forms:**
    *   **Create Article:** Form with fields for `title`, `content` (rich text editor, e.g., Tiptap, Quill, or basic textarea), `category` (dropdown from Supabase table), and `thumbnail_upload` (image input).
    *   **Edit Article:** Pre-populated form identical to create form, allowing updates.
*   **Profile Settings Page:**
    *   Form to view/edit user `avatar`, `email`, `date_of_birth`.
    *   Integration with Supabase Auth user metadata and Supabase Storage for avatar uploads.

#### 3.3.3. Common Features

*   **User Authentication & Authorization:**
    *   Implement client-side routing guards to protect admin routes.
    *   Display/hide UI elements based on user authentication status and role (e.g., Admin dashboard link).
*   **Responsive Web Design (RWD):**
    *   Utilize CSS Grid/Flexbox and media queries.
    *   Adopt a "Mobile First" design approach, ensuring core functionality is optimal on smallest screens, then progressively enhancing for larger viewports.
    *   Antigravity components should inherently support responsiveness.
*   **Progressive Web App (PWA) Capabilities:**
    *   **Web App Manifest:** Create a `manifest.json` file to enable "Add to Home Screen" functionality, define app icon, splash screen, and display mode.
    *   **Service Worker:** Implement a service worker for:
        *   **Caching Strategy:** Cache static assets (JS, CSS, images) for faster loading on subsequent visits. Implement a "cache-first" or "stale-while-revalidate" strategy.
        *   **Offline Support:** Cache critical API responses (e.g., article list, recently viewed articles) to provide limited offline browsing capabilities (app shell + cached data).
        *   **Push Notifications (Future Consideration):** Integrate with a push notification service (potentially Supabase Edge Functions + Web Push API) for sending alerts to users.
*   **Image Handling:**
    *   Client-side image preview before upload.
    *   Basic client-side validation for file type and size.

## 4. Backend Specification (Supabase)

### 4.1. Core Services

*   **Database:** PostgreSQL (managed by Supabase).
*   **Authentication:** Supabase Auth (Email/Password authentication).
*   **Storage:** Supabase Storage for binary file uploads (e.g., article thumbnails, user avatars).

### 4.2. Database Schema

*   **`profiles` Table:**
    *   `id` (UUID, PK, FK to `auth.users.id`)
    *   `email` (Text, unique, from `auth.users`)
    *   `avatar_url` (Text, optional)
    *   `date_of_birth` (Date, optional)
    *   `role` (Enum/Text: 'admin', 'user' - for authorization beyond `auth.users` table, if needed, or simply check against `auth.uid()` for admin specific records in another table).
    *   `created_at` (Timestamp with timezone, default NOW())
    *   `updated_at` (Timestamp with timezone, default NOW())
*   **`categories` Table:**
    *   `id` (UUID, PK)
    *   `name` (Text, unique)
    *   `slug` (Text, unique, generated from name)
    *   `created_at` (Timestamp with timezone, default NOW())
*   **`articles` Table:**
    *   `id` (UUID, PK)
    *   `title` (Text)
    *   `slug` (Text, unique, generated from title)
    *   `content` (Text, supporting rich text markup)
    *   `thumbnail_url` (Text, URL to Supabase Storage)
    *   `category_id` (UUID, FK to `categories.id`)
    *   `author_id` (UUID, FK to `profiles.id`)
    *   `is_published` (Boolean, default TRUE)
    *   `created_at` (Timestamp with timezone, default NOW())
    *   `updated_at` (Timestamp with timezone, default NOW())

### 4.3. Supabase Configuration & Policies

*   **Row Level Security (RLS):**
    *   **`profiles`:**
        *   `SELECT`: Policy allowing all authenticated users to read their own profile, and admins to read all profiles.
        *   `INSERT`, `UPDATE`, `DELETE`: Policy allowing a user to manage their own profile, and admins to manage all profiles.
    *   **`categories`:**
        *   `SELECT`: Policy allowing all users (authenticated and anonymous) to read categories.
        *   `INSERT`, `UPDATE`, `DELETE`: Policy allowing only authenticated `admin` users to manage categories.
    *   **`articles`:**
        *   `SELECT`: Policy allowing all users (authenticated and anonymous) to read `is_published = TRUE` articles.
        *   `INSERT`, `UPDATE`, `DELETE`: Policy allowing only authenticated `admin` users to manage articles.
*   **Supabase Storage:**
    *   **Buckets:** One bucket for `article-thumbnails`, another for `avatars`.
    *   **Storage Policies:** Define policies to allow public read access for thumbnails/avatars, but only authenticated admin write access for thumbnails, and individual user write access for their own avatar.

### 4.4. Authentication & Authorization

*   **Supabase Auth:** Leveraged for user registration, login, logout, and session management using JWTs.
*   **Admin Role:** The `profiles` table will include a `role` column or a separate `admin_users` table will store admin `user_id`s. RLS policies will utilize `auth.uid()` and custom checks against this role to grant administrative privileges.
*   **Client-Side Security:** JWTs are stored securely (e.g., in `localStorage` by Supabase JS client) and automatically sent with requests.

## 5. Security Considerations

*   **API Key Management:** Supabase `anon` key is safe for client-side use. The `service_role` key (if used for server-side operations via Edge Functions or custom backend) must **never** be exposed in the frontend or committed to source control (Github). Use environment variables for all sensitive keys.
*   **Row Level Security (RLS):** Crucial for ensuring data security at the database level. Properly configured RLS policies prevent unauthorized access or modification of data, even if frontend checks are bypassed.
*   **Input Validation:** Implement validation on both the frontend (for a better user experience) and the backend (Supabase functions/triggers or RLS policies) to prevent malicious input and ensure data integrity.
*   **CORS:** Supabase handles CORS for its services. Frontend application needs to be mindful of its own CORS configuration if deployed separately from Supabase.
*   **Rate Limiting:** Supabase provides rate limiting out of the box. Custom rate limits may be considered for specific endpoints (e.g., login attempts) if using Supabase Edge Functions.

## 6. Development & Deployment

### 6.1. Development Environment

*   **Local Setup:** Node.js, npm/yarn, Git.
*   **IDE:** Visual Studio Code with relevant extensions (e.g., ESLint, Prettier, Supabase).
*   **Supabase CLI (Optional but Recommended):** For local Supabase development, schema migrations, and managing database state.

### 6.2. Deployment Strategy

*   **Frontend:**
    *   Deployment to a static hosting provider like **Vercel** or **Netlify**.
    *   Continuous Integration/Continuous Deployment (CI/CD) setup to automatically build and deploy from a Git repository (e.g., GitHub).
*   **Backend:**
    *   Supabase manages its own infrastructure, offering scalable and secure hosting for the database, authentication, and storage services.
    *   Database migrations managed through Supabase dashboard or CLI.

## 7. Future Enhancements

*   **Rich Text Editor:** Implement a robust rich text editor (e.g., Tiptap, Quill, Draft.js) for `article.content`.
*   **Comments Section:** Allow users to comment on articles, potentially with nested replies.
*   **Like/Share Functionality:** Add social interaction features.
*   **Search Engine Optimization (SEO):** Implement meta tags, sitemaps, and server-side rendering (SSR) or static site generation (SSG) if the blog requires advanced SEO beyond basic PWA capabilities.
*   **Advanced PWA:** Deeper offline capabilities, background sync.
*   **Analytics:** Integrate with Google Analytics or a similar service.
*   **Email Notifications:** For password resets, new user registrations, etc., possibly using Supabase Edge Functions and a third-party email service.
