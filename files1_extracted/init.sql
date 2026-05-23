-- ─────────────────────────────────────────────────────────────
-- ExploreX App — MVP Schema
-- Tables: categories, places, place_media, tags, place_tags
-- ─────────────────────────────────────────────────────────────

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Categories ───────────────────────────────────────────────
CREATE TABLE categories (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name      TEXT NOT NULL UNIQUE,
  icon_key  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Places ───────────────────────────────────────────────────
CREATE TABLE places (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT,
  category_id     UUID NOT NULL REFERENCES categories(id),
  -- PostGIS geography column — handles Earth curvature correctly
  location        GEOGRAPHY(Point, 4326) NOT NULL,
  address         TEXT,
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('pending', 'active', 'rejected')),
  avg_rating      NUMERIC(3,2) DEFAULT 0,
  review_count    INT DEFAULT 0,
  interest_count  INT DEFAULT 0,
  view_count      INT DEFAULT 0,
  trending_score  FLOAT DEFAULT 0,
  source          TEXT DEFAULT 'seed'
                    CHECK (source IN ('api_seed', 'user_submit', 'seed')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index — critical for ST_DWithin performance
CREATE INDEX idx_places_location ON places USING GIST(location);
-- Regular indexes
CREATE INDEX idx_places_category ON places(category_id);
CREATE INDEX idx_places_status   ON places(status);
CREATE INDEX idx_places_trending ON places(trending_score DESC);

-- ─── Place Media ──────────────────────────────────────────────
CREATE TABLE place_media (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id    UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  media_type  TEXT NOT NULL DEFAULT 'image'
                CHECK (media_type IN ('image', 'video')),
  is_cover    BOOLEAN DEFAULT FALSE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_place ON place_media(place_id);

-- ─── Tags ─────────────────────────────────────────────────────
CREATE TABLE tags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  usage_count INT DEFAULT 0
);

CREATE INDEX idx_tags_name ON tags(name);

-- ─── Place Tags (junction) ────────────────────────────────────
CREATE TABLE place_tags (
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  tag_id   UUID NOT NULL REFERENCES tags(id)   ON DELETE CASCADE,
  PRIMARY KEY (place_id, tag_id)
);

CREATE INDEX idx_place_tags_place ON place_tags(place_id);

-- ─── Helper: update avg_rating ────────────────────────────────
-- Will be used when reviews table is added in next step
CREATE OR REPLACE FUNCTION update_place_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- placeholder for when reviews table is added
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
