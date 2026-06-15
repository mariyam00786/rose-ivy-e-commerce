import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('welcome-popup-shown');
    if (!shown) {
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    sessionStorage.setItem('welcome-popup-shown', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={close}>
      <div className="popup-content welcome-popup" onClick={e => e.stopPropagation()}>
        <button onClick={close} className="popup-close" aria-label="Close">
          <X size={20} />
        </button>
        <div style={{ textAlign: 'center', padding: '40px 32px' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>
            Welcome Gift
          </span>
          <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(24px, 4vw, 32px)', color: '#1a1a1a', letterSpacing: '0.03em', marginBottom: 16, lineHeight: 1.2 }}>
            Get 10% OFF<br />Your First Order
          </h2>
          <div style={{ width: 40, height: 1, background: '#D1AFA1', margin: '0 auto 20px' }} />
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#555', lineHeight: 1.8, marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
            Use code <strong style={{ color: '#1a1a1a', letterSpacing: '0.1em' }}>ROSE10</strong> at checkout to enjoy 10% off your first preserved flower arrangement.
          </p>
          <div style={{ background: '#f9f5f3', border: '1px dashed #D1AFA1', padding: '14px 24px', display: 'inline-block', marginBottom: 24 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 600, letterSpacing: '0.2em', color: '#1a1a1a' }}>ROSE10</span>
          </div>
          <br />
          <button
            onClick={close}
            style={{ padding: '13px 32px', background: '#1a1a1a', color: '#fff', border: 'none', fontFamily: 'Inter', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.25s ease', minHeight: 44 }}
            onMouseEnter={e => e.currentTarget.style.background = '#D1AFA1'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
