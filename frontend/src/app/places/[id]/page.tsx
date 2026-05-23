'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchPlace } from '@/lib/api';
import styles from '@/components/PlaceCard.module.css';
import { Star, MapPin, Heart } from 'lucide-react';

const FALLBACK =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80';

/**
 * Dynamic route: /places/[id]
 * Displays detailed information about a place.
 */
export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------
  // Load place data on mount / id change
  // ---------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchPlace(id);
        if (!cancelled) setPlace(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? 'Failed to load place');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ---------------------------------------------------------------------
  // Helper UI fragments – keep styling consistent with PlaceCard
  // ---------------------------------------------------------------------
  const RatingStars = ({ rating }: { rating: number }) => (
    <div className={styles.metaItem}>
      <Star size={11} className={styles.starIcon} />
      <span className={styles.starText}>{Number(rating) > 0 ? Number(rating).toFixed(1) : '—'}</span>
    </div>
  );

  const BackButton = () => (
    <button
      onClick={() => router.back()}
      className={styles.actionBtnWrapper}
      style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        background: 'rgba(var(--bg-surface-rgb), 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 30,
      }}
    >
      ← Back
    </button>
  );

  // ---------------------------------------------------------------------
  // Rendering states
  // ---------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400">Loading place…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.back()} className="rounded px-4 py-2 bg-gray-800 text-white">
          ← Back
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Main content – mirrors the glass‑morphic card from PlaceCard.tsx
  // ---------------------------------------------------------------
  const {
    cover_image_url,
    name,
    category,
    category_icon,
    description,
    address,
    avg_rating,
    distance_km,
    tags,
  } = place;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 p-6">
      <BackButton />
      <div className={`feed-item fade-up ${styles.cardWrapper}`} style={{ maxWidth: '800px', margin: '4rem auto' }}>
        {/* Cover image */}
        <div className={styles.imageWrapper}>
          <Image
            src={cover_image_url ?? FALLBACK}
            alt={name}
            fill
            className={styles.coverImage}
            sizes="100vw"
            priority
          />
          <div className={styles.gradientOverlay} />
        </div>

        {/* Content */}
        <div className={styles.contentContainer}>
          <span className={styles.categoryBadge}>
            {category_icon} {category}
          </span>
          <h1 className={styles.placeName}>{name}</h1>
          <div className={styles.metaRow}>
            <RatingStars rating={avg_rating} />
            <span className={styles.metaDot}>·</span>
            <div className={styles.metaItem}>
              <MapPin size={11} />
              <span>{distance_km} km away</span>
            </div>
          </div>
          <p className={styles.description}>{description}</p>
          {address && (
            <p className={styles.description} style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
              📍 {address}
            </p>
          )}
          {tags?.length > 0 && (
            <div className={styles.tagsRow}>
              {tags.slice(0, 6).map((tag: string) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Action sidebar – same as PlaceCard */}
        <div className={styles.actionSidebar}>
          <button className={styles.actionBtnWrapper}>
            <div className={styles.actionBtnIcon}>
              <Heart size={20} />
            </div>
            <span className={styles.actionBtnLabel}>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
