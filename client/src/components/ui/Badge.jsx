const colorMap = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  admin: 'bg-purple-100 text-purple-800',
  user: 'bg-gray-100 text-gray-600',
};

export default function Badge({ label, variant, className = '' }) {
  const colors = colorMap[variant] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors} ${className}`}>
      {label}
    </span>
  );
}
