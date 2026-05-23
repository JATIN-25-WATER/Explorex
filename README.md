<div align="center">

# 🌍 ExploreX

**A mobile-first place discovery platform powered by geospatial intelligence**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+PostGIS-336791?logo=postgresql)](https://postgis.net)
[![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> Discover restaurants, cafés, hidden gems, and local experiences — scored and ranked in real-time based on your location, preferences, and crowd behaviour.

[Live Demo](#) · [Report Bug](https://github.com/JATIN-25-WATER/Explorex/issues) · [Request Feature](https://github.com/JATIN-25-WATER/Explorex/issues)

</div>

---

## 📖 About

ExploreX is a full-stack, production-grade place discovery app built with a **TikTok-style vertical feed** for mobile. Every card in the feed is ranked by a multi-signal scoring algorithm that weighs distance, rating, engagement, and trending score in real time.

The goal was to build something that feels as smooth and intuitive as a consumer app, while demonstrating solid backend engineering — geospatial queries, keyset pagination, Redis impression buffering, and a clean layered architecture.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 📍 **Geospatial Feed** | Places ranked by proximity + multi-signal score using PostGIS geography types |
| 🧠 **Scoring Algorithm** | Composite score: 35% distance · 20% rating · 20% engagement · 15% trending |
| ♾️ **Infinite Scroll** | Keyset cursor pagination — no offset drift, O(1) DB seek |
| 👁️ **Impression Tracking** | IntersectionObserver fires after 1.5s sustained visibility; batched to Redis → Postgres |
| 🏷️ **Category Filtering** | Filter feed by category (Food, Art, Nature, etc.) with animated pill UI |
| 🗺️ **Place Detail Page** | Full detail view with cover image, tags, address, rating, and distance |
| 🔙 **Smart Navigation** | Client-side routing with `useRouter` — back button preserves scroll state |
| 📱 **Mobile-First UI** | 100dvh cards, glassmorphic overlays, dark theme, smooth CSS animations |
| ⚡ **Redis Buffering** | Impression counts hit Redis first; Postgres updated in batches (no hot-row contention) |

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15** (App Router, `'use client'` components)
- **TypeScript 5** — strict mode throughout
- **CSS Modules** — scoped, zero-runtime styling
- **Lucide React** — icon set
- **IntersectionObserver API** — impression tracking & load-more trigger

### Backend
- **Node.js + Express** — REST API
- **TypeScript** — fully typed services and routes
- **PostgreSQL 16** — primary datastore
- **PostGIS 3** — `ST_DWithin`, `ST_Distance`, `ST_MakePoint` for geospatial queries
- **Redis 7** — impression buffering, future caching layer

### Infrastructure
- **Docker + Docker Compose** — one-command local stack
- **tsx watch** — hot-reload TypeScript backend in dev

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│  Next.js 15 (App Router)                                │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  FeedClient│  │  PlaceCard   │  │  PlaceDetail    │ │
│  │  (scroll)  │→ │  (card UI)   │→ │  /places/[id]   │ │
│  └────────────┘  └──────────────┘  └─────────────────┘ │
│         │                │                              │
│    IntersectionObserver  └── router.push(/places/:id)   │
└──────────────┬──────────────────────────────────────────┘
               │  HTTP (REST)
┌──────────────▼──────────────────────────────────────────┐
│                      API SERVER                         │
│  Express + TypeScript                                   │
│  ┌───────────────────┐  ┌──────────────────────────┐   │
│  │ GET /v1/feed      │  │ GET /v1/places/:id        │   │
│  │  - geo filter     │  │  - place + media + tags   │   │
│  │  - score & rank   │  └──────────────────────────┘   │
│  │  - cursor paginate│  ┌──────────────────────────┐   │
│  └───────────────────┘  │ POST /v1/feed/impression  │   │
│                         │  - hincrby in Redis       │   │
│  feedService.ts         └──────────────────────────┘   │
└──────────┬──────────────────────────────────────────────┘
           │
     ┌─────┴──────┐
     │            │
┌────▼────┐  ┌────▼────┐
│Postgres │  │  Redis  │
│16+PostGIS│  │  7      │
│         │  │         │
│ places  │  │impress. │
│ media   │  │pending  │
│ tags    │  │hash     │
│ cats.   │  └─────────┘
└─────────┘
```

### Scoring Formula

```
score =
  0.35 × (1 − distance / radius)     ← closer = better
+ 0.20 × (avg_rating − 1) / 4        ← 1–5 star normalised
+ 0.20 × ln(1 + engagement) / 10     ← log-dampened engagement
+ 0.15 × min(1, trending_score/1000) ← trending cap
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 20
- Docker Desktop
- Git

### 1. Clone the repo
```bash
git clone https://github.com/JATIN-25-WATER/Explorex.git
cd Explorex
```

### 2. Start infrastructure (Postgres + Redis)
```bash
docker compose up -d
```

> This spins up PostgreSQL 16 with PostGIS and Redis 7.

### 3. Set up the backend
```bash
cd backend
cp .env.example .env          # fill in DB credentials
npm install
npm run dev                   # starts on http://localhost:4000
```

**Backend `.env`**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/explorex
REDIS_URL=redis://localhost:6379
PORT=4000
```

### 4. Set up the frontend
```bash
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev                   # starts on http://localhost:3000
```

**Frontend `.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 5. Seed the database
```bash
cd backend
npm run db:seed               # seeds categories, places, tags, and media
```

### 6. Open the app
```
http://localhost:3000
```

---

## 📁 Project Structure

```
Explorex/
├── backend/
│   └── src/
│       ├── db/
│       │   ├── pool.ts            # pg connection pool
│       │   └── redis.ts           # ioredis client
│       ├── routes/
│       │   ├── feed.ts            # GET /v1/feed
│       │   └── places.ts          # GET /v1/places/:id
│       ├── services/
│       │   └── feedService.ts     # scoring + pagination logic
│       └── index.ts               # Express app entry
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # Feed page (/)
│       │   ├── layout.tsx
│       │   └── places/[id]/
│       │       └── page.tsx       # Place detail page
│       ├── components/
│       │   ├── FeedClient.tsx     # Infinite scroll + observer
│       │   ├── PlaceCard.tsx      # Individual feed card
│       │   ├── PlaceCardSkeleton.tsx
│       │   ├── CategoryFilter.tsx
│       │   └── LocationBar.tsx
│       ├── lib/
│       │   └── api.ts             # fetchFeed, fetchPlace, logImpression
│       └── types/
│           └── index.ts           # Shared TypeScript interfaces
│
└── docker-compose.yml
```

---

## 📸 Screenshots

> _Screenshots coming soon — run locally to see the live UI_

| Feed View | Place Detail | Category Filter |
|-----------|-------------|-----------------|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## 🔌 API Reference

### `GET /v1/feed`
Returns a paginated, scored list of nearby places.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `lat` | float | required | Latitude |
| `lng` | float | required | Longitude |
| `radius` | int | 10 | Search radius in km |
| `limit` | int | 10 | Results per page |
| `cursor` | string | — | Opaque pagination token |
| `category` | string | — | Filter by category name |

**Response**
```json
{
  "places": [ { "id": "...", "name": "...", "score": 0.87, ... } ],
  "next_cursor": "base64encodedtoken"
}
```

### `GET /v1/places/:id`
Returns full detail for a single place including media and tags.

### `POST /v1/feed/impression`
Records a view impression (fire-and-forget, buffered in Redis).
```json
{ "place_id": "uuid" }
```

---

## 🧪 Development Notes

- **Cursor pagination**: cursors encode the last `score` as base64 — no `OFFSET` means stable results even as data changes.
- **Impression batching**: Redis `HINCRBY` accumulates counts; a background job (extendable) flushes to Postgres to avoid hot-row lock contention.
- **Type safety**: Both the backend service and frontend API client share the same `PlaceCard` interface shape — any backend schema change surfaces as a compile error.
- **Next.js 15 async params**: `params` is a `Promise<{ id: string }>` in the App Router — unwrapped client-side with `React.use(params)`.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Built with ❤️ by [Jatin Sharma](https://github.com/JATIN-25-WATER)

⭐ Star this repo if you found it useful!

</div>
