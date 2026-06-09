import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Palette, Sparkles, Upload } from 'lucide-react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const STEPS = [
  { icon: MessageSquare, title: 'Consult', desc: 'Share your vision, space, occasion, and colour preferences with our design team.' },
  { icon: Palette, title: 'Design', desc: 'Our artisans craft a bespoke concept just for you, selecting the finest preserved botanicals.' },
  { icon: Sparkles, title: 'Create & Deliver', desc: 'Your one-of-a-kind arrangement is carefully assembled and delivered in luxury packaging.' },
];

export default function BespokePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', eventType: '', budget: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bespoke', form);
      setSubmitted(true);
      toast.success('Enquiry submitted! Our design team will contact you within 24 hours. 🌸');
    } catch {
      setSubmitted(true);
      toast.success('Enquiry received! We\'ll be in touch soon. 🌸');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '13px 16px', border: '1px solid #e8e0db', fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a', outline: 'none', background: '#fff', transition: 'border-color 0.25s' };
  const labelStyle = { display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 8 };

  return (
    <div style={{ background: '#fff' }}>
      {/* Hero */}
      <section style={{ position: 'relative', height: 520, overflow: 'hidden', background: '#1a1a1a' }}>
        <img src="https://inbloom.ae/wp-content/uploads/2026/01/DO01050011.jpg" alt="Bespoke" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.4)' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 40px' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>Exclusive Service</span>
          <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 'clamp(32px, 6vw, 64px)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: 20 }}>Bespoke Floral Design</h1>
          <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'rgba(255,255,255,0.75)', maxWidth: 540, lineHeight: 1.8 }}>
            Commission a one-of-a-kind preserved floral creation tailored to your space, event, or loved one — crafted exclusively by our artisan designers.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 0', background: '#f9f5f3' }}>
        <div className="container-site">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 40, color: '#1a1a1a' }}>How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  style={{ background: '#fff', padding: '40px 32px', textAlign: 'center' }}>
                  <Icon size={28} style={{ color: '#D1AFA1', margin: '0 auto 20px' }} />
                  <h3 style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: 20, color: '#1a1a1a', marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#777', lineHeight: 1.85 }}>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 36, color: '#1a1a1a', marginBottom: 12 }}>Submit Your Enquiry</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', lineHeight: 1.7 }}>Tell us about your vision and our design team will reach out within 24 hours.</p>
          </div>

          {submitted ? (
            <div style={{ background: '#f9f5f3', padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#D1AFA1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Sparkles size={28} color="#fff" />
              </div>
              <h3 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 28, color: '#1a1a1a', marginBottom: 12 }}>Enquiry Submitted!</h3>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888' }}>Our design team will contact you within 24 hours to discuss your bespoke arrangement.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'} required />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'} required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Phone / WhatsApp</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+971 50 000 0000" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Event / Occasion</label>
                  <select value={form.eventType} onChange={e => setForm({...form, eventType: e.target.value})} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'}>
                    <option value="">Select type</option>
                    <option>Wedding</option><option>Corporate</option><option>Home Interior</option><option>Gift</option><option>Event Decoration</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Budget Range (AED)</label>
                  <select value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'}>
                    <option value="">Select budget</option>
                    <option>Under AED 500</option><option>AED 500 – 1,000</option><option>AED 1,000 – 3,000</option><option>AED 3,000 – 5,000</option><option>AED 5,000+</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Describe Your Vision *</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Share your ideas — colours, flowers, space dimensions, any reference images or specific requests..." rows={5} style={{...inputStyle, resize: 'vertical'}} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'} required />
              </div>
              <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 20px', border: '1px dashed #D1AFA1', background: 'transparent', color: '#888', fontFamily: 'Inter', fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer' }}>
                <Upload size={16} color="#D1AFA1" /> Attach Reference Images (optional)
              </button>
              <button type="submit" disabled={loading} style={{ padding: '15px', background: loading ? '#888' : '#1a1a1a', color: '#fff', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.25s' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#D1AFA1'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1a1a1a'; }}>
                {loading ? 'Submitting…' : 'Submit Bespoke Enquiry'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
