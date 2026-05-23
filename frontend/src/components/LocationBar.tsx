'use client';

import { MapPin, ChevronDown } from 'lucide-react';
import styles from './LocationBar.module.css';

const RADII = [2, 5, 10, 20];

interface LocationBarProps {
  label: string;
  radius: number;
  onRadiusChange: (r: number) => void;
}

export default function LocationBar({ label, radius, onRadiusChange }: LocationBarProps) {
  return (
    <div className={styles.barContainer}>
      {/* Location */}
      <button className={styles.locationBtn}>
        <MapPin size={15} className={styles.mapPinIcon} strokeWidth={2.5} />
        <span className={styles.locationLabel}>{label}</span>
        <ChevronDown size={13} className={styles.chevronIcon} />
      </button>

      {/* Radius pills */}
      <div className={styles.radiusContainer}>
        {RADII.map((r) => (
          <button
            key={r}
            onClick={() => onRadiusChange(r)}
            className={`${styles.radiusPill} ${
              radius === r ? styles.radiusPillActive : styles.radiusPillInactive
            }`}
          >
            {r}km
          </button>
        ))}
      </div>
    </div>
  );
}
