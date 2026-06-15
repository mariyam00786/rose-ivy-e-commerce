export default function SectionHeader({ title, action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      <h1 className="text-2xl font-semibold tracking-wide">{title}</h1>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-full bg-brand-black px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-brand-rose transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
