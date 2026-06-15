import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Award, Heart } from 'lucide-react';

const VALUES = [
  { icon: Leaf, title: 'Sustainable Artistry', desc: 'Our bio-preservation process uses no pesticides or chemicals harmful to the environment. Each arrangement is crafted with respect for nature.' },
  { icon: Award, title: 'Uncompromised Quality', desc: 'Only the finest preserved roses, orchids, and botanicals sourced from premium growers across Europe and South America.' },
  { icon: Heart, title: 'Timeless Elegance', desc: 'Every arrangement is designed to complement refined interiors and elevate everyday spaces with enduring botanical beauty.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* Hero */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden', background: '#1a1a1a' }}>
        <img src="https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp" alt="About" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.4)' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 40px' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1AFA1', marginBottom: 16, display: 'block' }}>Our Story</span>
          <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(32px, 6vw, 60px)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1 }}>Our Philosophy</h1>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '80px 0' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>Who We Are</span>
              <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 40, color: '#1a1a1a', letterSpacing: '0.03em', marginBottom: 20 }}>Botanical Artistry,<br />Designed for Eternity</h2>
              <div style={{ width: 40, height: 1, background: '#D1AFA1', marginBottom: 24 }} />
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#555', lineHeight: 1.9, marginBottom: 16 }}>
                Rose & Ivy is Dubai's premier luxury preserved flowers boutique. Founded with a passion for botanical artistry, we create bio-preserved floral arrangements that last over a year — without water, without maintenance.
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#555', lineHeight: 1.9, marginBottom: 32 }}>
                Our flowers are sourced from the world's finest growers and preserved through a patented European process that replaces natural sap with plant-based solutions, retaining every petal's softness, color, and texture.
              </p>
              <Link to="/products" style={{ display: 'inline-block', padding: '13px 32px', background: '#1a1a1a', color: '#fff', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Explore Collections
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
                <img src="https://inbloom.ae/wp-content/uploads/61611C01-32D3-4F9A-8574-A42D3862F129.jpg" alt="Flower Box" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 0', background: '#f9f5f3' }}>
        <div className="container-site">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 12 }}>Our Values</span>
            <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 40, color: '#1a1a1a', letterSpacing: '0.03em' }}>What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  style={{ background: '#fff', padding: '40px 32px' }}>
                  <Icon size={28} style={{ color: '#D1AFA1', marginBottom: 20 }} />
                  <h3 style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: 20, color: '#1a1a1a', marginBottom: 12, letterSpacing: '0.02em' }}>{v.title}</h3>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#777', lineHeight: 1.85 }}>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '80px 0' }}>
        <div className="container-site">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 12 }}>The Process</span>
            <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 40, color: '#1a1a1a' }}>How We Preserve</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {['Harvest at Peak', 'Bio-Preserve', 'Artisan Design', 'Deliver'].map((step, i) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid #D1AFA1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontFamily: 'Raleway', fontSize: 20, fontWeight: 300, color: '#D1AFA1' }}>
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: 16, color: '#1a1a1a', marginBottom: 10 }}>{step}</h3>
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#888', lineHeight: 1.7 }}>
                  {['Flowers harvested at their most beautiful moment', 'Patented European bio-preservation technique', 'Crafted by our in-house artisan designers', 'Luxuriously packaged and delivered to your door'][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
