'use client';

import Image from 'next/image';
import { Star, MapPin, Heart, Eye } from 'lucide-react';
import type { PlaceCard as PlaceCardType } from '@/types';
import styles from './PlaceCard.module.css';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PlaceCardProps {
  place: PlaceCardType;
  style?: React.CSSProperties;
}

const FALLBACK =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80';

function Stars({ rating }: { rating: number }) {
  return (
    <div className={styles.metaItem}>
      <Star size={11} className={styles.starIcon} />
      <span className={styles.starText}>
        {Number(rating) > 0 ? Number(rating).toFixed(1) : '—'}
      </span>
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className={styles.actionBtnWrapper} onClick={(e) => e.stopPropagation()}>
      <div className={styles.actionBtnIcon}>{icon}</div>
      <span className={styles.actionBtnLabel}>{label}</span>
    </button>
  );
}

export default function PlaceCard({ place, style }: PlaceCardProps) {
  const router = useRouter();
  return (
    <div className={`feed-item fade-up ${styles.cardWrapper}`} style={style} onClick={() => router.push(`/places/${place.id}`)}>
      {/* Cover image */}
      <div className={styles.imageWrapper}>
        <Image
          src={place.cover_image_url ?? FALLBACK}
          alt={place.name}
          fill
          className={styles.coverImage}
          sizes="100vw"
          priority
        />
        {/* Gradient overlay — bottom-heavy */}
        <div className={styles.gradientOverlay} />
      </div>

      {/* Content — pinned to bottom */}
      <div className={styles.contentContainer}>
        {/* Category badge */}
        <span className={styles.categoryBadge}>
          {place.category_icon} {place.category}
        </span>

        {/* Name */}
        <h2 className={styles.placeName}>{place.name}</h2>

        {/* Meta row */}
        <div className={styles.metaRow}>
          <Stars rating={place.avg_rating} />
          <span className={styles.metaDot}>·</span>
          <div className={styles.metaItem}>
            <MapPin size={11} />
            <span>{place.distance_km} km away</span>
          </div>
          <span className={styles.metaDot}>·</span>
          <div className={styles.metaItem}>
            <Heart size={11} />
            <span>{place.interest_count}</span>
          </div>
        </div>

        {/* Description */}
        <p className={styles.description}>{place.description}</p>

        {/* Tags */}
        {place.tags?.length > 0 && (
          <div className={styles.tagsRow}>
            {place.tags.slice(0, 4).map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Side action bar */}
      <div className={styles.actionSidebar}>
        <ActionBtn icon={<Heart size={20} />} label={String(place.interest_count)} />
        <ActionBtn icon={<Eye size={20} />} label={String(place.review_count)} />
      </div>
    </div>
  );
}
