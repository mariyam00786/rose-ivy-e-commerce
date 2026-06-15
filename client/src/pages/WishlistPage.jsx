import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import api from '../api/axiosConfig';
import { getProductImage } from '../utils/imageUtils';
import { toast } from 'react-toastify';
import { EmptyState } from '../components/ui';

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
      <div className="bg-[#f9f5f3] min-h-[80vh] pt-12 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="font-inter text-[10px] tracking-[0.25em] uppercase text-[#D1AFA1]">Account</span>
            <h1 className="font-raleway font-light text-2xl md:text-4xl text-[#1a1a1a] tracking-wide mt-2">My Wishlist</h1>
          </div>
          <div className="bg-white p-10 md:p-20 text-center">
            <Heart size={48} className="text-[#D1AFA1] mx-auto mb-5" />
            <h2 className="font-raleway font-light text-xl md:text-2xl text-[#1a1a1a] mb-3">Please log in</h2>
            <p className="font-inter text-[13px] text-[#888] mb-8">Log in to view and manage your wishlist.</p>
            <Link to="/login" className="inline-block px-8 py-3 bg-[#1a1a1a] text-white font-inter text-[11px] tracking-[0.15em] uppercase no-underline">Log In</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#f9f5f3] min-h-[80vh] pt-12 pb-16 px-4 text-center">
        <p className="font-inter text-sm text-[#888] mt-24">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-[#f9f5f3] min-h-[80vh] pt-12 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="font-inter text-[10px] tracking-[0.25em] uppercase text-[#D1AFA1]">Account</span>
            <h1 className="font-raleway font-light text-2xl md:text-4xl text-[#1a1a1a] tracking-wide mt-2">My Wishlist</h1>
          </div>
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save your favourite arrangements to your wishlist by clicking the heart icon on any product."
            actionLabel="Explore Collections"
            actionTo="/products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f5f3] min-h-[80vh] pt-12 pb-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="font-inter text-[10px] tracking-[0.25em] uppercase text-[#D1AFA1]">Account</span>
          <h1 className="font-raleway font-light text-2xl md:text-4xl text-[#1a1a1a] tracking-wide mt-2">My Wishlist</h1>
          <p className="font-inter text-[13px] text-[#888] mt-2">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map(product => (
            <div key={product._id} className="bg-white rounded-xl overflow-hidden border border-[#f0e8e4] relative">
              <Link to={`/products/${product.slug}`}>
                <img src={getProductImage(product)} alt={product.name} className="w-full aspect-[4/5] object-cover" />
              </Link>
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-3 right-3 bg-white border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer shadow-md"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
              <div className="p-4">
                <Link to={`/products/${product.slug}`} className="no-underline">
                  <h3 className="font-raleway font-medium text-[15px] text-[#1a1a1a] m-0 line-clamp-1">{product.name}</h3>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="font-inter text-sm font-semibold text-[#D1AFA1]">{formatPrice(product.salePrice)}</span>
                      <span className="font-inter text-xs text-[#aaa] line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="font-inter text-sm font-semibold text-[#1a1a1a]">{formatPrice(product.price)}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full py-3 bg-[#1a1a1a] text-white border-none rounded-lg font-inter text-[11px] tracking-[0.12em] uppercase cursor-pointer flex items-center justify-center gap-2 hover:bg-[#D1AFA1] transition-colors"
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
