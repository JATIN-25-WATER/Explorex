'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PlaceCard from './PlaceCard';
import PlaceCardSkeleton from './PlaceCardSkeleton';
import LocationBar from './LocationBar';
import CategoryFilter from './CategoryFilter';
import { fetchFeed, logImpression } from '@/lib/api';
import type { PlaceCard as PlaceCardType, UserLocation } from '@/types';
import styles from './FeedClient.module.css';

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
    } catch {
      setError('Could not load feed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [location, radius, category]);

  useEffect(() => {
    let active = true;
    impressionsSent.current.clear();
    
    Promise.resolve().then(() => {
      if (active) {
        loadFeed();
      }
    });

    return () => {
      active = false;
    };
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
          const el = entry.target as HTMLElement;
          const id = el.dataset.placeId;

          // Impression tracking — fire after 1.5s of sustained visibility
          if (id && !impressionsSent.current.has(id)) {
            const timer = setTimeout(() => {
              if (!impressionsSent.current.has(id)) {
                impressionsSent.current.add(id);
                logImpression(id);
              }
            }, 1500);
            el.addEventListener('mouseleave', () => clearTimeout(timer), { once: true });
          }

          // Load-more trigger: second-to-last card
          const idx = Number(el.dataset.index);
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
    <div className={styles.feedWrapper}>
      {/* Header overlay — sits on top of feed */}
      <div className={styles.headerOverlay}>
        <div className={styles.headerGradient}>
          {/* App name */}
          <div className={styles.logoContainer}>
            <span className={styles.logoText}>
              explore<span className={styles.logoAccent}>X</span>
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
        <div className={styles.feedContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className={styles.stateContainer}>
          <span className={styles.stateIcon}>⚠️</span>
          <p className={styles.stateText}>{error}</p>
          <button onClick={loadFeed} className={styles.retryButton}>
            Retry
          </button>
        </div>
      ) : places.length === 0 ? (
        <div className={styles.stateContainer}>
          <span className={styles.stateIcon}>🌍</span>
          <p className={styles.stateText}>
            No places found nearby. Try a wider radius.
          </p>
        </div>
      ) : (
        <div ref={feedRef} className={styles.feedContainer}>
          {places.map((place, idx) => (
            <div
              key={place.id}
              data-place-id={place.id}
              data-index={idx}
              className={styles.feedItem}
            >
              <PlaceCard place={place} />
            </div>
          ))}
          {loadingMore && <PlaceCardSkeleton />}
          {!hasMore && places.length > 0 && (
            <div className={`${styles.feedItem} ${styles.stateContainer}`}>
              <p className={styles.stateText}>You&apos;ve seen everything nearby ✦</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
