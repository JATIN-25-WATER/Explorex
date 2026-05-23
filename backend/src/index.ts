import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/pool';
import redis from './db/redis';
import feedRouter from './routes/feed';
import placesRouter from './routes/places';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000');

// ─── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────────
app.use('/v1/feed',   feedRouter);
app.use('/v1/places', placesRouter);

// Health check
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    const redisPing = await redis.ping();
    res.json({
      status: 'ok',
      postgres: 'connected',
      redis: redisPing === 'PONG' ? 'connected' : 'error',
    });
  } catch (err) {
    res.status(503).json({ status: 'error', error: String(err) });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Startup ──────────────────────────────────────────────────
async function start() {
  try {
    // Verify DB connection
    await pool.query('SELECT 1');
    console.log('✓ Postgres connected');

    // Connect Redis
    await redis.connect();

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`  GET  /v1/feed?lat=19.06&lng=72.83&radius=5`);
      console.log(`  GET  /v1/places/:id`);
      console.log(`  GET  /health`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

start();
