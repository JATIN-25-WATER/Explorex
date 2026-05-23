'use client';

import Image from 'next/image';
import { Star, MapPin, Heart, Eye } from 'lucide-react';
import type { PlaceCard as PlaceCardType } from '@/types';

interface PlaceCardProps {
  place: PlaceCardType;
  style?: React.CSSProperties;
}

const FALLBACK =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={11} className="fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-medium text-white/90">
        {rating > 0 ? rating.toFixed(1) : '—'}
      </span>
    </div>
  );
}

export default function PlaceCard({ place, style }: PlaceCardProps) {
  return (
    <div
      className="feed-item fade-up relative w-full h-[100dvh] overflow-hidden bg-surface"
      style={style}
    >
      {/* Cover image */}
      <div className="absolute inset-0">
        <Image
          src={place.cover_image_url ?? FALLBACK}
          alt={place.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Gradient overlay — bottom-heavy */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>

      {/* Content — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-16">
        {/* Category badge */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-[11px] font-body font-medium tracking-wide uppercase">
            {place.category_icon} {place.category}
          </span>
        </div>

        {/* Name */}
        <h2 className="font-display font-bold text-3xl text-white leading-tight mb-1 tracking-tight">
          {place.name}
        </h2>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          <Stars rating={place.avg_rating} />
          <span className="text-white/30">·</span>
          <div className="flex items-center gap-1 text-white/60">
            <MapPin size={11} />
            <span className="text-xs font-body">{place.distance_km} km away</span>
          </div>
          <span className="text-white/30">·</span>
          <div className="flex items-center gap-1 text-white/60">
            <Heart size={11} />
            <span className="text-xs font-body">{place.interest_count}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm font-body leading-relaxed line-clamp-2 mb-4">
          {place.description}
        </p>

        {/* Tags */}
        {place.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {place.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-white/8 border border-white/10 text-white/50 text-[11px] font-body"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Side action bar */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-5">
        <ActionBtn icon={<Heart size={20} />} label={String(place.interest_count)} />
        <ActionBtn icon={<Eye size={20} />} label={String(place.review_count)} />
      </div>
    </div>
  );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors group">
      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-body">{label}</span>
    </button>
  );
}
