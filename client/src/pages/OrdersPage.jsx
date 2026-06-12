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
    <div className="bg-[#f9f5f3] min-h-[80vh] pt-12 pb-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="font-inter text-[10px] tracking-[0.25em] uppercase text-[#D1AFA1]">Account</span>
          <h1 className="font-raleway font-light text-2xl md:text-4xl text-[#1a1a1a] tracking-wide mt-2">My Orders</h1>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 md:p-20 text-center">
            <Package size={48} className="text-[#D1AFA1] mx-auto mb-5" />
            <h2 className="font-raleway font-light text-xl md:text-2xl text-[#1a1a1a] mb-3">No orders yet</h2>
            <p className="font-inter text-[13px] text-[#888] mb-8">When you place your first order, it will appear here.</p>
            <Link to="/products" className="inline-block px-8 py-3 bg-[#1a1a1a] text-white font-inter text-[11px] tracking-[0.15em] uppercase no-underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order, i) => {
              const status = order.status || 'processing';
              const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.processing;
              const date = new Date(order.createdAt).toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' });
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/orders/${order._id}`} className="block bg-white no-underline hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center p-4 md:p-6 gap-3 sm:gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-inter text-xs font-semibold text-[#1a1a1a] tracking-wide">
                            #{order._id?.slice(-8).toUpperCase()}
                          </p>
                          <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase"
                            style={{ background: statusStyle.bg, color: statusStyle.color }}>
                            {status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[#888]">
                          <span className="flex items-center gap-1 font-inter text-xs">
                            <Clock size={12} /> {date}
                          </span>
                          <span className="font-inter text-xs">
                            {(order.orderItems || order.items || []).length} item(s)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <p className="font-inter text-[15px] font-semibold text-[#D1AFA1]">{formatPrice(order.totalPrice || order.total)}</p>
                        <ChevronRight size={18} className="text-gray-300 hidden sm:block" />
                      </div>
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
