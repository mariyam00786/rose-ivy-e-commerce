import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { getFallbackImage, getProductImage } from '../utils/imageUtils';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    deliveryFee,
    discountCode,
    discountAmount,
    grandTotal,
    applyDiscount,
    removeDiscount
  } = useCart();

  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyDiscount(couponInput);
      setCouponInput('');
    }
  };

  if (!cartItems.length) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center font-sans">
        <div className="w-16 h-16 bg-rose-50 text-brand-rose rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl text-brand-black">Your cart is empty</h1>
        <p className="text-sm text-brand-gray font-light mt-2 max-w-sm mx-auto">
          Add some everlasting bio-preserved rose arrangements to your cart.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block bg-brand-black hover:bg-brand-rose text-white text-xs uppercase tracking-widest py-3 px-8 font-medium transition duration-300 shadow"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-white font-sans">
      <div className="mx-auto max-w-7xl px-6">
        
        <h1 className="font-serif text-3xl md:text-5xl text-brand-black mb-12">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const p = item.productId;
              if (!p) return null;
              
              const pId = p._id || p.id;
              const hasSale = p.salePrice !== undefined && p.salePrice !== null;
              const unitPrice = hasSale ? p.salePrice : p.price;

              return (
                <div
                  key={pId}
                  className="flex flex-col sm:flex-row gap-6 p-5 bg-white border border-rose-100 items-center justify-between"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      className="w-20 h-24 object-cover bg-rose-50 rounded"
                    />
                    <div>
                      <h3 className="font-serif text-lg text-brand-black leading-tight">{p.name}</h3>
                      <p className="text-xs text-brand-gray uppercase tracking-widest font-light mt-1">{p.category?.name || 'Luxury Blooms'}</p>
                      <p className="text-xs text-brand-gray font-light mt-2">
                        {formatPrice(unitPrice)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-rose-200 h-9">
                      <button
                        onClick={() => updateQuantity(pId, item.quantity - 1)}
                        className="px-2.5 hover:bg-rose-50 text-brand-black font-light h-full"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-light select-none">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(pId, item.quantity + 1)}
                        className="px-2.5 hover:bg-rose-50 text-brand-black font-light h-full"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-right">
                      <span className="text-sm font-medium text-brand-black">
                        {formatPrice(unitPrice * item.quantity)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(pId)}
                      className="text-rose-300 hover:text-brand-red p-1 transition"
                      aria-label="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Back to Shop link */}
            <div className="pt-4">
              <Link to="/products" className="text-xs uppercase tracking-widest text-brand-gray hover:text-brand-rose transition flex items-center gap-1.5 w-fit">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right: Summary & Checkout */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* Coupon Code Panel */}
            <div className="border border-rose-100 p-5 bg-rose-50/10">
              <h3 className="font-sans text-xs uppercase tracking-widest font-medium text-brand-black mb-3">
                Apply Promo Code
              </h3>
              
              {discountCode ? (
                <div className="flex items-center justify-between bg-rose-50 p-2.5 text-xs text-brand-rose border border-rose-200">
                  <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {discountCode} Active</span>
                  <button onClick={removeDiscount} className="text-brand-gray hover:text-brand-red">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="WELCOME10, ROSE20..."
                    className="border border-rose-200 focus:border-brand-black px-3 py-2 text-xs uppercase tracking-widest font-light outline-none rounded-none flex-1 bg-white"
                  />
                  <button
                    type="submit"
                    className="bg-brand-black text-white hover:bg-brand-rose text-[10px] uppercase tracking-widest font-medium px-4 py-2 transition"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Order Totals Panel */}
            <div className="border border-rose-100 p-6 space-y-4 bg-white">
              <h2 className="font-serif text-xl text-brand-black pb-2 border-b border-rose-100">Order Summary</h2>
              
              <div className="space-y-3 text-sm font-light text-brand-gray">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-brand-black">{formatPrice(cartTotal)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-red">
                    <span>Discount ({discountCode})</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-brand-black">
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>

                {deliveryFee > 0 && (
                  <div className="text-[10px] text-brand-rose uppercase tracking-wider font-sans font-normal">
                    Add {formatPrice(350 - cartTotal)} more for FREE delivery
                  </div>
                )}

                <div className="flex justify-between border-t border-rose-100 pt-4 text-base font-medium text-brand-black">
                  <span>Grand Total</span>
                  <span className="text-lg font-semibold text-brand-rose">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full bg-brand-black text-white hover:bg-brand-rose py-3 text-center text-xs uppercase tracking-widest font-medium transition duration-300 shadow flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Payment security footnote */}
            <div className="text-[10px] text-brand-gray font-light text-center uppercase tracking-wider leading-relaxed">
              Fully Secure Checkout • Temperature-Regulated Dispatch
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
