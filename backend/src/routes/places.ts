import { Router } from 'express';
import pool from '../db/pool';

const router = Router();

// GET /v1/places/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch place details
    const placeQuery = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.address,
        ST_X(p.location::geometry) AS lng,
        ST_Y(p.location::geometry) AS lat,
        c.name AS category,
        c.icon_key AS category_icon,
        p.avg_rating,
        p.review_count,
        p.interest_count,
        p.trending_score,
        p.view_count,
        p.created_at
      FROM places p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1 AND p.status = 'active'
    `;

    const placeResult = await pool.query(placeQuery, [id]);
    if (placeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Place not found' });
    }

    const place = placeResult.rows[0];

    // Fetch place media
    const mediaQuery = `
      SELECT id, url, is_cover, sort_order
      FROM place_media
      WHERE place_id = $1
      ORDER BY is_cover DESC, sort_order ASC
    `;
    const mediaResult = await pool.query(mediaQuery, [id]);
    place.media = mediaResult.rows;

    // Fetch place tags
    const tagsQuery = `
      SELECT t.id, t.name
      FROM place_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.place_id = $1
      ORDER BY t.usage_count DESC
    `;
    const tagsResult = await pool.query(tagsQuery, [id]);
    place.tags = tagsResult.rows.map((row: any) => row.name);

    res.json(place);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
