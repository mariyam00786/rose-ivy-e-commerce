import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Check your inbox for reset instructions.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-rose-50 px-6 py-24">
      <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-rose">Account</p>
        <h1 className="mt-3 font-serif text-3xl text-brand-black">Forgot your password?</h1>
        <p className="mt-3 text-sm text-brand-gray">Enter your email and we’ll send a secure reset link.</p>

        {sent ? (
          <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-brand-gray">Check your email for the reset instructions. If you do not receive it, try again in a few minutes.</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-rose"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-black px-4 py-3 text-xs uppercase tracking-[0.25em] text-white hover:bg-brand-rose disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-brand-gray">
          Back to <Link to="/account/login" className="text-brand-rose hover:text-brand-black">Login</Link>
        </p>
      </div>
    </section>
  );
}
