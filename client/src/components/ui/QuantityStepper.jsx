export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center border border-rose-200 h-9 rounded">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="px-2.5 hover:bg-rose-50 text-brand-black font-light h-full disabled:opacity-40 transition"
      >
        −
      </button>
      <span className="px-3 text-xs font-light select-none">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="px-2.5 hover:bg-rose-50 text-brand-black font-light h-full disabled:opacity-40 transition"
      >
        +
      </button>
    </div>
  );
}
