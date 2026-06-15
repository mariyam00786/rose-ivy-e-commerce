import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-brand-black text-white hover:bg-brand-rose disabled:opacity-60',
  outline: 'border border-brand-black text-brand-black hover:bg-brand-black hover:text-white',
  danger: 'border border-red-500 bg-white text-red-600 hover:bg-red-500 hover:text-white',
  ghost: 'text-gray-600 hover:bg-rose-50',
};

const sizes = {
  sm: 'px-4 py-1.5 text-[10px]',
  md: 'px-6 py-2.5 text-xs',
  lg: 'px-8 py-3 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  icon,
  as,
  to,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-[0.15em] transition font-sans';
  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (as === 'link' || to) {
    return (
      <Link to={to} className={classes} {...props}>
        {icon && <span>{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled || loading} className={classes} {...props}>
      {icon && <span>{icon}</span>}
      {loading ? (loadingText || 'Loading…') : children}
    </button>
  );
}
