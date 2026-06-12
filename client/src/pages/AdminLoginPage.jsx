import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.user?.isAdmin || data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        toast.error('Access denied. Admin privileges required.');
        localStorage.removeItem('token');
        window.location.reload();
      }
    } catch {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', position: 'relative', overflow: 'hidden' }}>
      {/* Background pattern */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Accent glow */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(209,175,161,0.08) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(209,175,161,0.05) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 24px' }}
      >
        {/* Card */}
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '48px 40px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(209,175,161,0.1)', border: '1px solid rgba(209,175,161,0.2)', marginBottom: '20px' }}>
              <Shield size={24} color="#D1AFA1" />
            </div>
            <h1 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
              ROSE & IVY
            </h1>
            <h2 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: '26px', color: '#fff', letterSpacing: '0.02em' }}>
              Admin Console
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '10px' }}>
              Authorized personnel only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                Admin Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@roseivy.com"
                style={{
                  width: '100%', padding: '14px 16px',
                  border: `1px solid ${errors.email ? '#e74c3c' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#fff',
                  outline: 'none', transition: 'border-color 0.25s',
                  background: 'rgba(255,255,255,0.03)',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                onBlur={e => e.currentTarget.style.borderColor = errors.email ? '#e74c3c' : 'rgba(255,255,255,0.08)'}
              />
              {errors.email && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#e74c3c', marginTop: 5 }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••"
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px',
                    border: `1px solid ${errors.password ? '#e74c3c' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#fff',
                    outline: 'none', transition: 'border-color 0.25s',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.password ? '#e74c3c' : 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#e74c3c', marginTop: 5 }}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px', marginTop: '8px',
                background: loading ? 'rgba(209,175,161,0.3)' : '#D1AFA1',
                color: '#1a1a1a', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none',
                borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#c49e8f'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#D1AFA1'; }}
            >
              {loading ? 'Authenticating…' : <><span>Access Dashboard</span> <ArrowRight size={14} /></>}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
              This area is restricted to store administrators.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
