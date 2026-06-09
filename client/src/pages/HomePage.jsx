import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Clock } from 'lucide-react';
import api from '../api/axiosConfig';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { getFallbackImage, getProductImage } from '../utils/imageUtils';
import { DEMO_PRODUCTS } from '../utils/demoData';

/* ─── CATEGORY BANNERS (matching inbloom.ae) ─── */
const CATEGORIES = [
  {
    id: 1,
    title: 'Flower Boxes',
    subtitle: 'Timeless gifts wrapped in elegance',
    to: '/products?category=flower-boxes',
    img: 'https://inbloom.ae/wp-content/uploads/61611C01-32D3-4F9A-8574-A42D3862F129.jpg',
    tall: true,
  },
  {
    id: 2,
    title: 'Signature Boxes Collection',
    subtitle: 'Premium preserved flower arrangements for elevated gifts and interiors.',
    to: '/products?category=signature-boxes',
    img: 'https://inbloom.ae/wp-content/uploads/706719212_17960656125104145_777686201114964296_n.jpg',
  },
  {
    id: 3,
    title: 'Interior Vase Bouquets',
    subtitle: 'Elegant preserved arrangements designed for refined interiors.',
    to: '/products?category=interior-vase-bouquets',
    img: 'https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp',
    alignRight: true,
  },
  {
    id: 4,
    title: 'Wedding Flowers',
    subtitle: 'Timeless preserved flowers for weddings and lasting memories.',
    to: '/products?category=wedding-flowers',
    img: 'https://inbloom.ae/wp-content/uploads/2026/01/DO01050011.jpg',
    tall: true,
  },
  {
    id: 5,
    title: 'Seasonal Collections',
    subtitle: 'Limited-edition preserved flower arrangements inspired by each season.',
    to: '/products?category=seasonal-collections',
    img: 'https://inbloom.ae/wp-content/uploads/2025/05/L1080140-Photoroom-3.jpg',
  },
  {
    id: 6,
    title: 'Interior Statement Pieces',
    subtitle: 'Large preserved designs for refined interiors.',
    to: '/products?category=interior-statement-pieces',
    img: 'https://inbloom.ae/wp-content/uploads/2025/05/green-orchids-Photoroom-7-e1746599286884.jpg',
  },
];

const FEATURES = [
  { icon: Clock, label: 'Lasts 1+ Year', desc: 'No water, no maintenance required' },
  { icon: Truck, label: 'Free Delivery', desc: 'On orders over AED 350 in Dubai' },
  { icon: Shield, label: 'Bio-Preserved', desc: 'Sustainable & eco-friendly process' },
  { icon: RefreshCw, label: 'Easy Returns', desc: '7-day return guarantee' },
];

