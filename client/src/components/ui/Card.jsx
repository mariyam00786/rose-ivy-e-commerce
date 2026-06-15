export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`rounded-2xl border border-rose-100 bg-white p-5 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
