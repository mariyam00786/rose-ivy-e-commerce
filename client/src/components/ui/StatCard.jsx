const BORDER_COLORS = {
  gold: 'border-l-amber-400',
  blue: 'border-l-blue-400',
  pink: 'border-l-rose-400',
  green: 'border-l-emerald-400',
};

export default function StatCard({ label, value, icon, color }) {
  const borderClass = color ? BORDER_COLORS[color] || '' : '';
  return (
    <div className={`rounded-2xl border border-rose-100 bg-white p-3 md:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:shadow-sm border-l-[3px] md:border-l ${borderClass} md:border-l-rose-100 max-h-[90px] md:max-h-none flex items-center`}>
      <div className="flex items-center gap-2 md:gap-3 w-full">
        <span className="text-lg md:text-2xl shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 truncate">{label}</p>
          <p className="mt-0.5 md:mt-1 text-base md:text-xl font-bold text-brand-black truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}
