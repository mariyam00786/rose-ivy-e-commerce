import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Maximize2, ChevronRight, Truck, Info, Calendar, ShieldCheck, HeartHandshake, Check } from 'lucide-react';
import api from '../api/axiosConfig';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFallbackImage, getProductImage } from '../utils/imageUtils';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import { DEMO_PRODUCTS } from '../utils/demoData';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  // Gallery states
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Tab state: 'desc', 'care', 'delivery'
  const [activeTab, setActiveTab] = useState('desc');

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mobile sticky bar state
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainCtaRef = useRef(null);

  // Fetch product on load
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        if (data && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.related || []);
          setActiveImageIdx(0);
          setQty(1);

          if (user) {
            setIsWishlisted(
              user.wishlist?.some(item => (item._id || item) === data.product._id) || false
            );
          }
        } else {
          throw new Error("No product returned");
        }
      } catch (err) {
        console.warn('Backend API failed. Falling back to DEMO_PRODUCTS.', err);
        const fallbackProduct = DEMO_PRODUCTS.find(p => p.slug === slug);
        if (fallbackProduct) {
          setProduct(fallbackProduct);
          setRelatedProducts(DEMO_PRODUCTS.filter(p => p.slug !== slug).slice(0, 4));
          setActiveImageIdx(0);
          setQty(1);
        } else {
          toast.error('Could not load product details');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, user]);

  // Handle scroll to toggle mobile sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (!mainCtaRef.current) return;
      const rect = mainCtaRef.current.getBoundingClientRect();
      // If the top of the main button is above the viewport, show sticky bar
      if (rect.bottom < 0 && window.innerWidth < 768) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center font-sans">
        <h2 className="font-serif text-3xl text-brand-black">Product Not Found</h2>
        <p className="text-brand-gray font-light mt-2">The arrangement you requested is unavailable.</p>
        <Link to="/products" className="mt-6 inline-block bg-brand-rose text-white text-xs uppercase tracking-widest py-3 px-8 font-medium">
          Browse Shop
        </Link>
      </div>
    );
  }

  // Gallery list construction
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl].filter(Boolean);

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.info('Please log in to save to your wishlist 🌸');
      return;
    }

    try {
      const { data } = await api.post('/wishlist/toggle', { productId: product._id });
      setIsWishlisted(data.added);
      
      if (data.added) {
        user.wishlist.push(product._id);
        toast.success('Added to wishlist 💖');
      } else {
        user.wishlist = user.wishlist.filter(id => id.toString() !== product._id.toString());
        toast.info('Removed from wishlist');
      }
    } catch (err) {
      toast.error('Could not update wishlist');
    }
  };

  const hasSale = product.salePrice !== undefined && product.salePrice !== null;
  const originalPrice = product.price;
  const currentPrice = hasSale ? product.salePrice : product.price;
  const discountPercent = hasSale ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const outOfStock = product.stock <= 0;

  return (
    <div className="pt-28 pb-20 bg-white font-sans">
      
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-6 py-6 border-b border-rose-100/40 mb-10">
        <div className="flex items-center gap-1.5 text-xs text-brand-gray uppercase tracking-wider font-light">
          <Link to="/" className="hover:text-brand-rose transition">Home</Link>
          <ChevronRight className="w-3 h-3 text-rose-300" />
          <Link to="/products" className="hover:text-brand-rose transition">Collections</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 text-rose-300" />
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-brand-rose transition">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-rose-300" />
          <span className="text-brand-black truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          
          {/* Main Large Image Container */}
          <div className="relative aspect-[4/5] bg-rose-50 overflow-hidden border border-rose-100 group">
            <img
              src={images[activeImageIdx]}
              alt={`${product.name} active`}
              className="w-full h-full object-cover transition duration-500 cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />
            {/* Lightbox triggers */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-brand-black p-2.5 rounded-full shadow transition"
              aria-label="Enlarge Image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            {hasSale && (
              <span className="absolute top-4 left-4 bg-brand-red text-white text-[10px] uppercase tracking-widest px-3 py-1 font-medium font-sans z-10">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 select-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 aspect-[4/5] overflow-hidden border transition bg-rose-50 shrink-0 ${
                    activeImageIdx === idx ? 'border-brand-black opacity-100' : 'border-rose-100 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="flex flex-col justify-between">
          <div>
            
            {/* Category */}
            <div className="text-[10px] uppercase tracking-widest font-light text-brand-gray mb-1">
              {product.category?.name || 'Luxury Blooms'}
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-4xl text-brand-black leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-brand-gray font-light">({product.numReviews} custom reviews)</span>
              </div>
            )}

            {/* Pricing */}
            <div className="text-2xl font-medium text-brand-black mb-6">
              {hasSale ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-brand-gray line-through font-light">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-brand-red">
                    {formatPrice(currentPrice)}
                  </span>
                </div>
              ) : (
                <span>{formatPrice(originalPrice)}</span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-brand-gray font-light leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-rose-100 my-8 text-xs font-light text-brand-gray">
              <div className="flex items-center gap-2">
                <Truck className="w-4.5 h-4.5 text-brand-rose" />
                <span>Express Temp-Controlled Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-brand-rose" />
                <span>Naturally preserved, lasts a year</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-brand-rose" />
                <span>Secure Payments with Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4.5 h-4.5 text-brand-rose" />
                <span>Premium Ecuadorian Sourcing</span>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6 text-sm font-light">
              Availability:{' '}
              {outOfStock ? (
                <span className="text-brand-red font-medium">Sold Out</span>
              ) : (
                <span className="text-[#25d366] font-medium">In Stock ({product.stock} pieces left)</span>
              )}
            </div>

          </div>

          {/* Checkout triggers */}
          {!outOfStock && (
            <div className="space-y-4 pt-4">
              
              {/* Quantity Adjuster */}
              <div className="flex items-center gap-3 font-sans">
                <span className="text-xs uppercase tracking-widest font-medium text-brand-black mr-2">Quantity</span>
                <div className="flex items-center border border-rose-200 h-10">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 hover:bg-rose-50 text-brand-black font-light h-full"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-light select-none">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-3 hover:bg-rose-50 text-brand-black font-light h-full"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div ref={mainCtaRef} className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    addToCart(product, qty);
                    setIsAdded(true);
                    setTimeout(() => setIsAdded(false), 1500);
                  }}
                  disabled={isAdded}
                  className={`flex-1 h-12 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-medium transition duration-300 ${
                    isAdded 
                      ? 'bg-green-500 text-white' 
                      : 'bg-brand-black text-white hover:bg-brand-rose'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`border h-12 px-6 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-medium transition duration-300 ${
                    isWishlisted
                      ? 'border-brand-red bg-rose-50 text-brand-red'
                      : 'border-rose-200 hover:border-brand-black text-brand-black'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brand-red' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Wishlist'}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Tabs Section: Description | Care Instructions | Delivery Info */}
      <div className="mx-auto max-w-7xl px-6 mt-20 border-t border-rose-100 pt-16">
        {/* Tab Headers */}
        <div className="flex justify-center border-b border-rose-100 gap-8 md:gap-16 text-xs uppercase tracking-widest font-medium text-brand-gray mb-8">
          {[
            { id: 'desc', label: 'Description' },
            { id: 'care', label: 'Care Instructions' },
            { id: 'delivery', label: 'Delivery Info' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 border-b-2 transition ${
                activeTab === tab.id ? 'border-brand-black text-brand-black font-semibold' : 'border-transparent hover:text-brand-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="max-w-3xl mx-auto text-sm text-brand-gray font-light leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <p>Each rose is grown in Ecuadorian volcanic soil and hand-picked at perfect maturity. The sap is replaced by an organic, bio-friendly liquid preserving the softness and fresh texture of natural flowers for a whole year.</p>
            </div>
          )}
          {activeTab === 'care' && (
            <div className="space-y-4">
              <p>Our bio-preserved flowers require no water, pruning, or soil changes. To maximize their longevity, follow these care steps:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Do NOT water:</strong> Water damages the preservation compound immediately.</li>
                <li><strong>Keep dry:</strong> Avoid rooms with high humidity levels like bathrooms.</li>
                <li><strong>Avoid direct sunlight:</strong> Long UV exposure fades the premium dyes.</li>
                <li><strong>No dusting sprays:</strong> If dust accumulates, use a hair dryer on a cool, gentle air setting.</li>
              </ul>
            </div>
          )}
          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <p>We deliver using specialized, temperature-regulated delivery vehicles to ensure preserved flowers remain in perfect condition during transit.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Dubai:</strong> Same-day delivery available for orders placed before 1 PM. Free for orders over AED 350.</li>
                <li><strong>Other Emirates:</strong> Next-day courier delivery available to Abu Dhabi, Sharjah, and Ajman.</li>
                <li><strong>Worldwide:</strong> International shipping available for selected signature suede boxes. Fees computed at checkout.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Feed */}
      {relatedProducts.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 mt-24">
          <h2 className="font-serif text-2xl md:text-3xl text-brand-black text-center mb-12">Related Creations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p, idx) => (
              <ProductCard key={p._id} product={p} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[120] bg-brand-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-brand-rose transition"
            aria-label="Close Lightbox"
          >
            ✕ Close
          </button>
          <img
            src={images[activeImageIdx]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}

      {/* Mobile-Sticky Add to Cart Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-rose-200 px-6 py-3.5 shadow-2xl flex items-center justify-between md:hidden">
          <div className="flex-1">
            <span className="text-xs text-brand-gray truncate block max-w-[150px]">{product.name}</span>
            <span className="text-sm font-semibold text-brand-black">{formatPrice(currentPrice)}</span>
          </div>
          <button
            onClick={() => addToCart(product, qty)}
            className="bg-brand-rose text-white text-xs uppercase tracking-widest font-medium py-3 px-6 shadow hover:bg-brand-black transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      )}

    </div>
  );
}
