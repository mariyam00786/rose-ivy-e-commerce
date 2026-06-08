import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, CreditCard, ClipboardList, CheckCircle, Truck, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { getFallbackImage, getProductImage } from '../utils/imageUtils';

const EMIRATES = ['Abu Dhabi','Dubai','Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah'];

const steps = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ClipboardList },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, deliveryFee, discountAmount, discountCode, grandTotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    emirate: 'Dubai',
    notes: '',
  });

  const goTo = (n) => {
    setDirection(n > step ? 1 : -1);
    setStep(n);
  };

  const validateShipping = () => {
    const { fullName, email, phone, address, city } = shipping;
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      toast.error('Please complete all required shipping fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error('Please enter a valid email'); return false; }
    return true;
  };

  const placeOrder = async () => {
    if (!cartItems.length) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const nameParts = shipping.fullName.trim().split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';

      const mappedShipping = {
        firstName,
        lastName,
        addressLine1: shipping.address,
        city: shipping.city,
        country: 'United Arab Emirates',
        postalCode: '00000',
        phone: shipping.phone,
        deliveryNotes: shipping.notes || ''
      };

      const { data } = await api.post('/orders', {
        shippingAddress: mappedShipping,
        paymentMethod,
        total: grandTotal,
        totalPrice: grandTotal,
        deliveryFee,
        discount: discountAmount,
        couponCode: discountCode,
      });
      await clearCart();
      toast.success('Order placed successfully! 🌸');
      navigate(`/order-success/${data._id}`, { state: { order: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full border border-rose-200 rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/30 transition bg-white text-brand-black placeholder-brand-gray/50';
  const labelCls = 'block text-xs uppercase tracking-widest font-medium text-brand-gray mb-1.5 font-sans';

  return (
    <div className="min-h-screen bg-rose-50 pt-24 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-sans text-brand-gray mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:text-brand-rose transition">Home</Link>
          <ChevronRight size={12} />
          <Link to="/cart" className="hover:text-brand-rose transition">Cart</Link>
          <ChevronRight size={12} />
          <span className="text-brand-black">Checkout</span>
        </nav>

        <h1 className="font-serif text-3xl md:text-4xl font-light text-brand-black mb-10 tracking-wide">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => done ? goTo(s.id) : undefined}
                  className={`flex flex-col items-center gap-1.5 ${done ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done ? 'bg-brand-rose border-brand-rose text-white' :
                    active ? 'bg-brand-black border-brand-black text-white' :
                    'bg-white border-rose-200 text-brand-gray'
                  }`}>
                    {done ? <CheckCircle size={18} /> : <Icon size={18} />}
                  </div>
                  <span className={`text-xs font-sans uppercase tracking-widest ${active ? 'text-brand-black font-medium' : 'text-brand-gray'}`}>
                    {s.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-20 md:w-32 h-px mx-3 mb-5 transition-colors duration-300 ${step > s.id ? 'bg-brand-rose' : 'bg-rose-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Main Panel */}
          <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: 'easeInOut' }} className="p-8">
                  <h2 className="font-serif text-2xl font-light mb-6 text-brand-black">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Full Name <span className="text-brand-red">*</span></label>
                      <input className={inputCls} placeholder="Your full name" value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address <span className="text-brand-red">*</span></label>
                      <input className={inputCls} type="email" placeholder="you@example.com" value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number <span className="text-brand-red">*</span></label>
                      <input className={inputCls} placeholder="+971 50 000 0000" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelCls}>Emirate <span className="text-brand-red">*</span></label>
                      <select className={inputCls} value={shipping.emirate} onChange={e => setShipping({...shipping, emirate: e.target.value})}>
                        {EMIRATES.map(em => <option key={em} value={em}>{em}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Street Address <span className="text-brand-red">*</span></label>
                      <input className={inputCls} placeholder="Apartment, building, street" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelCls}>City / Area <span className="text-brand-red">*</span></label>
                      <input className={inputCls} placeholder="Dubai Marina" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelCls}>Delivery Notes</label>
                      <input className={inputCls} placeholder="Leave at door, call on arrival…" value={shipping.notes} onChange={e => setShipping({...shipping, notes: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => { if (validateShipping()) goTo(2); }}
                      className="flex items-center gap-2 bg-brand-black text-white px-8 py-3 rounded-lg font-sans text-sm uppercase tracking-widest hover:bg-brand-rose transition-colors duration-300"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: 'easeInOut' }} className="p-8">
                  <h2 className="font-serif text-2xl font-light mb-6 text-brand-black">Payment Method</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                      { id: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, Amex, Apple Pay', icon: '💳' },
                    ].map(pm => (
                      <label
                        key={pm.id}
                        className={`flex items-center gap-5 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === pm.id ? 'border-brand-rose bg-rose-50' : 'border-rose-200 bg-white hover:border-brand-rose/50'}`}
                      >
                        <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-brand-rose" />
                        <span className="text-2xl">{pm.icon}</span>
                        <div>
                          <p className="font-sans font-medium text-brand-black text-sm">{pm.label}</p>
                          <p className="font-sans text-xs text-brand-gray mt-0.5">{pm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-5 p-4 bg-rose-50 rounded-xl border border-rose-200">
                      <p className="text-xs font-sans text-brand-gray flex items-center gap-2">
                        <Lock size={13} /> Card details will be collected securely at the next step via Stripe.
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between mt-8">
                    <button onClick={() => goTo(1)} className="flex items-center gap-2 border border-rose-200 text-brand-black px-6 py-3 rounded-lg font-sans text-sm uppercase tracking-widest hover:bg-rose-50 transition">
                      Back
                    </button>
                    <button onClick={() => goTo(3)} className="flex items-center gap-2 bg-brand-black text-white px-8 py-3 rounded-lg font-sans text-sm uppercase tracking-widest hover:bg-brand-rose transition-colors duration-300">
                      Review Order <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: 'easeInOut' }} className="p-8">
                  <h2 className="font-serif text-2xl font-light mb-6 text-brand-black">Review Your Order</h2>

                  {/* Shipping Summary */}
                  <div className="bg-rose-50 rounded-xl p-5 mb-5 border border-rose-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-sans text-xs uppercase tracking-widest font-medium text-brand-gray">Shipping To</h3>
                      <button onClick={() => goTo(1)} className="text-xs font-sans text-brand-rose hover:underline">Edit</button>
                    </div>
                    <p className="font-sans text-sm text-brand-black font-medium">{shipping.fullName}</p>
                    <p className="font-sans text-sm text-brand-gray">{shipping.address}, {shipping.city}, {shipping.emirate}</p>
                    <p className="font-sans text-sm text-brand-gray">{shipping.phone} · {shipping.email}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-rose-50 rounded-xl p-5 mb-5 border border-rose-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-sans text-xs uppercase tracking-widest font-medium text-brand-gray">Payment</h3>
                      <button onClick={() => goTo(2)} className="text-xs font-sans text-brand-rose hover:underline">Edit</button>
                    </div>
                    <p className="font-sans text-sm text-brand-black capitalize">{paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Card Payment'}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item, i) => {
                      const p = item.productId;
                      const price = p?.salePrice ?? p?.price ?? item.price ?? 0;
                      const name = p?.name || 'Product';
                      const img = p?.imageUrl || p?.images?.[0];
                      return (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-rose-100 last:border-0">
                          <div className="w-14 h-14 rounded-lg bg-rose-100 overflow-hidden flex-shrink-0">
                            <img src={getProductImage({ name, images: [img], imageUrl: img })} alt={name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm text-brand-black truncate">{name}</p>
                            <p className="font-sans text-xs text-brand-gray">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-sans text-sm font-medium text-brand-black">{formatPrice(price * item.quantity)}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between mt-6">
                    <button onClick={() => goTo(2)} className="flex items-center gap-2 border border-rose-200 text-brand-black px-6 py-3 rounded-lg font-sans text-sm uppercase tracking-widest hover:bg-rose-50 transition">
                      Back
                    </button>
                    <button
                      disabled={loading}
                      onClick={placeOrder}
                      className="flex items-center gap-2 bg-brand-black text-white px-8 py-3 rounded-lg font-sans text-sm uppercase tracking-widest hover:bg-brand-rose transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Placing Order…' : 'Place Order'} {!loading && <CheckCircle size={16} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-6">
              <h3 className="font-serif text-xl font-light text-brand-black mb-5">Order Summary</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-5">
                {cartItems.map((item, i) => {
                  const p = item.productId;
                  const price = p?.salePrice ?? p?.price ?? item.price ?? 0;
                  const name = p?.name || 'Product';
                  const img = p?.imageUrl || p?.images?.[0];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-rose-100 overflow-hidden flex-shrink-0">
                        <img src={getProductImage({ name, images: img ? [img] : [] })} alt={name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs text-brand-black truncate">{name}</p>
                        <p className="font-sans text-xs text-brand-gray">× {item.quantity}</p>
                      </div>
                      <p className="font-sans text-xs font-medium text-brand-black flex-shrink-0">{formatPrice(price * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-rose-100 pt-4 space-y-2">
                <div className="flex justify-between font-sans text-sm text-brand-gray">
                  <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-brand-gray">
                  <span className="flex items-center gap-1"><Truck size={13} /> Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-sans text-sm text-green-600">
                    <span>Discount ({discountCode})</span><span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-serif text-lg text-brand-black font-light border-t border-rose-100 pt-3 mt-3">
                  <span>Total</span><span className="font-medium">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-sans text-brand-gray">
                <Lock size={12} className="text-brand-rose" />
                <span>Secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
