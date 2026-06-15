import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem('cookie-consent');
    if (!pref) {
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" style={{ animation: 'fadeIn 0.3s ease' }}>
      <p style={{ flex: 1, margin: 0, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
        We use cookies to enhance your browsing experience and provide personalized content. By continuing, you agree to our{' '}
        <Link to="/" style={{ color: '#D1AFA1', textDecoration: 'underline' }}>cookie policy</Link>.
      </p>
      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        <button onClick={accept} style={{ padding: '10px 24px', background: '#D1AFA1', color: '#fff', border: 'none', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', minHeight: 44, minWidth: 44 }}>
          Accept
        </button>
        <button onClick={decline} style={{ padding: '10px 20px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase', minHeight: 44, minWidth: 44 }}>
          Decline
        </button>
      </div>
    </div>
  );
}
