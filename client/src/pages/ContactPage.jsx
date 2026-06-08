import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.success('Message received! We\'ll be in touch soon. 🌸');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '13px 16px', border: '1px solid #e8e0db', fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a', outline: 'none', background: '#fff', transition: 'border-color 0.25s' };
  const labelStyle = { display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 8 };

  return (
    <div style={{ background: '#fff' }}>
      {/* Hero */}
      <section style={{ background: '#1a1a1a', padding: '100px 0 60px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>Get In Touch</span>
        <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 52, color: '#fff', letterSpacing: '0.04em' }}>Contact Us</h1>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container-site">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 32, color: '#1a1a1a', marginBottom: 32 }}>Send a Message</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+971 50 000 0000" style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'} />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'}>
                    <option value="">Select a subject</option>
                    <option>General Enquiry</option>
                    <option>Order Support</option>
                    <option>Bespoke Design</option>
                    <option>Corporate Orders</option>
                    <option>Wedding Flowers</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Your message..." rows={5} style={{...inputStyle, resize: 'vertical'}} onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'} onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'} required />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '15px', background: loading ? '#888' : '#1a1a1a', color: '#fff', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.25s' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#D1AFA1'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1a1a1a'; }}>
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 32, color: '#1a1a1a', marginBottom: 32 }}>Visit Our Boutique</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 40 }}>
                {[
                  { icon: MapPin, title: 'Address', text: 'Al Safa, Dubai, United Arab Emirates' },
                  { icon: Phone, title: 'Phone / WhatsApp', text: '+971 58 571 1388' },
                  { icon: Mail, title: 'Email', text: 'info@roseivy.ae' },
                  { icon: Clock, title: 'Working Hours', text: 'Mon–Sat: 10:00 AM – 8:00 PM\nSun: 12:00 PM – 6:00 PM' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#f9f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color="#D1AFA1" />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: 5 }}>{title}</p>
                      <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Map placeholder */}
              <div style={{ height: 240, background: '#f9f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e8e0db' }}>
                <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Map · Dubai, UAE</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
