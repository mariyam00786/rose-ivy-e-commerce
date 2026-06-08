import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', agree: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const pwStrength = () => {
    const pw = form.password;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = pwStrength();
  const strengthColor = ['#e8e0db', '#e74c3c', '#f39c12', '#D1AFA1', '#27ae60'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.agree) e.agree = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch {
      // Error toasted by context
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (err) => ({
    width: '100%', padding: '13px 16px',
    border: `1px solid ${err ? '#e74c3c' : '#e8e0db'}`,
    fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a',
    outline: 'none', transition: 'border-color 0.25s', background: '#fff',
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      {/* Left: Form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 60px', background: '#fff', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 32, color: '#1a1a1a', letterSpacing: '0.03em', marginBottom: 8 }}>Create Account</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginBottom: 40 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#D1AFA1', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Full Name</label>
              <input
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                style={inputStyle(errors.name)}
                onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                onBlur={e => e.currentTarget.style.borderColor = errors.name ? '#e74c3c' : '#e8e0db'}
              />
              {errors.name && <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#e74c3c', marginTop: 5 }}>{errors.name}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Email Address</label>
              <input
                type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={inputStyle(errors.email)}
                onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                onBlur={e => e.currentTarget.style.borderColor = errors.email ? '#e74c3c' : '#e8e0db'}
              />
              {errors.email && <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#e74c3c', marginTop: 5 }}>{errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  style={{ ...inputStyle(errors.password), paddingRight: 48 }}
                  onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.password ? '#e74c3c' : '#e8e0db'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, background: strength >= i ? strengthColor : '#e8e0db', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: 'Inter', fontSize: 11, color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
              {errors.password && <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#e74c3c', marginTop: 5 }}>{errors.password}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Confirm Password</label>
              <input
                type="password" value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat your password"
                style={inputStyle(errors.confirmPassword)}
                onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                onBlur={e => e.currentTarget.style.borderColor = errors.confirmPassword ? '#e74c3c' : '#e8e0db'}
              />
              {errors.confirmPassword && <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#e74c3c', marginTop: 5 }}>{errors.confirmPassword}</p>}
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })}
                  style={{ marginTop: 2, accentColor: '#D1AFA1', width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#555', lineHeight: 1.6 }}>
                  I agree to the <Link to="/" style={{ color: '#D1AFA1', textDecoration: 'none' }}>Terms & Conditions</Link> and <Link to="/" style={{ color: '#D1AFA1', textDecoration: 'none' }}>Privacy Policy</Link>
                </span>
              </label>
              {errors.agree && <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#e74c3c', marginTop: 5 }}>{errors.agree}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '15px', background: loading ? '#888' : '#1a1a1a',
                color: '#fff', fontFamily: 'Inter', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.25s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#D1AFA1'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1a1a1a'; }}
            >
              {loading ? 'Creating Account…' : <><span>Create Account</span><ArrowRight size={15} /></>}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Right: Brand Panel */}
      <div style={{
        position: 'relative', background: '#1a1a1a',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px 60px', overflow: 'hidden',
      }}>
        <img
          src="https://inbloom.ae/wp-content/uploads/IMG_2875-scaled.webp"
          alt="Flowers"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 22, letterSpacing: '0.35em', color: '#fff', textTransform: 'uppercase', display: 'block', marginBottom: 60 }}>
              ROSE & IVY
            </span>
          </Link>
          <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 48, color: '#fff', letterSpacing: '0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            Join Our<br />World
          </h2>
          <div style={{ width: 40, height: 1, background: '#D1AFA1', marginBottom: 24 }} />
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 340, marginBottom: 32 }}>
            Create your account to save your wishlist, track your orders, and get exclusive early access to new collections.
          </p>
          {['Exclusive member discounts', 'Early access to new collections', 'Personalised floral recommendations', 'Order tracking & history'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, background: '#D1AFA1', borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
