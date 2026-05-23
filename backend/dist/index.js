"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pool_1 = __importDefault(require("./db/pool"));
const redis_1 = __importDefault(require("./db/redis"));
const feed_1 = __importDefault(require("./routes/feed"));
const places_1 = __importDefault(require("./routes/places"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '4000');
// ─── Middleware ────────────────────────────────────────────────
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request logger (dev only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}
// ─── Routes ───────────────────────────────────────────────────
app.use('/v1/feed', feed_1.default);
app.use('/v1/places', places_1.default);
// Health check
app.get('/health', async (_req, res) => {
    try {
        await pool_1.default.query('SELECT 1');
        const redisPing = await redis_1.default.ping();
        res.json({
            status: 'ok',
            postgres: 'connected',
            redis: redisPing === 'PONG' ? 'connected' : 'error',
        });
    }
    catch (err) {
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
        await pool_1.default.query('SELECT 1');
        console.log('✓ Postgres connected');
        // Connect Redis
        await redis_1.default.connect();
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`  GET  /v1/feed?lat=19.06&lng=72.83&radius=5`);
            console.log(`  GET  /v1/places/:id`);
            console.log(`  GET  /health`);
        });
    }
    catch (err) {
        console.error('Startup failed:', err);
        process.exit(1);
    }
}
start();
