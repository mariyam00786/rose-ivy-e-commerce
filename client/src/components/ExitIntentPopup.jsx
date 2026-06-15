import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('exit-intent-shown');
    if (shown) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !triggered.current) {
        triggered.current = true;
        setVisible(true);
        sessionStorage.setItem('exit-intent-shown', '1');
      }
    };

    // Only trigger on desktop
    if (window.innerWidth > 768) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const close = () => setVisible(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setVisible(false), 2000);
    }
  };

  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={close}>
      <div className="popup-content exit-popup" onClick={e => e.stopPropagation()}>
        <button onClick={close} className="popup-close" aria-label="Close">
          <X size={20} />
        </button>
        <div style={{ textAlign: 'center', padding: '40px 32px' }}>
          <span style={{ fontSize: 32, display: 'block', marginBottom: 16 }}>🌸</span>
          <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(22px, 3.5vw, 28px)', color: '#1a1a1a', letterSpacing: '0.03em', marginBottom: 12, lineHeight: 1.2 }}>
            Wait! Don't leave<br />without your gift
          </h2>
          <div style={{ width: 40, height: 1, background: '#D1AFA1', margin: '0 auto 20px' }} />
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#555', lineHeight: 1.8, marginBottom: 28, maxWidth: 340, margin: '0 auto 28px' }}>
            Subscribe to our newsletter and receive an exclusive 15% discount on your next order of eternal flowers.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '0 auto' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  width: '100%', padding: '12px 16px', border: '1px solid #e8e0db',
                  background: '#fff', fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a',
                  outline: 'none', marginBottom: 12, transition: 'border-color 0.25s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'}
              />
              <button
                type="submit"
                style={{ width: '100%', padding: '13px 32px', background: '#D1AFA1', color: '#fff', border: 'none', fontFamily: 'Inter', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.25s ease', minHeight: 44 }}
                onMouseEnter={e => e.currentTarget.style.background = '#b48877'}
                onMouseLeave={e => e.currentTarget.style.background = '#D1AFA1'}
              >
                Get My 15% Off
              </button>
            </form>
          ) : (
            <div style={{ padding: '20px 0' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#D1AFA1', fontWeight: 500 }}>
                ✓ Thank you! Check your inbox for your discount code.
              </p>
            </div>
          )}

          <p style={{ fontFamily: 'Inter', fontSize: 10, color: '#aaa', marginTop: 20, letterSpacing: '0.05em' }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
