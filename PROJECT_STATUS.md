# ExploreX Project Status & File Manifest

This document outlines the purpose of every file in the **ExploreX** codebase, details the remaining development tasks to achieve the full project scope, and summarizes the fixes applied to resolve the errors from the IDE's "Problems" tab.

---

## 📁 File Manifest & Purposes

Here is the breakdown of every file in the project, categorized by sub-project.

### 🌐 Frontend (Next.js Application)
Located under the `frontend/` directory. It is built as a web-first MVP with mobile-first CSS.

| File Path | Purpose |
| :--- | :--- |
| `frontend/eslint.config.mjs` | **ESLint Flat Configuration**: Defines the linting rules for the project using the native ESLint 9 structure. |
| `frontend/next.config.js` | **Next.js Config**: Handles build configurations, webpack overrides, and core runtime parameters. |
| `frontend/tsconfig.json` | **TypeScript Compiler Configuration**: Configures compiler options (strict typing, module resolution, path aliases like `@/*`). |
| `frontend/src/app/layout.tsx` | **Root Layout**: Provides the base HTML wrapper, viewport tags, global font integration, and document metadata (Title, SEO tags). |
| `frontend/src/app/page.tsx` | **Root Page**: Entry point for the user-facing web route. Directly renders the `FeedClient` component. |
| `frontend/src/app/globals.css` | **Global Styles / Design System**: Defines HSL dark-theme color tokens, sleek gradients, typography, and custom scrollbar resets. |
| `frontend/src/components/FeedClient.tsx` | **Main Controller / Logic**: State manager for location, radius, category, loaded places, pagination cursor, and scroll/view impressions. |
| `frontend/src/components/FeedClient.module.css` | **Feed layout CSS**: Glassmorphic headers, layout grids, infinite scroll loading indicators, and retry/empty state animations. |
| `frontend/src/components/PlaceCard.tsx` | **Place Card Component**: Shows place cover image, name, category icon, star rating, tag list, distance, and description. |
| `frontend/src/components/PlaceCard.module.css` | **Place Card CSS**: Custom hover effects, image scaling transitions, tag pills styling, and rating alignment. |
| `frontend/src/components/PlaceCardSkeleton.tsx` | **Skeleton Loader**: Animated placeholder card displayed during data fetching. |
| `frontend/src/components/LocationBar.tsx` | **Location Controller**: UI header item displaying current location name and providing the radius configuration. |
| `frontend/src/components/CategoryFilter.tsx` | **Category Selector**: Horizontally scrollable capsule filter list to quickly scope feed results by category. |
| `frontend/src/lib/api.ts` | **API Service Client**: Simple helper utility to invoke backend routes (`/v1/feed` and `/v1/feed/impression`). |
| `frontend/src/types/index.ts` | **Global Interfaces**: Shared TypeScript models (`PlaceCard`, `UserLocation`). |

---

### ⚙️ Backend (Node.js + Express + TypeScript)
Located under the `backend/` directory. Operates as the API server for feed generation.

| File Path | Purpose |
| :--- | :--- |
| `backend/src/index.ts` | **Server Entrypoint**: Boots up the Express framework, configures middleware (CORS, JSON), connects to database engines, and exposes the `/health` endpoint. |
| `backend/src/db/pool.ts` | **Database Pool**: Singleton exporter for the PostgreSQL `pg` pool object. |
| `backend/src/db/redis.ts` | **Cache Client**: Singleton exporter for the `ioredis` instance. |
| `backend/src/db/init.sql` | **DB Schema Definition**: SQL file initializing schema tables (`categories`, `places`, `tags`, etc.) and spatial indexes (`GIST` on location). |
| `backend/src/db/seed.sql` | **Seed Data Script**: populates database tables with initial records (15 Mumbai spots, categories, image assets). |
| `backend/src/routes/feed.ts` | **Feed Router**: Maps `/v1/feed` and `/v1/feed/impression` requests to the core service layer. |
| `backend/src/routes/places.ts` | **Places Router**: Exposes endpoints to retrieve specific places by ID and perform simple text searches. |
| `backend/src/services/feedService.ts` | **Ranking & Core Algorithm**: Runs the PostGIS geographical distance calculation and calculates candidate ranking scores using distance, rating, user interests, and trending signals. |

