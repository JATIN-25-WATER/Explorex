-- ─────────────────────────────────────────────────────────────
-- Seed Data — Mumbai-based places for MVP development
-- ─────────────────────────────────────────────────────────────

-- ─── Categories ───────────────────────────────────────────────
INSERT INTO categories (id, name, icon_key) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'cafe',       'coffee'),
  ('c0000002-0000-0000-0000-000000000002', 'bar',        'wine'),
  ('c0000003-0000-0000-0000-000000000003', 'restaurant', 'utensils'),
  ('c0000004-0000-0000-0000-000000000004','arcade',     'gamepad'),
  ('c0000005-0000-0000-0000-000000000005', 'outdoor',    'tree'),
  ('c0000006-0000-0000-0000-000000000006', 'event',      'calendar'),
  ('c0000007-0000-0000-0000-000000000007', 'shopping',   'bag');

-- ─── Tags ─────────────────────────────────────────────────────
INSERT INTO tags (id, name, usage_count) VALUES
  ('7a900001-0000-0000-0000-000000000001', 'rooftop',        8),
  ('7a900002-0000-0000-0000-000000000002', 'live-music',     6),
  ('7a900003-0000-0000-0000-000000000003', 'instagrammable', 12),
  ('7a900004-0000-0000-0000-000000000004', 'quiet',          5),
  ('7a900005-0000-0000-0000-000000000005', 'late-night',     9),
  ('7a900006-0000-0000-0000-000000000006', 'budget',         7),
  ('7a900007-0000-0000-0000-000000000007', 'vegan-friendly', 4),
  ('7a900008-0000-0000-0000-000000000008', 'sea-view',       6),
  ('7a900009-0000-0000-0000-000000000009', 'co-working',     3),
  ('7a900010-0000-0000-0000-000000000010', 'pet-friendly',   2);

-- ─── Places ───────────────────────────────────────────────────
-- ST_MakePoint(longitude, latitude) — note: lon first
INSERT INTO places (id, name, description, category_id, location, address, avg_rating, review_count, interest_count, view_count, trending_score) VALUES

-- Cafes — Bandra / Juhu
('b1000001-0000-0000-0000-000000000001',
 'Subko Coffee', 
 'Specialty coffee roastery with a minimalist space. Known for single-origin pour-overs and a great work vibe.',
 'c0000001-0000-0000-0000-000000000001',
 ST_MakePoint(72.8296, 19.0607)::geography,
 '26/1, Linking Rd, Khar West, Mumbai',
 4.6, 120, 89, 1400, 0),

('b1000002-0000-0000-0000-000000000002',
 'Birdsong Café',
 'Cozy garden café with all-day breakfast and excellent cold brews. Popular among freelancers.',
 'c0000001-0000-0000-0000-000000000001',
 ST_MakePoint(72.8268, 19.0758)::geography,
 'Bandra West, Mumbai',
 4.4, 95, 71, 980, 0),

('b1000003-0000-0000-0000-000000000003',
 'The Pantry',
 'Upscale café in Kala Ghoda serving farm-to-table food and artisanal coffee in a heritage space.',
 'c0000001-0000-0000-0000-000000000001',
 ST_MakePoint(72.8330, 18.9278)::geography,
 'Kala Ghoda, Fort, Mumbai',
 4.5, 200, 140, 2200, 0),

-- Bars
('b1000004-0000-0000-0000-000000000004',
 'Aer — Four Seasons',
 'Rooftop bar on the 34th floor with 360° views of the Mumbai skyline. Premium cocktails.',
 'c0000002-0000-0000-0000-000000000002',
 ST_MakePoint(72.8265, 19.0596)::geography,
 '114 Dr E Moses Rd, Worli, Mumbai',
 4.7, 310, 280, 4800, 0),

('b1000005-0000-0000-0000-000000000005',
 'Toit Brewpub',
 'Popular microbrewery with house-crafted beers. Lively atmosphere, great for groups.',
 'c0000002-0000-0000-0000-000000000002',
 ST_MakePoint(72.8366, 19.1136)::geography,
 'Andheri West, Mumbai',
 4.3, 180, 130, 2100, 0),

('b1000006-0000-0000-0000-000000000006',
 'The Bar Stock Exchange',
 'Unique concept where drink prices fluctuate live like stocks. Fun and loud.',
 'c0000002-0000-0000-0000-000000000002',
 ST_MakePoint(72.8356, 19.1215)::geography,
 'Andheri West, Mumbai',
 4.1, 145, 98, 1600, 0),

-- Restaurants
('b1000007-0000-0000-0000-000000000007',
 'Bastian',
 'Famous seafood restaurant with a vibrant vibe. Known for lobster rolls and weekend crowds.',
 'c0000003-0000-0000-0000-000000000003',
 ST_MakePoint(72.8263, 19.0614)::geography,
 'New Kamal Building, Bandra West, Mumbai',
 4.5, 420, 310, 5500, 0),

('b1000008-0000-0000-0000-000000000008',
 'Dakshinayan',
 'Authentic South Indian meals served on banana leaf. Pure vegetarian, budget-friendly.',
 'c0000003-0000-0000-0000-000000000003',
 ST_MakePoint(72.8556, 19.0176)::geography,
 'Matunga West, Mumbai',
 4.6, 280, 190, 3200, 0),

('b1000009-0000-0000-0000-000000000009',
 'Wasabi by Morimoto',
 'High-end Japanese cuisine by Iron Chef Morimoto. Minimalist interiors, exceptional sushi.',
 'c0000003-0000-0000-0000-000000000003',
 ST_MakePoint(72.8330, 18.9225)::geography,
 'The Taj Mahal Palace, Colaba, Mumbai',
 4.8, 190, 155, 2800, 0),

