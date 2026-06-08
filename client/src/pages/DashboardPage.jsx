import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Heart, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { formatPrice } = useCurrency();
  const [active, setActive] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });

  useEffect(() => {
    if (active === 'orders') {
      api.get('/orders').then(({ data }) => setOrders(data)).catch(() => setOrders([]));
    }
  }, [active]);

  const saveProfile = async () => {
    try {
      await api.put('/users/profile', profileForm);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Could not update profile');
    }
  };

  return (
    <div style={{ background: '#f9f5f3', minHeight: '80vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D1AFA1' }}>Account</span>
          <h1 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 36, color: '#1a1a1a', letterSpacing: '0.03em', marginTop: 8 }}>
            Welcome, {user?.name?.split(' ')[0] || 'Guest'}
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
          {/* Sidebar */}
          <div>
            <div style={{ background: '#fff', overflow: 'hidden' }}>
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActive(tab.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '16px 20px', background: active === tab.id ? '#1a1a1a' : '#fff',
                      color: active === tab.id ? '#fff' : '#555',
                      border: 'none', borderBottom: '1px solid #f0ebe8',
                      fontFamily: 'Inter', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                    }}
                  >
                    <Icon size={15} style={{ color: active === tab.id ? '#D1AFA1' : '#888' }} />
                    {tab.label}
                  </button>
                );
              })}
              <button onClick={logout}
                style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', color: '#e74c3c', fontFamily: 'Inter', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left' }}>
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ background: '#fff' }}>
            {active === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                  <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 24, color: '#1a1a1a' }}>Profile Information</h2>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #e8e0db', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555' }}>
                      <Edit2 size={13} /> Edit
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={saveProfile} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1a1a1a', border: 'none', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                        <Save size={13} /> Save
                      </button>
                      <button onClick={() => setEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #e8e0db', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Inter', fontSize: 11, color: '#888' }}>
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[{ label: 'Full Name', field: 'name', value: profileForm.name }, { label: 'Email', field: 'email', value: profileForm.email }].map(f => (
                    <div key={f.label}>
                      <label style={{ display: 'block', fontFamily: 'Inter', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>{f.label}</label>
                      {editing ? (
                        <input value={f.value} onChange={e => setProfileForm({...profileForm, [f.field]: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', border: '1px solid #e8e0db', fontFamily: 'Inter', fontSize: 13, color: '#1a1a1a', outline: 'none', background: '#f9f5f3' }}
                          onFocus={e => e.currentTarget.style.borderColor = '#D1AFA1'}
                          onBlur={e => e.currentTarget.style.borderColor = '#e8e0db'}
                        />
                      ) : (
                        <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#1a1a1a', padding: '12px 0', borderBottom: '1px solid #f0ebe8' }}>{f.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {active === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 36px' }}>
                <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 24, color: '#1a1a1a', marginBottom: 24 }}>My Orders</h2>
                {orders.length === 0 ? (
                  <div style={{ padding: '48px 0', textAlign: 'center' }}>
                    <Package size={40} style={{ color: '#D1AFA1', margin: '0 auto 16px' }} />
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888' }}>No orders yet. <Link to="/products" style={{ color: '#D1AFA1' }}>Start shopping</Link></p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {orders.map(o => (
                      <Link key={o._id} to={`/orders/${o._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#f9f5f3', textDecoration: 'none', borderLeft: '3px solid #D1AFA1' }}>
                        <div>
                          <p style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>#{o._id?.slice(-8).toUpperCase()}</p>
                          <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#888', marginTop: 3 }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#D1AFA1' }}>{formatPrice(o.totalPrice)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {active === 'addresses' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 36px' }}>
                <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 24, color: '#1a1a1a', marginBottom: 24 }}>Saved Addresses</h2>
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <MapPin size={40} style={{ color: '#D1AFA1', margin: '0 auto 16px' }} />
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888' }}>No saved addresses yet. Your addresses from orders will appear here.</p>
                </div>
              </motion.div>
            )}

            {active === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px 36px' }}>
                <h2 style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 24, color: '#1a1a1a', marginBottom: 24 }}>My Wishlist</h2>
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <Heart size={40} style={{ color: '#D1AFA1', margin: '0 auto 16px' }} />
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#888' }}>Your wishlist is empty. <Link to="/products" style={{ color: '#D1AFA1' }}>Explore our collections</Link></p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