/* ─── INVIEW HOOK ─── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── BANNER CARD ─── */
function BannerCard({ cat, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={cat.to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'block', overflow: 'hidden',
        textDecoration: 'none', cursor: 'pointer', ...style,
      }}
    >
      <img
        src={cat.img}
        alt={cat.title}
        loading="lazy"
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transition: 'transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.08) 55%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 55%)',
        transition: 'background 0.4s ease',
      }} />
      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 0,
        left: cat.alignRight ? 'auto' : 0,
        right: cat.alignRight ? 0 : 'auto',
        padding: '28px 26px',
        textAlign: cat.alignRight ? 'right' : 'left',
        color: '#fff',
      }}>
        <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 20, letterSpacing: '0.05em', marginBottom: 6, lineHeight: 1.2 }}>{cat.title}</h2>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 14, lineHeight: 1.5, maxWidth: 220, marginLeft: cat.alignRight ? 'auto' : 0 }}>{cat.subtitle}</p>
        <span style={{
          display: 'inline-block', padding: '7px 18px',
          border: '1px solid rgba(255,255,255,0.7)', color: '#fff',
          fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          Explore
        </span>
      </div>
    </Link>
  );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ product }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [imgHovered, setImgHovered] = useState(false);
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div
      style={{ background: '#fff', position: 'relative' }}
      onMouseEnter={() => setImgHovered(true)}
      onMouseLeave={() => setImgHovered(false)}
    >
      {hasDiscount && (
        <span style={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          background: '#e74c3c', color: '#fff',
          fontFamily: 'Inter', fontSize: 10, fontWeight: 600,
          padding: '3px 8px', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>Sale</span>
      )}
      <Link to={`/products/${product.slug || product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#f9f5f3' }}>
          <img
            src={getProductImage(product)}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: imgHovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        </div>
        <div style={{ padding: '16px 4px 8px' }}>
          <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
            {product.category?.name || 'Preserved Flowers'}
          </p>
          <h3 style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: 15, color: '#1a1a1a', letterSpacing: '0.03em', marginBottom: 8, lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#D1AFA1' }}>
              {formatPrice(product.salePrice || product.price)}
            </span>
            {hasDiscount && (
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
      {/* Add to Cart on hover */}
      <div style={{
        overflow: 'hidden', maxHeight: imgHovered ? 48 : 0,
        transition: 'max-height 0.3s ease',
      }}>
        <button
          onClick={() => addToCart(product, 1)}
          style={{
            width: '100%', padding: '12px', background: '#1a1a1a', color: '#fff',
            fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            border: 'none', cursor: 'pointer',
            transition: 'background 0.25s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#D1AFA1'}
          onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─── HOMEPAGE ─── */
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroRef, heroVisible] = useInView(0.1);
  const [featRef, featVisible] = useInView(0.1);
  const [prodRef, prodVisible] = useInView(0.1);
  const [whyRef, whyVisible] = useInView(0.1);

  useEffect(() => {
    api.get('/products?limit=8&sort=newest')
      .then(({ data }) => {
        const prods = data.products || data || [];
        setProducts(prods.length > 0 ? prods : DEMO_PRODUCTS);
      })
      .catch(() => {
        console.warn('Backend API failed to load products. Using fallback DEMO_PRODUCTS.');
        setProducts(DEMO_PRODUCTS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#fff' }}>

      {/* ═══════════════════════════════════════
          HERO — Full-screen video background
      ═══════════════════════════════════════ */}
      <section style={{ position: 'relative', width: '100%', height: '100vh', minHeight: 600, overflow: 'hidden', background: '#1a1a1a' }}>
        {/* Hero Image Background */}
        <img
          src="https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp"
          alt="In Bloom Luxury Eternal Flowers"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,26,26,0.6) 0%, rgba(26,26,26,0.2) 70%, rgba(26,26,26,0.05) 100%)' }} />

        {/* Hero Content */}
        <div ref={heroRef} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', padding: '0 20px', maxWidth: 800, margin: '0 auto' }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(36px, 6vw, 72px)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: 20 }}
          >
            Real flowers, bio-preserved<br />to last a year
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}
          >
            Eternal Flowers Boutique <strong style={{ fontWeight: 500 }}>Dubai</strong>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.55 }}
            style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}
          >
            IN BLOOM is the floral atelier in Dubai dedicated exclusively to bio-preserved flower arrangements that last over a year without water or any maintenance. Blending sustainability with luxury, we craft timeless floral designs that elevate interiors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.7 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link to="/products" className="btn-primary" style={{ background: '#fff', color: '#1a1a1a', padding: '14px 32px', border: 'none', letterSpacing: '0.1em' }}>To Shop</Link>
            <Link to="/about" className="btn-outlined" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff', padding: '14px 32px', letterSpacing: '0.1em' }}>What Are Preserved Flowers?</Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))', animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORY BANNER GRID (matching inbloom.ae exactly)
      ═══════════════════════════════════════ */}
      <section>
        {/* Row 1: 3 equal columns, tall item on left */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gridAutoRows: '300px' }}>
          {/* Tall card spanning 2 rows */}
          <div className="md:col-span-1 md:row-span-2 h-[300px] md:h-full">
            <BannerCard cat={CATEGORIES[0]} style={{ height: '100%' }} />
          </div>
          <div className="md:col-span-1 md:row-span-1 h-[300px] md:h-full">
            <BannerCard cat={CATEGORIES[1]} style={{ height: '100%' }} />
          </div>
          <div className="md:col-span-1 md:row-span-1 h-[300px] md:h-full">
            <BannerCard cat={CATEGORIES[2]} style={{ height: '100%' }} />
          </div>
          <div className="md:col-span-2 md:row-span-1 h-[300px] md:h-full">
            <BannerCard cat={CATEGORIES[5]} style={{ height: '100%' }} />
          </div>
        </div>

        {/* Row 2: Wedding tall left + 2 stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gridAutoRows: '300px' }}>
          <div className="md:col-span-1 md:row-span-2 h-[300px] md:h-full">
            <BannerCard cat={CATEGORIES[3]} style={{ height: '100%' }} />
          </div>
          <div className="md:col-span-1 md:row-span-1 h-[300px] md:h-full">
            <BannerCard cat={CATEGORIES[4]} style={{ height: '100%' }} />
          </div>
          <div className="md:col-span-1 md:row-span-1 h-[300px] md:h-full">
            <BannerCard cat={CATEGORIES[5]} style={{ height: '100%' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES BAR
      ═══════════════════════════════════════ */}
      <section ref={featRef} style={{ background: '#f9f5f3', padding: '48px 0' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex items-center gap-4 px-4 md:px-8 border-b md:border-b-0 md:border-r border-black/5 last:border-b-0 last:border-r-0 pb-6 md:pb-0"
                >
                  <Icon size={24} style={{ color: '#D1AFA1', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#555', lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEW ARRIVALS
      ═══════════════════════════════════════ */}
      <section ref={prodRef} style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container-site">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
            <div>
              <span className="section-label">New Arrivals</span>
              <h2 className="section-title">Latest Collections</h2>
              <div className="section-divider" />
            </div>
            <Link to="/products" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#1a1a1a', textDecoration: 'none',
              borderBottom: '1px solid #1a1a1a', paddingBottom: 2,
              transition: 'color 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#D1AFA1'}
              onMouseLeave={e => e.currentTarget.style.color = '#1a1a1a'}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ background: '#f9f5f3', aspectRatio: '3/4', borderRadius: 2 }} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
              initial={{ opacity: 0 }}
              animate={prodVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              {(products.length > 0 ? products : DEMO_PRODUCTS).slice(0, 8).map((p, i) => (
                <motion.div
                  key={p._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={prodVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BESPOKE BANNER
      ═══════════════════════════════════════ */}
      <section style={{ position: 'relative', height: 500, overflow: 'hidden', background: '#1a1a1a' }}>
        <img
          src="https://inbloom.ae/wp-content/uploads/2026/01/DO01050011.jpg"
          alt="Bespoke"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
          loading="lazy"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.4)' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 40px' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>Exclusive Service</span>
          <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(28px, 5vw, 56px)', color: '#fff', letterSpacing: '0.05em', marginBottom: 20, lineHeight: 1.15 }}>
            Bespoke Floral Design
          </h2>
          <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.78)', maxWidth: 520, lineHeight: 1.8, marginBottom: 36 }}>
            Commission a one-of-a-kind preserved floral arrangement tailored to your space, event, or sentiment. Our artisans will craft it exclusively for you.
          </p>
          <Link to="/bespoke" className="btn-outlined">Commission Your Design</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY PRESERVED FLOWERS
      ═══════════════════════════════════════ */}
      <section ref={whyRef} style={{ padding: '80px 0', background: '#f9f5f3' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={whyVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="section-label">Our Difference</span>
              <h2 className="section-title" style={{ marginBottom: 24 }}>Why Preserved Flowers?</h2>
              <div className="section-divider" />
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#555', lineHeight: 1.9, marginBottom: 20 }}>
                Unlike fresh flowers that wilt within days, our bio-preserved flowers retain their natural beauty for over a year — with zero water or maintenance required.
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#555', lineHeight: 1.9, marginBottom: 36 }}>
                Through a patented preservation process that replaces natural sap with plant-based solutions, each bloom retains its softness, color, and texture indefinitely. The result is a sustainable, luxurious alternative to fresh flowers.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                {['Last 1–3 years with proper care', 'Zero water or maintenance', 'Sustainably processed — no pesticides', 'Retain real texture, softness & color'].map(pt => (
                  <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 6, height: 6, background: '#D1AFA1', borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#555' }}>{pt}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-outlined-dark">Learn More</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={whyVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ position: 'relative' }}
            >
              <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
                <img
                  src="https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp"
                  alt="Preserved flowers"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                position: 'absolute', bottom: -24, right: -24,
                background: '#1a1a1a', padding: '24px 28px',
                fontFamily: 'Inter', color: '#fff',
              }}>
                <p style={{ fontSize: 32, fontWeight: 700, color: '#D1AFA1', lineHeight: 1 }}>1+</p>
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 4, color: 'rgba(255,255,255,0.7)' }}>Year Lifespan</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container-site">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>Happy Clients</span>
            <h2 className="section-title" style={{ textAlign: 'center' }}>What Our Clients Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                style={{ background: '#f9f5f3', padding: '36px 32px' }}
              >
                <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#D1AFA1" color="#D1AFA1" />)}
                </div>
                <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#555', lineHeight: 1.85, marginBottom: 24, fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <p style={{ fontFamily: 'Raleway', fontWeight: 600, fontSize: 13, color: '#1a1a1a', letterSpacing: '0.05em' }}>{t.name}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#D1AFA1', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          INSTAGRAM GRID
      ═══════════════════════════════════════ */}
      <section style={{ padding: '0 0 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>@roseandivy.ae</span>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Follow Our Story</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0 }}>
          {INSTA_IMGS.map((src, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer"
              style={{ display: 'block', aspectRatio: '1', overflow: 'hidden', position: 'relative' }}
            >
              <img src={src} alt="Instagram" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease, opacity 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
              />
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FREE DELIVERY BANNER
      ═══════════════════════════════════════ */}
      <section style={{ background: '#D1AFA1', padding: '28px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff' }}>
          Free delivery on orders over AED 350 within Dubai &nbsp;·&nbsp; 
          <Link to="/products" style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: 3 }}>Shop Now</Link>
        </p>
      </section>

    </div>
  );
}


const TESTIMONIALS = [
  { name: 'Fatima Al Mansoori', location: 'Dubai, UAE', text: 'The most beautiful preserved flowers I have ever seen. They still look as fresh as the day I received them, 8 months later. Truly a luxury experience.' },
  { name: 'Sarah Johnson', location: 'Abu Dhabi, UAE', text: 'Ordered a bespoke arrangement for my home. The team was incredibly professional and the result exceeded all my expectations. Will order again!' },
  { name: 'Emma Richards', location: 'Sharjah, UAE', text: 'Perfect for gifting. My friend was in tears when she received it. The packaging is exquisite and the flowers are absolutely stunning.' },
];

const INSTA_IMGS = [
  'https://inbloom.ae/wp-content/uploads/61611C01-32D3-4F9A-8574-A42D3862F129.jpg',
  'https://inbloom.ae/wp-content/uploads/706719212_17960656125104145_777686201114964296_n.jpg',
  'https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp',
  'https://inbloom.ae/wp-content/uploads/2026/01/DO01050011.jpg',
  'https://inbloom.ae/wp-content/uploads/2025/05/L1080140-Photoroom-3.jpg',
  'https://inbloom.ae/wp-content/uploads/2025/05/green-orchids-Photoroom-7-e1746599286884.jpg',
];
