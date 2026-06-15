export function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center py-10 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-300 border-t-rose-700"></div>
    </div>
  );
}

export function Skeleton({ count = 4, layout = 'grid' }) {
  const gridClass = layout === 'grid' ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4' : 'space-y-4';
  return (
    <div className={`mt-6 ${gridClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-5 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