-- Arcades / Entertainment
('b1000010-0000-0000-0000-000000000010',
 'Smaaash',
 'Massive gaming and entertainment zone with VR, cricket simulators, and bowling.',
 'c0000004-0000-0000-0000-000000000004',
 ST_MakePoint(72.8296, 19.0540)::geography,
 'High Street Phoenix, Lower Parel, Mumbai',
 4.0, 340, 220, 4100, 0),

('b1000011-0000-0000-0000-000000000011',
 'E-Zone Gaming Lounge',
 'PC and console gaming café with high-end setups. Popular for late-night sessions.',
 'c0000004-0000-0000-0000-000000000004',
 ST_MakePoint(72.8489, 19.1034)::geography,
 'Goregaon West, Mumbai',
 3.9, 85, 62, 900, 0),

-- Outdoor
('b1000012-0000-0000-0000-000000000012',
 'Bandstand Promenade',
 'Iconic seafront walkway with sea views and Bandra Fort at one end. Best at sunset.',
 'c0000005-0000-0000-0000-000000000005',
 ST_MakePoint(72.8176, 19.0488)::geography,
 'Bandstand, Bandra West, Mumbai',
 4.5, 560, 430, 7200, 0),

('b1000013-0000-0000-0000-000000000013',
 'Sanjay Gandhi National Park',
 'Sprawling national park inside Mumbai with trekking trails, lion safari, and Kanheri Caves.',
 'c0000005-0000-0000-0000-000000000005',
 ST_MakePoint(72.9100, 19.2147)::geography,
 'Borivali East, Mumbai',
 4.6, 890, 610, 9800, 0),

-- Events
('b1000014-0000-0000-0000-000000000014',
 'Mehboob Studio Flea',
 'Popular weekend flea market with indie food stalls, vintage clothing, and live music.',
 'c0000006-0000-0000-0000-000000000006',
 ST_MakePoint(72.8258, 19.0631)::geography,
 'Mehboob Studios, Bandra West, Mumbai',
 4.3, 130, 105, 1800, 0),

('b1000015-0000-0000-0000-000000000015',
 'NCPA — National Centre for Performing Arts',
 'Premier cultural venue hosting theatre, classical music, and contemporary performances.',
 'c0000006-0000-0000-0000-000000000006',
 ST_MakePoint(72.8233, 18.9252)::geography,
 'NCPA Marg, Nariman Point, Mumbai',
 4.7, 320, 240, 4200, 0);

-- ─── Place Media ──────────────────────────────────────────────
-- Using Unsplash source images (stable, no auth needed)
INSERT INTO place_media (place_id, url, media_type, is_cover, sort_order) VALUES
('b1000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', 'image', true, 0),
('b1000002-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', 'image', true, 0),
('b1000003-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800', 'image', true, 0),
('b1000004-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', 'image', true, 0),
('b1000005-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800', 'image', true, 0),
('b1000006-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800', 'image', true, 0),
('b1000007-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', 'image', true, 0),
('b1000008-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', 'image', true, 0),
('b1000009-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', 'image', true, 0),
('b1000010-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 'image', true, 0),
('b1000011-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', 'image', true, 0),
('b1000012-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 'image', true, 0),
('b1000013-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 'image', true, 0),
('b1000014-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800', 'image', true, 0),
('b1000015-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'image', true, 0);

-- ─── Place Tags ───────────────────────────────────────────────
INSERT INTO place_tags (place_id, tag_id) VALUES
('b1000001-0000-0000-0000-000000000001', '7a900004-0000-0000-0000-000000000004'), -- quiet
('b1000001-0000-0000-0000-000000000001', '7a900009-0000-0000-0000-000000000009'), -- co-working
('b1000002-0000-0000-0000-000000000002', '7a900004-0000-0000-0000-000000000004'), -- quiet
('b1000002-0000-0000-0000-000000000002', '7a900007-0000-0000-0000-000000000007'), -- vegan-friendly
('b1000004-0000-0000-0000-000000000004', '7a900001-0000-0000-0000-000000000001'), -- rooftop
('b1000004-0000-0000-0000-000000000004', '7a900008-0000-0000-0000-000000000008'), -- sea-view
('b1000004-0000-0000-0000-000000000004', '7a900003-0000-0000-0000-000000000003'), -- instagrammable
('b1000005-0000-0000-0000-000000000005', '7a900002-0000-0000-0000-000000000002'), -- live-music
('b1000005-0000-0000-0000-000000000005', '7a900005-0000-0000-0000-000000000005'), -- late-night
('b1000006-0000-0000-0000-000000000006', '7a900005-0000-0000-0000-000000000005'), -- late-night
('b1000007-0000-0000-0000-000000000007', '7a900003-0000-0000-0000-000000000003'), -- instagrammable
('b1000008-0000-0000-0000-000000000008', '7a900006-0000-0000-0000-000000000006'), -- budget
('b1000008-0000-0000-0000-000000000008', '7a900007-0000-0000-0000-000000000007'), -- vegan-friendly
('b1000012-0000-0000-0000-000000000012', '7a900008-0000-0000-0000-000000000008'), -- sea-view
('b1000012-0000-0000-0000-000000000012', '7a900003-0000-0000-0000-000000000003'), -- instagrammable
('b1000014-0000-0000-0000-000000000014', '7a900002-0000-0000-0000-000000000002'), -- live-music
('b1000014-0000-0000-0000-000000000014', '7a900006-0000-0000-0000-000000000006'); -- budget

-- ─── Compute initial trending scores ─────────────────────────
-- Formula: raw_points / (age_hours + 2)^1.8
-- All seeded as "new" so age is ~0 hours
UPDATE places SET trending_score = 
  (interest_count * 3 + review_count * 5 + view_count * 0.1) 
  / POWER(2, 1.8);

