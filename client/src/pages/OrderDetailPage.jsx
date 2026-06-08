import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading order…</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;

  return (
    <section className="min-h-screen bg-rose-50 px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-3xl border border-rose-100 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-rose">Order details</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-black">#{order._id}</h1>
        <p className="mt-3 text-sm text-brand-gray">Placed on {new Date(order.createdAt).toLocaleString()}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.product || item.name} className="flex items-center gap-4 rounded-2xl border border-rose-100 p-4">
                <img src={item.image || 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80'} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <h2 className="font-serif text-xl text-brand-black">{item.name}</h2>
                  <p className="text-sm text-brand-gray">Qty {item.quantity || item.qty}</p>
                </div>
                <strong className="text-brand-black">AED {(item.price * (item.quantity || item.qty)).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <aside className="rounded-3xl bg-rose-50 p-6 text-sm text-brand-gray">
            <div className="text-xs uppercase tracking-[0.25em] text-brand-rose">Summary</div>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between"><span>Status</span><strong className="text-brand-black">{order.status}</strong></li>
              <li className="flex justify-between"><span>Payment</span><strong className="text-brand-black">{order.paymentMethod}</strong></li>
              <li className="flex justify-between"><span>Total</span><strong className="text-brand-black">AED {Number(order.total || order.totalPrice || 0).toFixed(2)}</strong></li>
            </ul>
            <div className="mt-6 border-t border-rose-200 pt-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-brand-rose">Shipping</h3>
              <p className="mt-2 text-brand-black">{order.shippingAddress?.fullName || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim()}</p>
              <p>{order.shippingAddress?.address || order.shippingAddress?.addressLine1}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state || order.shippingAddress?.country}</p>
              <p>{order.shippingAddress?.pincode || order.shippingAddress?.postalCode}</p>
            </div>
            <Link to="/orders" className="mt-6 inline-block text-xs uppercase tracking-[0.25em] text-brand-black hover:text-brand-rose">← Back to orders</Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
