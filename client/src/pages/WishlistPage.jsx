import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function WishlistPage() {
  const { addToCart } = useCart();

  return (
    <div style={{ background: '#f9f5f3', minHeight: '80vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1' }}>Account</span>
          <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 36, color: '#1a1a1a', letterSpacing: '0.03em', marginTop: 8 }}>My Wishlist</h1>
        </div>
        <div style={{ background: '#fff', padding: '80px 40px', textAlign: 'center' }}>
          <Heart size={48} style={{ color: '#D1AFA1', margin: '0 auto 20px' }} />
          <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 24, color: '#1a1a1a', marginBottom: 12 }}>Your wishlist is empty</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginBottom: 32 }}>
            Save your favourite arrangements to your wishlist by clicking the heart icon on any product.
          </p>
          <Link to="/products" style={{
            display: 'inline-block', padding: '13px 32px', background: '#1a1a1a', color: '#fff',
            fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
          }}>Explore Collections</Link>
        </div>
      </div>
    </div>
  );
}
