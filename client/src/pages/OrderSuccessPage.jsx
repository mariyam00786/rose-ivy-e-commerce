import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { CheckCircle, Package, MapPin, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { getFallbackImage, getProductImage } from '../utils/imageUtils';

export default function OrderSuccessPage() {
  const location = useLocation();
  const { id } = useParams();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      api.get(`/orders/${id}`)
        .then(({ data }) => setOrder(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '2px solid #D1AFA1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ background: '#f9f5f3', minHeight: '80vh', padding: '80px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Success Icon */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, background: '#D1AFA1', borderRadius: '50%', marginBottom: 24 }}
          >
            <CheckCircle size={40} color="#fff" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 36, color: '#1a1a1a', letterSpacing: '0.04em', marginBottom: 12 }}
          >
            Thank You for Your Order
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: 'Inter', fontSize: 14, color: '#888', letterSpacing: '0.02em' }}
          >
            {order ? `Order #${order._id?.slice(-8).toUpperCase()}` : 'Your order has been placed successfully'}
          </motion.p>
        </div>

        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {/* Order Items */}
            <div style={{ background: '#fff', marginBottom: 16 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e0db', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Package size={16} color="#D1AFA1" />
                <span style={{ fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>Order Items</span>
              </div>
              <div style={{ padding: '20px 24px' }}>
                {(order.orderItems || order.items || []).map((item, i) => {
                  const name = item.name || item.productId?.name || 'Product';
                  const qty = item.quantity || item.qty || 1;
                  const price = item.price || item.productId?.price || 0;
                  const img = getProductImage({ name, images: item.image || item.productId?.imageUrl ? [item.image || item.productId?.imageUrl] : [] });
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottom: i < (order.orderItems || order.items || []).length - 1 ? '1px solid #f0ebe8' : 'none', marginBottom: 16 }}>
                      <div style={{ width: 56, height: 56, background: '#f9f5f3', flexShrink: 0, overflow: 'hidden' }}>
                        {img && <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a', marginBottom: 3 }}>{name}</p>
                        <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#888' }}>Qty: {qty}</p>
                      </div>
                      <p style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: '#D1AFA1' }}>{formatPrice(price * qty)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping */}
            {order.shippingAddress && (
              <div style={{ background: '#fff', marginBottom: 16 }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e0db', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <MapPin size={16} color="#D1AFA1" />
                  <span style={{ fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>Shipping To</span>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>{order.shippingAddress.fullName}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginTop: 4 }}>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.emirate}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginTop: 2 }}>{order.shippingAddress.phone}</p>
                </div>
              </div>
            )}

            {/* Total */}
            <div style={{ background: '#fff', marginBottom: 40 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e0db', display: 'flex', alignItems: 'center', gap: 12 }}>
                <CreditCard size={16} color="#D1AFA1" />
                <span style={{ fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>Payment Summary</span>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#888' }}>Subtotal</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a' }}>{formatPrice(order.itemsPrice || order.totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#888' }}>Delivery</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a' }}>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee || 35)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #e8e0db', marginTop: 8 }}>
                  <span style={{ fontFamily: 'Raleway', fontSize: 16, fontWeight: 400, color: '#1a1a1a' }}>Total</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#D1AFA1' }}>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', background: '#1a1a1a', color: '#fff',
            fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'background 0.25s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#D1AFA1'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
          >
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
          <Link to="/orders" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', background: 'transparent', color: '#1a1a1a',
            fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            textDecoration: 'none', border: '1px solid #1a1a1a', transition: 'background 0.25s, color 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a1a1a'; }}
          >
            View My Orders <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
