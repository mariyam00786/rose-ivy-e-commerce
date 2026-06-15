export default function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-brand-black">{value}</p>
        </div>
      </div>
    </div>
  );
}
