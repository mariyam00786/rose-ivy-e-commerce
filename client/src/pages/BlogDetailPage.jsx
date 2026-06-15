import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const POSTS = {
  'art-of-preserved-roses': { category: 'Preservation', title: 'The Art of Preserved Roses', date: 'May 12, 2026', img: 'https://inbloom.ae/wp-content/uploads/61611C01-32D3-4F9A-8574-A42D3862F129.jpg', content: 'Preserved roses represent the pinnacle of botanical artistry. Through a meticulous bio-preservation process developed in Europe, natural sap is gently replaced with plant-based glycerin solutions, maintaining every petal\'s softness, colour, and natural scent for years to come.\n\nAt Rose & Ivy, we source only the finest roses from premium growers in Ecuador, Kenya, and the Netherlands — each selected at peak bloom. The preservation process takes several weeks and requires precise temperature and humidity controls to achieve results that are indistinguishable from fresh.\n\nThe result is a flower that never wilts, never sheds, and never requires water. A single preserved rose arrangement can grace your home for 1–3 years, making it a truly sustainable and luxurious choice.' },
  'styling-home-eternal-blooms': { category: 'Interior Design', title: 'Styling Your Home with Eternal Blooms', date: 'Apr 28, 2026', img: 'https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp', content: 'Preserved flowers have become a staple in luxury interior design across Dubai and the wider GCC. Interior designers praise them for their versatility, longevity, and the effortless elegance they bring to any space.\n\nFrom sculptural statement vases in hotel lobbies to intimate bedroom arrangements, preserved flowers adapt to any aesthetic. They pair beautifully with minimalist, contemporary, and traditional décors alike.\n\nOur interior design clients often choose our preserved flower arrangements for client-facing spaces — boardrooms, reception areas, and hospitality suites — where consistently beautiful florals are essential but regular replacement impractical.' },
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = POSTS[slug];

  if (!post) return (
    <div style={{ padding: '120px 40px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 32, color: '#1a1a1a', marginBottom: 20 }}>Post not found</h2>
      <Link to="/blog" style={{ color: '#D1AFA1', fontFamily: 'Inter', fontSize: 12 }}>Back to Journal</Link>
    </div>
  );

  return (
    <div style={{ background: '#fff' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 20px 100px' }}>
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', marginBottom: 48 }}
          onMouseEnter={e => e.currentTarget.style.color = '#D1AFA1'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>{post.category}</span>
        <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 44, color: '#1a1a1a', letterSpacing: '0.03em', lineHeight: 1.15, marginBottom: 16 }}>{post.title}</h1>
        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#bbb', letterSpacing: '0.08em', marginBottom: 40 }}>{post.date}</p>

        <div style={{ overflow: 'hidden', aspectRatio: '16/7', marginBottom: 52 }}>
          <img src={post.img} alt={post.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {post.content.split('\n\n').map((para, i) => (
          <p key={i} style={{ fontFamily: 'Inter', fontSize: 15, color: '#444', lineHeight: 1.95, marginBottom: 24 }}>{para}</p>
        ))}
      </div>
    </div>
  );
}
