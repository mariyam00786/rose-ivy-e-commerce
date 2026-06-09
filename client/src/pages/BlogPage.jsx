import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const POSTS = [
  { slug: 'art-of-preserved-roses', category: 'Preservation', title: 'The Art of Preserved Roses', excerpt: 'Discover the meticulous process behind bio-preserving roses to retain their natural beauty for years without water or maintenance.', date: 'May 12, 2026', img: 'https://inbloom.ae/wp-content/uploads/61611C01-32D3-4F9A-8574-A42D3862F129.jpg' },
  { slug: 'styling-home-eternal-blooms', category: 'Interior Design', title: 'Styling Your Home with Eternal Blooms', excerpt: 'Interior designers share their favourite ways to incorporate preserved flower arrangements into modern luxury living spaces.', date: 'Apr 28, 2026', img: 'https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp' },
  { slug: 'wedding-preserved-flowers', category: 'Weddings', title: 'Wedding Trends: Preserved Flower Bouquets', excerpt: 'Why more brides in the UAE are choosing preserved flower bouquets as keepsakes that last long after the wedding day.', date: 'Apr 5, 2026', img: 'https://inbloom.ae/wp-content/uploads/2026/01/DO01050011.jpg' },
  { slug: 'seasonal-collections-guide', category: 'Collections', title: 'Our New Seasonal Collection: Summer 2026', excerpt: 'Sunflowers, orchids, and tropical blooms take centre stage in our latest seasonal preserved flower collection.', date: 'Mar 18, 2026', img: 'https://inbloom.ae/wp-content/uploads/2025/05/L1080140-Photoroom-3.jpg' },
];

export default function BlogPage() {
  const [featured, ...rest] = POSTS;
  return (
    <div style={{ background: '#fff' }}>
      <section style={{ background: '#1a1a1a', padding: '100px 0 60px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>Stories & Inspiration</span>
        <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 52, color: '#fff', letterSpacing: '0.04em' }}>The Journal</h1>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container-site">
          {posts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-12 bg-[#f9f5f3]">
            <div style={{ position: 'relative', aspectRatio: '4/3' }}>
              <img src={featured.img} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D1AFA1', marginBottom: 16, display: 'block' }}>{featured.category}</span>
              <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 32, color: '#1a1a1a', letterSpacing: '0.03em', marginBottom: 16, lineHeight: 1.2 }}>{featured.title}</h2>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#777', lineHeight: 1.85, marginBottom: 24 }}>{featured.excerpt}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#bbb', marginBottom: 28, letterSpacing: '0.08em' }}>{featured.date}</p>
              <Link to={`/blog/${featured.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', textDecoration: 'none', borderBottom: '1px solid #1a1a1a', paddingBottom: 2, width: 'fit-content' }}>
                Read Article <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
          )}

          {posts.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {posts.slice(1).map((post, i) => (
              <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ overflow: 'hidden', aspectRatio: '3/2', marginBottom: 20 }}>
                    <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 10 }}>{post.category}</span>
                  <h3 style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: 20, color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 10, lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#888', lineHeight: 1.7, marginBottom: 12 }}>{post.excerpt}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#bbb', letterSpacing: '0.06em' }}>{post.date}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
