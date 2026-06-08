import { Link, useLocation } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const { state } = useLocation();
  const order = state?.order;
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-700">Thank you</p>
        <h1 className="mt-2 text-3xl font-bold">Your order is confirmed</h1>
        <p className="mt-3 text-gray-700">Estimated delivery: 3–5 business days.</p>
        {order && <>
          <p className="mt-4 text-sm text-gray-600">Order ID: <strong>{order._id}</strong></p>
          <ul className="mt-4 list-disc pl-5 text-gray-700">{order.orderItems?.map(item => <li key={item.product}>{item.name} × {item.qty}</li>)}</ul>
        </>}
        <div className="mt-6 flex gap-3"><Link to="/orders" className="rounded bg-rose-700 px-4 py-2 text-white">View Orders</Link><Link to="/products" className="rounded border px-4 py-2">Continue Shopping</Link></div>
      </div>
    </div>
  );
}
