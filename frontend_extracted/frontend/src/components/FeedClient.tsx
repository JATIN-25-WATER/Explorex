'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PlaceCard from './PlaceCard';
import PlaceCardSkeleton from './PlaceCardSkeleton';
import LocationBar from './LocationBar';
import CategoryFilter from './CategoryFilter';
import { fetchFeed, logImpression } from '@/lib/api';
import type { PlaceCard as PlaceCardType, UserLocation } from '@/types';

// Default: Mumbai (matches seed data)
const DEFAULT_LOCATION: UserLocation = {
  lat: 19.06,
  lng: 72.83,
  label: 'Mumbai',
};

export default function FeedClient() {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [radius, setRadius] = useState(10);
  const [category, setCategory] = useState<string | null>(null);
  const [places, setPlaces] = useState<PlaceCardType[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  const impressionsSent = useRef<Set<string>>(new Set());

  // ── Load first page ──────────────────────────────────────────
  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeed({
        lat: location.lat,
        lng: location.lng,
        radius,
        limit: 10,
        cursor: null,
        category,
      });
      setPlaces(data.places);
      setCursor(data.next_cursor);
      setHasMore(data.next_cursor !== null);
    } catch (e) {
      setError('Could not load feed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [location, radius, category]);

  useEffect(() => {
    impressionsSent.current.clear();
    loadFeed();
  }, [loadFeed]);

  // ── Load more (infinite scroll) ──────────────────────────────
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursor) return;
    setLoadingMore(true);
    try {
      const data = await fetchFeed({
        lat: location.lat,
        lng: location.lng,
        radius,
        limit: 10,
        cursor,
        category,
      });
      setPlaces((prev) => [...prev, ...data.places]);
      setCursor(data.next_cursor);
      setHasMore(data.next_cursor !== null);
    } catch {
      // silent — user can keep scrolling
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, cursor, location, radius, category]);

  // ── Intersection observer for impression + load-more trigger ─
  useEffect(() => {
    const container = feedRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLElement).dataset.placeId;
          if (id && !impressionsSent.current.has(id)) {
            impressionsSent.current.add(id);
            logImpression(id);
          }
          // Trigger load more when second-to-last card is visible
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (idx === places.length - 2) loadMore();
        });
      },
      { root: container, threshold: 0.6 }
    );

    container.querySelectorAll('[data-place-id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [places, loadMore]);

  // ── Try geolocation ──────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Your Location',
        });
      },
      () => {} // denied → keep default Mumbai
    );
  }, []);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="relative w-full h-[100dvh] bg-surface overflow-hidden">
      {/* Header overlay — sits on top of feed */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-safe">
        <div className="bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-6">
          {/* App name */}
          <div className="px-4 pt-4 pb-1">
            <span className="font-display font-bold text-xl tracking-tight text-white">
              explore<span className="text-accent">X</span>
            </span>
          </div>

          <LocationBar
            label={location.label}
            radius={radius}
            onRadiusChange={setRadius}
          />
          <CategoryFilter active={category} onChange={setCategory} />
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div ref={feedRef} className="feed-container">
          {Array.from({ length: 3 }).map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="text-white/60 font-body text-sm">{error}</p>
          <button
            onClick={loadFeed}
            className="px-5 py-2 rounded-full bg-accent text-white text-sm font-medium font-body"
          >
            Retry
          </button>
        </div>
      ) : places.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
          <span className="text-4xl">🌍</span>
          <p className="text-white/60 font-body text-sm">
            No places found nearby. Try a wider radius.
          </p>
        </div>
      ) : (
        <div ref={feedRef} className="feed-container">
          {places.map((place, idx) => (
            <div
              key={place.id}
              data-place-id={place.id}
              data-index={idx}
            >
              <PlaceCard place={place} />
            </div>
          ))}
          {loadingMore && <PlaceCardSkeleton />}
          {!hasMore && places.length > 0 && (
            <div className="feed-item flex items-center justify-center h-[100dvh] bg-surface">
              <p className="text-muted font-body text-sm">You've seen everything nearby ✦</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
