import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookies-accepted')) {
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookies-accepted', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p style={{ flex: 1, margin: 0, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)' }}>
        We use cookies to enhance your experience. By continuing to browse, you agree to our{' '}
        <Link to="/" style={{ color: '#D1AFA1', textDecoration: 'underline' }}>cookie policy</Link>.
      </p>
      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        <button onClick={accept} style={{ padding: '10px 24px', background: '#D1AFA1', color: '#fff', border: 'none', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Accept
        </button>
        <button onClick={() => setVisible(false)} style={{ padding: '10px 20px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer' }}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
