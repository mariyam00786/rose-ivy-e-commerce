import { Link } from 'react-router-dom';

export default function Payment() {
  return (
    <section className="min-h-screen bg-rose-50 px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-3xl border border-rose-100 bg-white p-8 shadow-xl lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-rose">Payment</p>
          <h1 className="mt-3 font-serif text-4xl text-brand-black">Secure checkout</h1>
          <p className="mt-4 text-sm text-brand-gray">Choose the payment flow that best fits your order — card, wallet, or cash on delivery.</p>
          <div className="mt-8 space-y-4 text-sm text-brand-gray">
            <div className="rounded-2xl border border-rose-100 p-4">Razorpay for cards, UPI, and wallets.</div>
            <div className="rounded-2xl border border-rose-100 p-4">Cash on Delivery for trusted local deliveries.</div>
            <div className="rounded-2xl border border-rose-100 p-4">Gift cards and promo codes applied in the cart summary.</div>
          </div>
        </div>

        <aside className="rounded-3xl bg-rose-50 p-6">
          <h2 className="font-serif text-2xl text-brand-black">Payment options</h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-gray">
            <li>• Instant digital confirmation</li>
            <li>• Protected payment methods</li>
            <li>• Order tracking linked to your dashboard</li>
          </ul>
          <Link to="/checkout" className="mt-6 inline-block rounded-xl bg-brand-black px-5 py-3 text-xs uppercase tracking-[0.25em] text-white hover:bg-brand-rose">Back to checkout</Link>
        </aside>
      </div>
    </section>
  );
}
