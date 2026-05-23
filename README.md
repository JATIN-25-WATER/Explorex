# ExploreX

> Mobile-first place discovery — geospatial feed, smart impressions, real-time scoring.

Built with Next.js 15, Node.js/Express, PostgreSQL + PostGIS, and Redis. A full-stack app that ranks nearby places using a composite scoring algorithm and serves them in a TikTok-style vertical feed.

---

## What it does

Open the app → grant location → scroll through ranked place cards. Every card is scored in real time by proximity, rating, engagement, and trending momentum. Tap any card for the full detail view.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, CSS Modules |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 16 + PostGIS 3 |
| Cache | Redis 7 |
| Infrastructure | Docker, Docker Compose |

---

## Key engineering decisions

**Geospatial queries via PostGIS** — `ST_DWithin` filters candidates within radius using a GIST spatial index. `ST_Distance` computes exact metre-level distances over the Earth's curvature (SRID 4326).

**Composite scoring in SQL** — ranking happens inside a single CTE, not in application code:

```
score = 0.35 × proximity
      + 0.20 × normalized rating
      + 0.20 × log-dampened engagement
      + 0.15 × trending score
```

**Keyset pagination** — cursors encode the last returned score as base64. No `OFFSET`, so results stay stable as data changes and DB seeks are O(1).

**Impression buffering** — `IntersectionObserver` fires after 1.5 s of sustained viewport visibility. Counts hit Redis (`HINCRBY`) first; Postgres is updated in batches to avoid hot-row contention.

---

## Architecture

```
┌─────────────────────────────────────────┐
│           Next.js 15 Frontend           │
│  FeedClient → PlaceCard → /places/[id]  │
└───────────────────┬─────────────────────┘
                    │ HTTP / JSON
┌───────────────────▼─────────────────────┐
│         Express + TypeScript API        │
│  GET /v1/feed          (scored feed)    │
│  GET /v1/places/:id    (detail)         │
│  POST /v1/feed/impression               │
└──────────┬──────────────────┬───────────┘
           │                  │
   ┌───────▼──────┐   ┌───────▼──────┐
   │ PostgreSQL 16 │   │   Redis 7    │
   │ + PostGIS 3   │   │  impression  │
   │ places, media │   │   buffer     │
   │ tags, cats    │   └──────────────┘
   └───────────────┘
```

---

## Running locally

**Prerequisites:** Node.js ≥ 18, Docker Desktop, Git

```bash
# 1. Clone
git clone https://github.com/JATIN-25-WATER/Explorex.git
cd Explorex

# 2. Start Postgres + Redis
docker compose up -d

# 3. Backend
cd backend
cp .env.example .env
npm install
npm run dev        # → http://localhost:4000

# 4. Frontend
cd ../frontend
npm install
npm run dev        # → http://localhost:3000
```

Backend `.env`:
```
DATABASE_URL=postgresql://ex_user:ex_pass@localhost:5432/explorex
REDIS_URL=redis://localhost:6379
PORT=4000
```

---

## API

```
GET  /v1/feed?lat=&lng=&radius=&limit=&cursor=&category=
GET  /v1/places/:id
POST /v1/feed/impression   { "place_id": "uuid" }
GET  /health
```

---

## Project structure

```
Explorex/
├── backend/src/
│   ├── db/              # pg pool, redis client
│   ├── routes/          # feed.ts, places.ts
│   ├── services/        # feedService.ts (scoring + pagination)
│   └── index.ts
├── frontend/src/
│   ├── app/
│   │   ├── page.tsx             # feed
│   │   └── places/[id]/page.tsx # detail
│   ├── components/      # FeedClient, PlaceCard, CategoryFilter, LocationBar
│   ├── lib/api.ts        # fetch helpers
│   └── types/index.ts
└── docker-compose.yml
```

---

## Roadmap

- [ ] Auth — JWT, user accounts
- [ ] Save places — per-user interest lists
- [ ] Reviews — post + aggregate ratings
- [ ] Trending engine — Redis sorted sets
- [ ] Cloud deployment — Vercel + Railway

---

Built by [Jatin Sharma](https://github.com/JATIN-25-WATER)