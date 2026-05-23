'use client';

import styles from './CategoryFilter.module.css';

const CATEGORIES = [
  { label: 'All',        icon: '✦' },
  { label: 'Cafe',       icon: '☕' },
  { label: 'Restaurant', icon: '🍽' },
  { label: 'Bar',        icon: '🍸' },
  { label: 'Outdoor',    icon: '🌿' },
  { label: 'Arcade',     icon: '🕹' },
  { label: 'Shopping',   icon: '🛍' },
  { label: 'Event',      icon: '🎟' },
];

interface CategoryFilterProps {
  active: string | null;
  onChange: (cat: string | null) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className={styles.filterContainer}>
      {CATEGORIES.map(({ label, icon }) => {
        const value = label === 'All' ? null : label;
        const isActive = active === value;
        return (
          <button
            key={label}
            onClick={() => onChange(value)}
            className={`${styles.filterBtn} ${
              isActive ? styles.filterBtnActive : styles.filterBtnInactive
            }`}
          >
            <span>{icon}</span>
            <span className={styles.filterLabel}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
