import type { FeedResponse, PlaceCard } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function fetchFeed({
  lat,
  lng,
  radius = 10,
  limit = 10,
  cursor,
  category,
}: {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
  cursor?: string | null;
  category?: string | null;
}): Promise<FeedResponse> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
    limit: String(limit),
  });
  if (cursor) params.set('cursor', cursor);
  if (category) params.set('category', category);

  const res = await fetch(`${BASE}/v1/feed?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchPlace(id: string): Promise<PlaceCard> {
  const res = await fetch(`${BASE}/v1/places/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Place fetch failed: ${res.status}`);
  return res.json();
}

export async function logImpression(placeId: string): Promise<void> {
  await fetch(`${BASE}/v1/feed/impression`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ place_id: placeId }),
  }).catch(() => {}); // fire-and-forget, never block UI
}