---

## 🛠️ Problems Resolved in the "Problems" Tab

We identified and resolved **two core issues** preventing compilation and linting:

1. **ESLint 9 Flat Config Bug**
   - **Problem:** The legacy configuration file `frontend/.eslintrc.json` was throwing `TypeError: Converting circular structure to JSON` when scanned under ESLint v9 because of incompatibilities with the legacy parser wrapper.
   - **Resolution:** Replaced the legacy file with a modern `frontend/eslint.config.mjs` config file. Spanned the Next.js configs directly as Flat Config arrays, eliminating the circular references entirely.

2. **React Hooks Warning in `FeedClient.tsx`**
   - **Problem:** ESLint reported `react-hooks/set-state-in-effect` on line 58. Calling `loadFeed()` synchronously inside a `useEffect` triggers a state change right during the render/effects execution cycle, which causes cascading re-renders.
   - **Resolution:** Updated `useEffect` in `FeedClient.tsx` to defer execution to a microtask using `Promise.resolve().then()`. This prevents synchronous state updates during initial execution.

Both checks (`tsc` compile check and ESLint) now pass with **0 warnings and 0 errors**.

---

## 📈 Remaining Project Work

Following the original roadmap in `CONTEXT.md`, here is the breakdown of remaining work:

### Complete Roadmap Breakdown
* [x] **Step 1:** Docker Postgres/Redis setup, SQL Schemas, seed scripts, feed endpoint algorithms (100% Done)
* [x] **Step 2:** Next.js frontend feed UI, PlaceCard components, LocationBar controllers, dynamic category selectors (100% Done)
* [ ] **Step 3: Place Detail Page**
  * Create a page `/places/[id]` on the frontend to showcase all media assets in a gallery, detailed description, all category tags, and raw rating metrics.
* [ ] **Step 4: User Authentication**
  * **Backend:** Add users table to PostgreSQL, implement JWT login/registration, and authentication middleware.
  * **Frontend:** Create login/register dialogs and secure authenticated API headers.
* [ ] **Step 5: Interest Feature (Social)**
  * Allow users to bookmark/save interest marks on places. Add DB tables, backend toggle endpoint, and interest list tab.
* [ ] **Step 6: Review & Ratings**
  * Implement frontend rating form (interactive stars, comments) and backend review endpoints which update place `avg_rating` and `review_count`.
* [ ] **Step 7: Trending Feed Section**
  * Create a dedicated ranking dashboard/feed highlighting spots with high velocity rolling-period activity (views + reviews + interest saves).
* [ ] **Step 8: Instant Messaging**
  * Set up thread request system and establish raw WebSocket chat server for real-time messaging between users.
* [ ] **Step 9: Place Submission & Moderation Queue**
  * Establish user-facing submission form and moderator portal to approve/flag new places before they go live.
* [ ] **Step 10: Production Deployment**
  * Containerize frontend, backend, and configure target cloud hosting services (e.g., Render, AWS, Railway).

---

### Summary of Remaining Work Estimations
| Area | Modules | Complexity | Estimated Effort |
| :--- | :--- | :--- | :--- |
| **Social / Reviews** | Auth (JWT) + Interests + Place Details + Review System | Medium | ~3-4 Days |
| **Trending / Algorithms** | Real-time Redis impression counters flushing to DB + Trending Score Feed | Medium | ~2 Days |
| **Interactive Messaging** | WebSocket chat room + Inbox matching system | High | ~3 Days |
| **Moderation & Admin** | Approval queues + Content safety check workflows | Low | ~1.5 Days |
| **Deployment** | Docker Compose config validation + Cloud deployment scripts | Low | ~1 Day |
