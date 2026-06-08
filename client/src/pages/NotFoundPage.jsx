import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flower, Leaf, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '60px 20px', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(80px, 18vw, 160px)', color: '#f0ebe8', lineHeight: 1, marginBottom: -20 }}>404</p>
        <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(20px, 4vw, 32px)', color: '#1a1a1a', letterSpacing: '0.05em', marginBottom: 16 }}>
          The page you're looking for has bloomed elsewhere
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#888', marginBottom: 48, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 48px' }}>
          The page you are looking for might have been moved, renamed, or may no longer exist.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{
            display: 'inline-block', padding: '14px 36px', background: '#1a1a1a', color: '#fff',
            fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'background 0.25s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#D1AFA1'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
          >Return to Boutique</Link>
          <Link to="/products" style={{
            display: 'inline-block', padding: '14px 36px', background: 'transparent', color: '#1a1a1a',
            fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none',
            border: '1px solid #1a1a1a', transition: 'background 0.25s, color 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a1a1a'; }}
          >Browse Collections</Link>
        </div>
      </motion.div>
    </div>
  );
}
