import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import api from '../api/axiosConfig';
import { getProductImage } from '../utils/imageUtils';
import { toast } from 'react-toastify';

export default function WishlistPage() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlistItems(data.wishlist || data || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.post('/wishlist/toggle', { productId });
      setWishlistItems(prev => prev.filter(item => (item._id || item) !== productId));
      toast.info('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (!user) {
    return (
      <div style={{ background: '#f9f5f3', minHeight: '80vh', padding: '60px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1' }}>Account</span>
            <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 36, color: '#1a1a1a', letterSpacing: '0.03em', marginTop: 8 }}>My Wishlist</h1>
          </div>
          <div style={{ background: '#fff', padding: '80px 40px', textAlign: 'center' }}>
            <Heart size={48} style={{ color: '#D1AFA1', margin: '0 auto 20px' }} />
            <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 24, color: '#1a1a1a', marginBottom: 12 }}>Please log in</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginBottom: 32 }}>
              Log in to view and manage your wishlist.
            </p>
            <Link to="/login" style={{
              display: 'inline-block', padding: '13px 32px', background: '#1a1a1a', color: '#fff',
              fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Log In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ background: '#f9f5f3', minHeight: '80vh', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#888', marginTop: 100 }}>Loading wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
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

  return (
    <div style={{ background: '#f9f5f3', minHeight: '80vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1' }}>Account</span>
          <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 36, color: '#1a1a1a', letterSpacing: '0.03em', marginTop: 8 }}>My Wishlist</h1>
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginTop: 8 }}>{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {wishlistItems.map(product => (
            <div key={product._id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #f0e8e4', position: 'relative' }}>
              <Link to={`/products/${product.slug}`}>
                <img src={getProductImage(product)} alt={product.name} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
              </Link>
              <button
                onClick={() => handleRemove(product._id)}
                style={{ position: 'absolute', top: 12, right: 12, background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <Trash2 size={16} style={{ color: '#e53e3e' }} />
              </button>
              <div style={{ padding: '16px 20px' }}>
                <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontFamily: 'Raleway', fontWeight: 500, fontSize: 15, color: '#1a1a1a', margin: 0 }}>{product.name}</h3>
                </Link>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {product.salePrice ? (
                    <>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#D1AFA1' }}>{formatPrice(product.salePrice)}</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{formatPrice(product.price)}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{ marginTop: 14, width: '100%', padding: '11px 0', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
