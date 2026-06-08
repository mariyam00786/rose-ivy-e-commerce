import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  { cat: 'Preserved Flowers', items: [
    { q: 'What are preserved flowers?', a: 'Preserved flowers are real, natural flowers that have undergone a specialised bio-preservation process. Natural sap is replaced with a plant-based glycerin solution, keeping petals soft, vibrant, and lifelike for 1–3 years without any water or maintenance.' },
    { q: 'How long do preserved flowers last?', a: 'With proper care, our preserved flowers last between 1 and 3 years. Keep them away from direct sunlight, humidity, and direct airflow to maximise their lifespan.' },
    { q: 'Do preserved flowers require any maintenance?', a: 'No water, no sunlight, no maintenance. Simply keep them in a dry environment away from direct sunlight and excessive humidity. Occasional gentle dusting is all that is needed.' },
    { q: 'Are preserved flowers sustainable?', a: 'Yes. Our preservation process uses plant-based, biodegradable solutions. Because they last years, they reduce the environmental impact compared to fresh flowers that are replaced weekly.' },
  ]},
  { cat: 'Ordering & Delivery', items: [
    { q: 'How long does delivery take?', a: 'Same-day delivery is available for Dubai orders placed before 2:00 PM. Next-day delivery is available across the UAE. International shipping takes 5–10 business days.' },
    { q: 'Is delivery free?', a: 'Yes — free delivery on all orders over AED 350 within Dubai. A standard delivery fee of AED 35 applies to orders below this threshold.' },
    { q: 'Can I track my order?', a: 'Yes. You will receive an SMS and email with your tracking details once your order has been dispatched. You can also view your order status in your account dashboard.' },
    { q: 'Do you deliver internationally?', a: 'We currently deliver across the UAE. International shipping to select GCC countries is available — please contact us for details.' },
  ]},
  { cat: 'Returns & Exchanges', items: [
    { q: 'What is your return policy?', a: 'We offer a 7-day return guarantee for items that arrive damaged or defective. Please contact us within 7 days of receiving your order with photos, and we will arrange a replacement or full refund.' },
    { q: 'Can I exchange a product?', a: 'Yes, exchanges are possible within 7 days of delivery for items in original condition. Please contact our team to arrange the exchange.' },
    { q: 'What if my order arrives damaged?', a: 'We take great care with packaging, but if your order arrives damaged, please photograph the packaging and product and contact us immediately at info@roseivy.ae.' },
  ]},
  { cat: 'Bespoke & Custom Orders', items: [
    { q: 'Can I request a custom arrangement?', a: 'Absolutely. Our bespoke design service allows you to commission a fully customised preserved floral arrangement. Visit our Bespoke page to submit your enquiry.' },
    { q: 'How long does a bespoke order take?', a: 'Bespoke arrangements typically take 7–14 business days, depending on complexity and availability of materials.' },
    { q: 'Do you do corporate orders?', a: 'Yes — we work with hotels, offices, event organisers, and interior designers. Please contact us directly for corporate pricing and bulk orders.' },
  ]},
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #e8e0db' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
        <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#1a1a1a', letterSpacing: '0.01em', lineHeight: 1.5 }}>{q}</span>
        <ChevronDown size={18} color="#D1AFA1" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#666', lineHeight: 1.85, paddingBottom: 20 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div style={{ background: '#fff' }}>
      <section style={{ background: '#1a1a1a', padding: '100px 0 60px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1AFA1', display: 'block', marginBottom: 16 }}>Help Centre</span>
        <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 52, color: '#fff', letterSpacing: '0.04em' }}>Frequently Asked Questions</h1>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 20px' }}>
          {FAQS.map((section, i) => (
            <motion.div key={section.cat} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} style={{ marginBottom: 56 }}>
              <h2 style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: 22, color: '#1a1a1a', letterSpacing: '0.03em', marginBottom: 4 }}>{section.cat}</h2>
              <div style={{ width: 32, height: 2, background: '#D1AFA1', marginBottom: 24 }} />
              {section.items.map(item => <FAQItem key={item.q} {...item} />)}
            </motion.div>
          ))}

          {/* CTA */}
          <div style={{ background: '#f9f5f3', padding: '48px', textAlign: 'center', marginTop: 40 }}>
            <h3 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 28, color: '#1a1a1a', marginBottom: 12 }}>Still have questions?</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888', marginBottom: 28 }}>Our team is available 7 days a week to assist you.</p>
            <Link to="/contact" style={{ display: 'inline-block', padding: '13px 36px', background: '#1a1a1a', color: '#fff', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = '#D1AFA1'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
            >Get In Touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
