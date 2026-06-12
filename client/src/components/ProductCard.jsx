import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, X, Star, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { getFallbackImage, getProductImage } from '../utils/imageUtils';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user, login } = useAuth(); // We'll update the user context wishlist locally
  
  const [isWishlisted, setIsWishlisted] = useState(
    user?.wishlist?.some(item => (item._id || item) === product._id) || false
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size || 'Standard');
  const [selectedPrice, setSelectedPrice] = useState(
    product.salePrice !== undefined && product.salePrice !== null ? product.salePrice : product.price
  );
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isModalAdded, setIsModalAdded] = useState(false);

  const handleAddToCart = (e, quantity = 1, isModal = false) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product, quantity);
    
    if (isModal) {
      setIsModalAdded(true);
      setTimeout(() => {
        setIsModalAdded(false);
        setIsQuickViewOpen(false);
      }, 1000);
    } else {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  // Sync state with user profile wishlist updates
  React.useEffect(() => {
    setIsWishlisted(
      user?.wishlist?.some(item => (item._id || item) === product._id) || false
    );
  }, [user, product._id]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please log in to save to your wishlist 🌸');
      return;
    }

    try {
      const { data } = await api.post('/wishlist/toggle', { productId: product._id });
      setIsWishlisted(data.added);
      
      // Update local user object wishlist reference directly
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

  const handleSizeChange = (variant) => {
    setSelectedSize(variant.size);
    // If on sale, adjust slightly, else use variant price
    setSelectedPrice(variant.price);
  };

  const hasSale = product.salePrice !== undefined && product.salePrice !== null;
  const originalPrice = product.price;
  const currentPrice = hasSale ? product.salePrice : product.price;
  
  // Calculate discount percentage
  const discountPercent = hasSale ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const outOfStock = product.stock <= 0;

  // Staggered animation variant for list entry
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: index * 0.1
      }
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_18px_40px_rgba(26,26,26,0.08)] hover-lift font-sans"
      >
        {/* Image Area with hover crossfade */}
        <div className="relative aspect-[4/5] bg-rose-50 overflow-hidden w-full">
          <Link to={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-full object-cover primary-image transition duration-700"
            />
            {product.images?.length > 1 && (
              <img
                src={product.images[1]}
                alt={`${product.name} secondary`}
                className="w-full h-full object-cover secondary-image transition duration-700"
              />
            )}
          </Link>

          {/* Badges (Top Left) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {outOfStock ? (
              <span className="bg-brand-black text-white text-[9px] uppercase tracking-widest font-sans px-2.5 py-1 font-medium">
                Out of Stock
              </span>
            ) : hasSale ? (
              <span className="bg-brand-red text-white text-[9px] uppercase tracking-widest font-sans px-2.5 py-1 font-medium">
                -{discountPercent}%
              </span>
            ) : null}
          </div>

          {/* Wishlist Button (Top Right) */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 z-10 bg-white/85 p-2 rounded-full hover:bg-white text-brand-black shadow-sm transition group/btn"
            aria-label="Toggle Wishlist"
          >
            <motion.div
              animate={isWishlisted ? { scale: [1, 1.3, 1] } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Heart
                className={`w-4 h-4 transition duration-300 ${
                  isWishlisted
                    ? 'fill-brand-red text-brand-red'
                    : 'text-brand-black group-hover/btn:text-brand-red'
                }`}
              />
            </motion.div>
          </button>

          {/* Hover Overlay Buttons (Desktop) */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center gap-2 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="bg-white text-brand-black hover:bg-brand-rose hover:text-white p-2.5 rounded-full shadow-lg transition duration-300"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            {!outOfStock && (
              <button
                onClick={(e) => handleAddToCart(e, 1, false)}
                className={`p-2.5 rounded-full shadow-lg transition duration-300 ${
                  isAdded 
                    ? 'bg-green-500 text-white' 
                    : 'bg-brand-black text-white hover:bg-brand-rose'
                }`}
                title="Add to Cart"
              >
                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Info Area */}
        <div className="flex flex-1 flex-col p-4">
          <div className="text-[10px] uppercase tracking-[0.28em] font-medium text-brand-rose mb-1">
            {product.category?.name || 'Luxury Blooms'}
          </div>

          <h3 className="mb-2 flex-1 font-serif text-lg text-brand-black leading-snug">
            <Link to={`/products/${product.slug}`} className="hover:text-brand-rose transition">
              {product.name}
            </Link>
          </h3>

          <p className="mb-3 line-clamp-2 text-xs text-brand-gray/90 font-light leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-rose-100 pt-3">
            <div className="flex items-center gap-2">
              {hasSale ? (
                <>
                  <span className="text-xs text-brand-gray line-through font-light">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-sm font-medium text-brand-red">
                    {formatPrice(currentPrice)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-brand-black">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center text-amber-500 gap-0.5 text-xs font-light">
                <Star className="w-3 h-3 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative grid grid-cols-1 md:grid-cols-2"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white/85 p-2 rounded-full hover:bg-white text-brand-black shadow"
                aria-label="Close Quick View"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Images */}
              <div className="aspect-[4/5] bg-rose-50 relative overflow-hidden h-full">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasSale && (
                  <span className="absolute top-4 left-4 bg-brand-red text-white text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Right Side: Details */}
              <div className="p-8 flex flex-col justify-between font-sans">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-light text-brand-gray mb-1">
                    {product.category?.name}
                  </div>
                  <h2 className="font-serif text-2xl text-brand-black mb-4 leading-tight">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-6 text-sm">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.rating || 4.5)
                              ? 'fill-current'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-brand-gray">({product.numReviews || 12} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="text-xl font-medium text-brand-black mb-6">
                    {hasSale ? (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-brand-gray line-through font-light">
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="text-brand-red">
                          {formatPrice(selectedPrice)}
                        </span>
                      </div>
                    ) : (
                      <span>{formatPrice(selectedPrice)}</span>
                    )}
                  </div>

                  <p className="text-sm text-brand-gray font-light leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Variants / Size selection */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-6">
                      <span className="text-xs uppercase tracking-widest font-medium text-brand-black block mb-3">
                        Select Arrangement Size
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => (
                          <button
                            key={v._id || v.size}
                            onClick={() => handleSizeChange(v)}
                            className={`border text-xs uppercase tracking-widest py-2.5 px-4 font-light transition duration-300 ${
                              selectedSize === v.size
                                ? 'border-brand-black bg-brand-black text-white font-normal'
                                : 'border-rose-200 hover:border-brand-black text-brand-black'
                            }`}
                          >
                            {v.size} (+ {formatPrice(v.price - product.price)})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="mb-6 text-sm font-light">
                    Availability:{' '}
                    {outOfStock ? (
                      <span className="text-brand-red font-medium">Out of stock</span>
                    ) : (
                      <span className="text-[#25d366] font-medium">In stock ({product.stock} arrangements left)</span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Actions */}
                {!outOfStock && (
                  <div className="flex gap-4 items-center border-t border-rose-100 pt-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-rose-200 h-12">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="px-3 hover:bg-rose-50 text-brand-black font-light h-full"
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-light">{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                        className="px-3 hover:bg-rose-50 text-brand-black font-light h-full"
                      >
                        +
                      </button>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, qty, true)}
                      disabled={isModalAdded}
                      className={`flex-1 h-12 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-medium transition duration-300 ${
                        isModalAdded 
                          ? 'bg-green-500 text-white' 
                          : 'bg-brand-black text-white hover:bg-brand-rose'
                      }`}
                    >
                      {isModalAdded ? (
                        <>
                          <Check className="w-4 h-4" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
