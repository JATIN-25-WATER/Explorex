"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedService_1 = require("../services/feedService");
const router = (0, express_1.Router)();
// GET /v1/feed
router.get('/', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const radius = parseFloat(req.query.radius || '10');
        const limit = parseInt(req.query.limit || '10');
        const cursor = req.query.cursor;
        const category = req.query.category;
        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: 'Missing or invalid lat/lng coordinates' });
        }
        const feed = await (0, feedService_1.getFeed)({
            lat,
            lng,
            radiusKm: radius,
            limit,
            cursor,
            category,
        });
        res.json(feed);
    }
    catch (err) {
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
        await (0, feedService_1.logImpression)(place_id);
        res.json({ status: 'ok' });
    }
    catch (err) {
        res.status(500).json({ error: String(err) });
    }
});
exports.default = router;
