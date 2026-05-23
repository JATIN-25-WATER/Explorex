export default function PlaceCardSkeleton() {
  return (
    <div className="feed-item relative w-full h-[100dvh] bg-card overflow-hidden">
      {/* Image area */}
      <div className="absolute inset-0 skeleton" />
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 space-y-3">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-9 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-5 w-14 rounded-md" />
          <div className="skeleton h-5 w-16 rounded-md" />
          <div className="skeleton h-5 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}
