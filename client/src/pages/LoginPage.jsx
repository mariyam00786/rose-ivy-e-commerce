import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
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
      await login(form.email, form.password);
      navigate('/');
    } catch {
      // Error toasted by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* Left: Brand panel */}
      <div style={{
        position: 'relative', background: '#1a1a1a',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px 60px', overflow: 'hidden',
      }}>
        <img
          src="https://inbloom.ae/wp-content/uploads/61611C01-32D3-4F9A-8574-A42D3862F129.jpg"
          alt="Flowers"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 22, letterSpacing: '0.35em', color: '#fff', textTransform: 'uppercase', display: 'block', marginBottom: 60 }}>
              ROSE & IVY
            </span>
          </Link>
          <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 48, color: '#fff', letterSpacing: '0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            Welcome<br />Back
          </h1>
          <div style={{ width: 40, height: 1, background: '#D1AFA1', marginBottom: 24 }} />
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 340 }}>
            Sign in to your account to access your wishlist, track orders, and explore our curated collection of bio-preserved luxury flowers.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 60px', background: '#fff' }}>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 32, color: '#1a1a1a', letterSpacing: '0.03em', marginBottom: 8 }}>Sign In</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginBottom: 40 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#D1AFA1', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '13px 16px',
                  border: `1px solid ${errors.email ? '#e74c3c' : '#e8e0db'}`,
                  fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a',
                  outline: 'none', transition: 'border-color 0.25s',
                  background: '#fff',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                onBlur={e => e.currentTarget.style.borderColor = errors.email ? '#e74c3c' : '#e8e0db'}
              />
              {errors.email && <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#e74c3c', marginTop: 5 }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                  style={{
                    width: '100%', padding: '13px 48px 13px 16px',
                    border: `1px solid ${errors.password ? '#e74c3c' : '#e8e0db'}`,
                    fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a',
                    outline: 'none', transition: 'border-color 0.25s', background: '#fff',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.password ? '#e74c3c' : '#e8e0db'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#e74c3c', marginTop: 5 }}>{errors.password}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/forgot-password" style={{ fontFamily: 'Inter', fontSize: 12, color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#D1AFA1'}
                onMouseLeave={e => e.currentTarget.style.color = '#888'}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px', background: loading ? '#888' : '#1a1a1a',
                color: '#fff', fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#D1AFA1'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1a1a1a'; }}
            >
              {loading ? 'Signing In…' : <><span>Sign In</span> <ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e8e0db' }} />
            <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#bbb', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#e8e0db' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[{ label: 'Continue with Google', icon: 'G' }, { label: 'Continue with Apple', icon: '' }].map(s => (
              <button key={s.label}
                style={{
                  width: '100%', padding: '13px', background: '#fff',
                  border: '1px solid #e8e0db', fontFamily: 'Inter', fontSize: 12,
                  letterSpacing: '0.05em', color: '#1a1a1a', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'border-color 0.25s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e0db'}
              >
                <span style={{ fontWeight: 700 }}>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
