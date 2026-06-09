import { Link } from 'react-router-dom';

/* Inline SVG social icons */
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FOOTER_COLS = [
  {
    heading: 'Collections',
    links: [
      { label: 'Flower Boxes', to: '/products?category=flower-boxes' },
      { label: 'Signature Boxes Collection', to: '/products?category=signature-boxes' },
      { label: 'Interior Vase Bouquets', to: '/products?category=interior-vase-bouquets' },
      { label: 'Interior Statement Pieces', to: '/products?category=interior-statement-pieces' },
      { label: 'Seasonal Collections', to: '/products?category=seasonal-collections' },
      { label: 'Wedding Flowers', to: '/products?category=wedding-flowers' },
      { label: 'B2B Solutions', to: '/products?category=b2b-solutions' },
      { label: 'Gifts', to: '/products?category=gifts' },
    ],
  },
  {
    heading: 'Information',
    links: [
      { label: 'What Are Preserved Flowers?', to: '/about' },
      { label: 'Flower Care', to: '/faq' },
      { label: 'Bespoke Design', to: '/bespoke' },
      { label: 'About Us', to: '/about' },
      { label: 'Blog / Journal', to: '/blog' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'My Account', to: '/dashboard' },
      { label: 'My Orders', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Track Order', to: '/orders' },
      { label: 'Register', to: '/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#f9f5f3', color: '#1a1a1a' }}>
      {/* Main Footer */}
      <div className="container-site py-12 md:py-16 px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 300, fontSize: 20,
                letterSpacing: '0.35em', color: '#1a1a1a',
                textTransform: 'uppercase', display: 'block', marginBottom: 20,
              }}>
                ROSE & IVY
              </span>
            </Link>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(26,26,26,0.65)', lineHeight: 1.85, marginBottom: 28, maxWidth: 260 }}>
              Dubai's luxury eternal flowers boutique. Bio-preserved arrangements that last over a year — no water, no maintenance, just timeless beauty.
            </p>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(26,26,26,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Contact</p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(26,26,26,0.8)', marginBottom: 6 }}>
                <a href="tel:+971585711388" style={{ color: 'inherit', textDecoration: 'none' }}>+971 58 571 1388</a>
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(26,26,26,0.8)', marginBottom: 6 }}>
                <a href="mailto:info@roseivy.ae" style={{ color: 'inherit', textDecoration: 'none' }}>info@roseivy.ae</a>
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(26,26,26,0.8)' }}>Dubai, UAE</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: InstagramIcon, href: 'https://instagram.com/inbloom.dubai' },
                { icon: FacebookIcon, href: 'https://facebook.com' },
                { icon: WhatsAppIcon, href: 'https://wa.me/971585711388' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href} href={href} target="_blank" rel="noreferrer"
                  style={{
                    width: 36, height: 36, border: '1px solid rgba(26,26,26,0.2)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(26,26,26,0.75)', transition: 'border-color 0.25s, color 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1AFA1'; e.currentTarget.style.color = '#D1AFA1'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.2)'; e.currentTarget.style.color = 'rgba(26,26,26,0.75)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <h3 style={{
                fontFamily: 'Inter', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(26,26,26,0.55)', marginBottom: 24,
              }}>{col.heading}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(26,26,26,0.75)', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s ease' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#D1AFA1'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(26,26,26,0.75)'}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(26,26,26,0.08)' }}>
        <div className="container-site py-6 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(26,26,26,0.5)', letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} Rose & Ivy Floral Boutique. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'COD'].map(pm => (
              <span key={pm} style={{
                fontFamily: 'Inter', fontSize: 10, fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(26,26,26,0.55)', border: '1px solid rgba(26,26,26,0.15)',
                padding: '4px 8px', borderRadius: 2,
              }}>{pm}</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {['Privacy Policy', 'Terms', 'Cookies'].map(l => (
              <Link key={l} to="/" style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(26,26,26,0.5)', textDecoration: 'none', letterSpacing: '0.05em' }}
                onMouseEnter={e => e.currentTarget.style.color = '#D1AFA1'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(26,26,26,0.5)'}
              >{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
