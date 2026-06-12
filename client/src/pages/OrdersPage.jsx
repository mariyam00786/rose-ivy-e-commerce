import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock } from 'lucide-react';
import api from '../api/axiosConfig';
import { useCurrency } from '../contexts/CurrencyContext';

const STATUS_COLORS = {
  pending: { bg: '#fff8e1', color: '#f39c12' },
  processing: { bg: '#e3f2fd', color: '#2196f3' },
  shipped: { bg: '#e8f5e9', color: '#27ae60' },
  delivered: { bg: '#f3e5f5', color: '#9c27b0' },
  cancelled: { bg: '#fce4ec', color: '#e74c3c' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data)).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#f9f5f3', minHeight: '80vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1' }}>Account</span>
          <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 36, color: '#1a1a1a', letterSpacing: '0.03em', marginTop: 8 }}>My Orders</h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(4)].map((_, i) => <div key={i} style={{ height: 100, background: '#fff', borderRadius: 2 }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ background: '#fff', padding: '80px 40px', textAlign: 'center' }}>
            <Package size={48} style={{ color: '#D1AFA1', margin: '0 auto 20px' }} />
            <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 24, color: '#1a1a1a', marginBottom: 12 }}>No orders yet</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginBottom: 32 }}>When you place your first order, it will appear here.</p>
            <Link to="/products" style={{
              display: 'inline-block', padding: '13px 32px', background: '#1a1a1a', color: '#fff',
              fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map((order, i) => {
              const status = order.status || 'processing';
              const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.processing;
              const date = new Date(order.createdAt).toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' });
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/orders/${order._id}`} style={{ display: 'block', background: '#fff', textDecoration: 'none', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', padding: '24px 28px', gap: 24 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.05em' }}>
                            #{order._id?.slice(-8).toUpperCase()}
                          </p>
                          <span style={{
                            padding: '3px 10px', borderRadius: 2,
                            background: statusStyle.bg, color: statusStyle.color,
                            fontFamily: 'Inter', fontSize: 10, fontWeight: 600,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                          }}>{status}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Inter', fontSize: 12, color: '#888' }}>
                            <Clock size={12} /> {date}
                          </span>
                          <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#888' }}>
                            {(order.orderItems || order.items || []).length} item(s)
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 600, color: '#D1AFA1' }}>{formatPrice(order.totalPrice)}</p>
                      </div>
                      <ChevronRight size={18} color="#ccc" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
