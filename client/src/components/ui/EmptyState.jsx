import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }) {
  return (
    <div className="bg-white p-10 md:p-20 text-center">
      {Icon && <Icon size={48} className="text-brand-rose mx-auto mb-5" />}
      <h2 className="font-raleway font-light text-xl md:text-2xl text-brand-black mb-3">{title}</h2>
      {description && <p className="font-sans text-[13px] text-gray-500 mb-8">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-block px-8 py-3 bg-brand-black text-white font-sans text-[11px] tracking-[0.15em] uppercase no-underline hover:bg-brand-rose transition"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
