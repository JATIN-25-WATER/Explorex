'use client';

import { MapPin, ChevronDown } from 'lucide-react';

const RADII = [2, 5, 10, 20];

interface LocationBarProps {
  label: string;
  radius: number;
  onRadiusChange: (r: number) => void;
}

export default function LocationBar({ label, radius, onRadiusChange }: LocationBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Location */}
      <button className="flex items-center gap-1.5 group">
        <MapPin size={15} className="text-accent" strokeWidth={2.5} />
        <span className="font-display font-semibold text-sm text-white tracking-tight">
          {label}
        </span>
        <ChevronDown
          size={13}
          className="text-muted group-hover:text-white transition-colors mt-px"
        />
      </button>

      {/* Radius pills */}
      <div className="flex items-center gap-1">
        {RADII.map((r) => (
          <button
            key={r}
            onClick={() => onRadiusChange(r)}
            className={`px-2.5 py-0.5 rounded-full text-xs font-body font-medium transition-all duration-200 ${
              radius === r
                ? 'bg-accent text-white'
                : 'bg-subtle text-muted hover:text-white hover:bg-[#48484f]'
            }`}
          >
            {r}km
          </button>
        ))}
      </div>
    </div>
  );
}
