'use client';

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
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar">
      {CATEGORIES.map(({ label, icon }) => {
        const value = label === 'All' ? null : label;
        const isActive = active === value;
        return (
          <button
            key={label}
            onClick={() => onChange(value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
              isActive
                ? 'bg-accent border-accent text-white'
                : 'bg-card border-border text-muted hover:text-white hover:border-subtle'
            }`}
          >
            <span>{icon}</span>
            <span className="font-body">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
