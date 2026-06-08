import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset successfully. Please sign in.');
      navigate('/account/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-rose-50 px-6 py-24">
      <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-rose">Account</p>
        <h1 className="mt-3 font-serif text-3xl text-brand-black">Reset password</h1>
        <p className="mt-3 text-sm text-brand-gray">Create a new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="New password"
            className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-rose"
          />
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-rose"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-black px-4 py-3 text-xs uppercase tracking-[0.25em] text-white hover:bg-brand-rose disabled:opacity-60"
          >
            {loading ? 'Updating…' : 'Reset password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-gray">
          Return to <Link to="/account/login" className="text-brand-rose hover:text-brand-black">Login</Link>
        </p>
      </div>
    </section>
  );
}
