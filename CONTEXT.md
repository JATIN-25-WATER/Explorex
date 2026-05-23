# ExploreX — Project Context for New Session

## What is ExploreX
Mobile-first place discovery app. Users find nearby places/events via a visual scrollable feed (reel-style). Secondary social layer: interest marks, messaging, profiles.

## Tech Stack (decided)
| Layer | Choice |
|---|---|
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 + PostGIS 3.4 |
| Cache | Redis 7 |
| Frontend | Next.js (web-first MVP, mobile-first CSS) |
| Containerisation | Docker + docker-compose |

## Architecture (high-level)
```
Clients (Next.js / RN) 
  → API Gateway (Kong) [auth · rate limit · WS upgrade]
  → Microservices: Feed · Location · Place · Social · User · Moderation · Review · Trending · Notification · Media
  → Event bus: Kafka
  → Data: PostgreSQL+PostGIS · Redis · Elasticsearch · Cassandra (messages) · S3+CDN
  → Infra: Kubernetes (EKS) · Prometheus/Grafana · Vault
```
MVP scope = Feed + Location + Place cards only. Auth/Social added next.

## Database Schema (MVP tables — all in PostgreSQL)
- `categories` — id, name, icon_key
- `places` — id, name, description, category_id, **location GEOGRAPHY(Point,4326)**, address, status, avg_rating, review_count, interest_count, view_count, trending_score, source
- `place_media` — id, place_id, url, media_type, is_cover, sort_order
- `tags` — id, name, usage_count
- `place_tags` — (place_id, tag_id) composite PK
- Key index: `CREATE INDEX ON places USING GIST(location)` — critical for ST_DWithin geo queries

Future tables (not yet built): users, reviews, interests, messages, message_threads, moderation_queue, reports, blocks

## Feed Ranking Algorithm
```
Candidates: ST_DWithin(location, user_point, radius_m) LIMIT 500
Score = 0.35·distance + 0.20·rating + 0.20·engagement + 0.15·trending + 0.10·pref_boost
  distance   = 1 − (dist_km / max_radius_km)
  rating     = (avg_rating − 1) / 4
  engagement = ln(1 + interests + reviews×2 + views×0.1) / 10
  trending   = MIN(1, trending_score / 1000)
  pref_boost = 1.0 if category in user.pref_categories else 0.6
Pagination: cursor-based (base64 of last score)
Diversity:  MMR with λ=0.7 to prevent same-category clustering
Cache:      Pre-ranked per H3 cell (res 7, ~5km²), 15min TTL
```

## Trending Score Formula
```
gravity = 1.8
raw_points = interests×3 + reviews×5 + impressions×0.1   (48h rolling window)
trending_score = raw_points / (age_hours + 2)^gravity
Geo-scoped: per H3 cell (res 6) stored in Redis sorted set
Anti-gaming: dedup impressions, new accounts 0.2× weight
```

## API Endpoints (built so far)
```
GET  /v1/feed?lat=&lng=&radius=&limit=&cursor=&category=
POST /v1/feed/impression   { place_id }
GET  /v1/places/:id
GET  /v1/places?q=&lat=&lng=&category=
GET  /health
```

## Project File Structure
```
explorex/
├── docker-compose.yml          ← PostGIS + Redis containers
├── .gitignore
└── backend/
    ├── .env.example
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts            ← Express app, startup
        ├── db/
        │   ├── pool.ts         ← pg Pool singleton
        │   ├── redis.ts        ← ioredis singleton
        │   ├── init.sql        ← schema (PostGIS, indexes)
        │   └── seed.sql        ← 15 Mumbai places, 7 categories, tags, media
        ├── routes/
        │   ├── feed.ts         ← GET /feed, POST /feed/impression
        │   └── places.ts       ← GET /places/:id, GET /places (search)
        └── services/
            └── feedService.ts  ← ranking query + logImpression
```

## Credentials (docker-compose + .env)
```
POSTGRES_DB=explorex  POSTGRES_USER=ex_user  POSTGRES_PASSWORD=ex_pass
REDIS_HOST=localhost   REDIS_PORT=6379
PORT=4000
```

## Seed Data
15 Mumbai places across: cafe, bar, restaurant, arcade, outdoor, event, shopping.
Cover images: Unsplash CDN URLs (no auth needed).
Initial trending_score computed at seed time.

## Steps Completed
- [x] Step 1: Docker setup + PostgreSQL schema + seed data + backend scaffolding (Feed API working)

## Steps Remaining (in order)
- [ ] Step 2: Next.js frontend — scrollable feed UI, PlaceCard component, LocationBar
- [ ] Step 3: Place detail page (media gallery, tags, rating display)
- [ ] Step 4: Auth — JWT login/register, user table, middleware
- [ ] Step 5: Interest feature — mark/unmark, public interest list
- [ ] Step 6: Reviews — submit, list, star rating UI
- [ ] Step 7: Trending section — dedicated feed view
- [ ] Step 8: Messaging — thread request inbox, accept flow, WebSocket chat
- [ ] Step 9: Moderation — AI review moderation, place submission approval queue
- [ ] Step 10: Deploy — Docker → cloud (Railway / Render / AWS ECS)

## How to Run (Step 1 baseline)
```bash
cd explorex
cp backend/.env.example backend/.env
docker compose up -d          # starts postgres + redis
cd backend && npm install
npm run dev                   # server on :4000

# Test
curl http://localhost:4000/health
curl "http://localhost:4000/v1/feed?lat=19.06&lng=72.83&radius=10&limit=5"
```

## Key Design Decisions to Remember
- PostGIS `geography` type (not geometry) — handles Earth curvature, distance in metres
- Cursor pagination everywhere — offset breaks on live data
- Redis impression buffer → batch flush to Postgres (not live writes)
- Trending uses 48h rolling window, not all-time counts
- All place submissions → moderation queue before going active
- Private users cannot use any social feature (interest, messaging, explore people)
- Messages require receiver acceptance before chat opens (prevents spam)
