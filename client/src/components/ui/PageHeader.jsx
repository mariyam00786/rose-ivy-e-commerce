export default function PageHeader({ subtitle, title, description, theme = 'light', centered = true }) {
  if (theme === 'dark') {
    return (
      <section style={{ background: '#1a1a1a', padding: '100px 0 60px', textAlign: 'center' }}>
        {subtitle && (
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>
            {subtitle}
          </span>
        )}
        <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(32px, 5vw, 52px)', color: '#fff', letterSpacing: '0.04em', margin: 0 }}>
          {title}
        </h1>
        {description && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#aaa', marginTop: 16, maxWidth: 500, marginInline: 'auto' }}>{description}</p>
        )}
      </section>
    );
  }

  return (
    <div className={`mb-8 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-brand-rose block mb-2">{subtitle}</span>
      )}
      <h1 className="font-raleway font-light text-2xl md:text-4xl text-brand-black tracking-wide">{title}</h1>
      {description && <p className="mt-3 font-sans text-sm text-gray-500">{description}</p>}
    </div>
  );
}
