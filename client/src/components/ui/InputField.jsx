export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs uppercase tracking-widest font-medium text-gray-500 mb-1.5 font-sans">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/30 transition bg-white text-brand-black placeholder-gray-400 ${error ? 'border-red-400' : 'border-rose-200'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-sans">{error}</p>}
    </div>
  );
}
