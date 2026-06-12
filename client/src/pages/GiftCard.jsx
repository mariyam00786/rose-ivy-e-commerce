import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig';

export default function GiftCard() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const presets = [200, 500, 1000, 2000];
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  const finalAmount = useMemo(() => Number(customAmount) || amount, [amount, customAmount]);

  const handlePurchase = async () => {
    if (!recipient || !email || !sender) {
      toast.error('Please complete the recipient and sender details.');
      return;
    }
    if (finalAmount < 50 || finalAmount > 5000) {
      toast.error('Gift card amount must be between AED 50 and AED 5000');
      return;
    }

    if (user) {
      // Purchase directly via API
      setPurchasing(true);
      try {
        const { data } = await api.post('/giftcards', {
          amount: finalAmount,
          recipientEmail: email,
          recipientName: recipient,
          message: message || `A gift from ${sender}`
        });
        toast.success(`Gift card purchased! Code: ${data.giftCard.code} sent to ${email} 🎁`);
        navigate('/');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to purchase gift card');
      } finally {
        setPurchasing(false);
      }
    } else {
      // Guest: add to cart as a product
      addToCart({
        _id: 'gift-card',
        slug: 'gift-card',
        name: 'Luxury Gift Card',
        price: finalAmount,
        salePrice: null,
        category: { name: 'Gift Card' },
        images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'],
        description: message || 'A beautiful gift card for your loved one.',
        stock: 999,
      }, 1);
      toast.success('Gift card added to cart. Log in to complete purchase.');
      navigate('/cart');
    }
  };

  return (
    <section className="min-h-screen bg-rose-50 px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-3xl border border-rose-100 bg-white p-8 shadow-xl lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl bg-gradient-to-br from-rose-100 via-white to-rose-50 p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-rose">Gift Card</p>
          <h1 className="mt-3 font-serif text-4xl text-brand-black">Give the gift of choice.</h1>
          <p className="mt-4 text-sm text-brand-gray">Choose a value, add a personal message, and send it instantly by email after payment.</p>
          <div className="mt-8 rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.25em] text-brand-gray">Amount</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {presets.map((preset) => (
                <button key={preset} onClick={() => setAmount(preset)} className={`rounded-full border px-4 py-2 text-sm ${amount === preset ? 'border-brand-black bg-brand-black text-white' : 'border-rose-200 text-brand-black hover:bg-rose-50'}`}>
                  AED {preset}
                </button>
              ))}
            </div>
            <input type="number" min="50" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} placeholder="Custom amount" className="mt-4 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none focus:border-brand-rose" />
            <div className="mt-6 text-sm text-brand-gray">Selected value: <strong className="text-brand-black">AED {finalAmount}</strong></div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs uppercase tracking-[0.25em] text-brand-gray">Recipient Name<input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm" /></label>
          <label className="block text-xs uppercase tracking-[0.25em] text-brand-gray">Recipient Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm" /></label>
          <label className="block text-xs uppercase tracking-[0.25em] text-brand-gray">Your Name<input value={sender} onChange={(e) => setSender(e.target.value)} className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm" /></label>
          <label className="block text-xs uppercase tracking-[0.25em] text-brand-gray">Personal Message<textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm" /></label>
          <div className="text-xs text-brand-gray">{message.length}/200 characters</div>
          <button onClick={handlePurchase} disabled={purchasing} className="w-full rounded-xl bg-brand-black px-4 py-3 text-xs uppercase tracking-[0.25em] text-white hover:bg-brand-rose disabled:opacity-60">
            {purchasing ? 'Processing...' : user ? 'Purchase & Send Gift Card' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </section>
  );
}
