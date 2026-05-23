import { Router } from 'express';
import { getFeed, logImpression } from '../services/feedService';

const router = Router();

// GET /v1/feed
router.get('/', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = parseFloat(req.query.radius as string || '10');
    const limit = parseInt(req.query.limit as string || '10');
    const cursor = req.query.cursor as string | undefined;
    const category = req.query.category as string | undefined;

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Missing or invalid lat/lng coordinates' });
    }

    const feed = await getFeed({
      lat,
      lng,
      radiusKm: radius,
      limit,
      cursor,
      category,
    });

    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /v1/feed/impression
router.post('/impression', async (req, res) => {
  try {
    const { place_id } = req.body;
    if (!place_id) {
      return res.status(400).json({ error: 'Missing place_id' });
    }
    await logImpression(place_id);
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
