import pool from '../db/pool';
import redis from '../db/redis';

export interface FeedParams {
  lat: number;
  lng: number;
  radiusKm: number;
  limit: number;
  cursor?: string;    // opaque pagination token
  category?: string;
}

export interface PlaceCard {
  id: string;
  name: string;
  description: string;
  category: string;
  category_icon: string;
  distance_km: number;
  avg_rating: number;
  review_count: number;
  interest_count: number;
  cover_image_url: string | null;
  tags: string[];
  score: number;
}

// ─── Main feed query ───────────────────────────────────────────
export async function getFeed(params: FeedParams): Promise<{
  places: PlaceCard[];
  next_cursor: string | null;
}> {
  const { lat, lng, radiusKm, limit, cursor, category } = params;
  const radiusMeters = radiusKm * 1000;

  // Decode cursor → last score for keyset pagination
  let cursorScore: number | null = null;
  if (cursor) {
    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf8');
      const parsed = parseFloat(decoded);
      if (!isNaN(parsed)) {
        cursorScore = parsed;
      }
    } catch { /* invalid cursor, start from top */ }
  }

  // ── Step 1: Geo-filtered candidate fetch with ranking ──────
  // We compute the score inside SQL for efficiency.
  // Scoring weights match the architecture spec:
  //   distance 35%, rating 20%, engagement 20%, trending 15%, (pref 10% added in app layer)
  const query = `
    WITH candidates AS (
      SELECT
        p.id,
        p.name,
        p.description,
        c.name        AS category,
        c.icon_key    AS category_icon,
        ROUND(
          (ST_Distance(p.location, ST_MakePoint($2, $1)::geography) / 1000.0)::numeric,
          2
        )::float       AS distance_km,
        p.avg_rating,
        p.review_count,
        p.interest_count,
        p.trending_score,
        -- Cover image (first cover, fallback first media)
        (
          SELECT url FROM place_media pm
          WHERE pm.place_id = p.id
          ORDER BY pm.is_cover DESC, pm.sort_order ASC
          LIMIT 1
        ) AS cover_image_url,
        -- Aggregated tags
        COALESCE(
          (SELECT array_agg(t.name ORDER BY t.usage_count DESC)
           FROM place_tags pt
           JOIN tags t ON t.id = pt.tag_id
           WHERE pt.place_id = p.id),
          '{}'::text[]
        ) AS tags,
        -- Composite score (all signals normalised to 0-1 approximately)
        (
          -- Distance: closer = higher (0→1 as dist→0)
          0.35 * GREATEST(0, 1 - (ST_Distance(p.location, ST_MakePoint($2, $1)::geography) / ($3)))
          -- Rating: (avg_rating - 1) / 4
        + 0.20 * ((COALESCE(p.avg_rating, 0) - 1.0) / 4.0)
          -- Engagement: log normalised
        + 0.20 * (LN(1 + COALESCE(p.interest_count, 0) + COALESCE(p.review_count, 0) * 2 + COALESCE(p.view_count, 0) * 0.1) / 10.0)
          -- Trending
        + 0.15 * LEAST(1.0, COALESCE(p.trending_score, 0) / 1000.0)
        )::float AS score

      FROM places p
      JOIN categories c ON c.id = p.category_id
      WHERE
        p.status = 'active'
        AND ST_DWithin(
          p.location,
          ST_MakePoint($2, $1)::geography,
          $3
        )
        ${category ? "AND c.name = $5" : ""}
    )
    SELECT * FROM candidates
    ${cursorScore !== null ? `WHERE score < $${category ? 6 : 5}` : ""}
    ORDER BY score DESC
    LIMIT $4
  `;

  const queryParams: (number | string)[] = [lat, lng, radiusMeters, limit + 1];
  if (category) queryParams.push(category);
  if (cursorScore !== null) queryParams.push(cursorScore);

  const result = await pool.query<PlaceCard & { score: number }>(query, queryParams);
  const rows = result.rows;

  // Determine if there's a next page
  const hasMore = rows.length > limit;
  const places = hasMore ? rows.slice(0, limit) : rows;

  // Build next cursor from last item's score
  let next_cursor: string | null = null;
  if (hasMore && places.length > 0) {
    const lastScore = places[places.length - 1].score;
    next_cursor = Buffer.from(String(lastScore)).toString('base64');
  }

  return { places, next_cursor };
}

// ─── Log impression ─────────────────────────────────────────────
// Increment view_count in Redis (batched flush to DB every 60s)
export async function logImpression(placeId: string): Promise<void> {
  // Increment in Redis sorted set — flushed to postgres by a background job
  await redis.hincrby('impressions:pending', placeId, 1);
}


