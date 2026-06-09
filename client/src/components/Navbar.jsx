import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, X, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import api from '../api/axiosConfig';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  {
    label: 'Flowers', to: '/products',
    children: [
      { label: 'Flower Boxes', to: '/products?category=flower-boxes' },
      { label: 'Signature Boxes Collection', to: '/products?category=signature-boxes' },
      { label: 'Interior Vase Bouquets', to: '/products?category=interior-vase-bouquets' },
      { label: 'Interior Statement Pieces', to: '/products?category=interior-statement-pieces' },
      { label: 'Yacht & Aviation Flowers', to: '/products?category=yacht-aviation-flowers' },
      { label: 'Seasonal Collections', to: '/products?category=seasonal-collections' },
      { label: 'Wedding Flowers', to: '/products?category=wedding-flowers' },
      { label: 'B2B Solutions', to: '/products?category=b2b-solutions' },
      { label: 'Gifts', to: '/products?category=gifts' },
    ],
  },
  { label: 'Sale', to: '/products?sale=true' },
  { label: 'Bespoke', to: '/bespoke' },
  { label: 'Gift Card', to: '/products?category=gift-cards' },
  { label: 'What Are Preserved Flowers?', to: '/about' },
  { label: 'Flower Care', to: '/faq' },
  { label: 'About Us', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const searchRef = useRef(null);
  const dropdownTimer = useRef(null);

  const isHeroPage = ['/', ].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(data.products || data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 320);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const navBg = isHeroPage && !scrolled ? 'transparent' : '#f9f5f3';
  const navTextColor = isHeroPage && !scrolled ? '#fff' : '#1a1a1a';
  const navIconColor = isHeroPage && !scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.6)';
  const navBorder = isHeroPage && !scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

  return (
    <>
      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-[1001] bg-[#f9f5f3] text-[#1a1a1a] text-center px-4 py-2 font-inter text-[9px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.18em] uppercase border-b border-black/5 whitespace-nowrap overflow-hidden text-ellipsis">
        Free delivery on orders over AED 350 <span className="hidden sm:inline">&nbsp;·&nbsp; Bio-preserved flowers lasting 1+ year</span>
      </div>

      {/* Main Navbar */}
      <header
        style={{
          position: 'fixed',
          top: 38,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: isHeroPage && !scrolled ? 'transparent' : '#f9f5f3',
          transition: 'background 0.35s ease, box-shadow 0.35s ease',
          boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {/* Top Row: Currency | Logo | Account + Wishlist + Cart */}
        <div style={{ borderBottom: `1px solid ${navBorder}` }}>
          <div className="container-site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            
            {/* Left: Currency + Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
              <span className="hidden sm:inline" style={{ fontFamily: 'Inter', fontSize: 12, color: navIconColor, letterSpacing: '0.1em', cursor: 'pointer' }}>
                AED, د.إ
              </span>
              <button
                onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: navIconColor, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, letterSpacing: '0.1em', fontFamily: 'Inter', padding: 0 }}
              >
                <Search size={16} />
                <span className="hidden md:inline" style={{ color: navIconColor }}>Search</span>
              </button>
            </div>

            {/* Center: Logo */}
            <Link to="/" style={{ flex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <span className="font-raleway font-light text-[18px] md:text-[22px] tracking-[0.2em] md:tracking-[0.38em] uppercase whitespace-nowrap" style={{ color: navTextColor }}>
                ROSE & IVY
              </span>
            </Link>

            {/* Right: Account + Wishlist + Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'flex-end' }}>
              {user ? (
                <div style={{ position: 'relative' }}
                  onMouseEnter={() => setActiveDropdown('account')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: navIconColor, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, letterSpacing: '0.08em', fontFamily: 'Inter', padding: '10px' }}>
                    <User size={16} />
                    <span className="hidden md:inline">{user.name?.split(' ')[0]}</span>
                  </button>
                  {activeDropdown === 'account' && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #e8e0db', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', minWidth: 160, zIndex: 200 }}>
                      <Link to="/dashboard" style={{ display: 'block', padding: '12px 20px', fontFamily: 'Inter', fontSize: 12, color: '#1a1a1a', textDecoration: 'none', borderBottom: '1px solid #f0ebe8', letterSpacing: '0.05em' }}>My Account</Link>
                      <Link to="/orders" style={{ display: 'block', padding: '12px 20px', fontFamily: 'Inter', fontSize: 12, color: '#1a1a1a', textDecoration: 'none', borderBottom: '1px solid #f0ebe8', letterSpacing: '0.05em' }}>My Orders</Link>
                      <button onClick={logout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 20px', fontFamily: 'Inter', fontSize: 12, color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ background: 'none', border: 'none', cursor: 'pointer', color: navIconColor, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, letterSpacing: '0.08em', fontFamily: 'Inter', padding: '10px', textDecoration: 'none' }}>
                  <User size={16} />
                  <span className="hidden md:inline">Login / Register</span>
                </Link>
              )}

              <Link to="/wishlist" style={{ background: 'none', border: 'none', cursor: 'pointer', color: navIconColor, display: 'flex', alignItems: 'center', padding: '10px', textDecoration: 'none', position: 'relative' }}>
                <Heart size={18} />
              </Link>

              <Link to="/cart" style={{ background: 'none', border: 'none', cursor: 'pointer', color: navIconColor, display: 'flex', alignItems: 'center', gap: 8, padding: '10px', textDecoration: 'none', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -6, right: -6,
                      background: '#D1AFA1', color: '#fff',
                      borderRadius: '50%', width: 16, height: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 600, fontFamily: 'Inter',
                    }}>{cartCount}</span>
                  )}
                </div>
                <span className="hidden lg:inline" style={{ fontSize: 12, fontFamily: 'Inter', letterSpacing: '0.05em' }}>
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: navIconColor, padding: '10px' }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation Links (desktop) */}
        <div className="hidden md:block">
          <div className="container-site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => { clearTimeout(dropdownTimer.current); setActiveDropdown(link.label); }}
                  onMouseLeave={() => { dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 150); }}
                >
                  <Link
                    to={link.to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '16px 14px',
                      fontFamily: 'Inter', fontSize: 11, fontWeight: 400,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: location.pathname === link.to ? '#D1AFA1' : navIconColor,
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#D1AFA1'}
                    onMouseLeave={e => e.currentTarget.style.color = location.pathname === link.to ? '#D1AFA1' : navIconColor}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={11} style={{ opacity: 0.6 }} />}
                  </Link>

                  {/* Dropdown */}
                  {link.children && activeDropdown === link.label && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0,
                      background: '#1a1a1a', minWidth: 240,
                      boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
                      zIndex: 300, borderTop: '2px solid #D1AFA1',
                    }}>
                      {link.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.to}
                          style={{
                            display: 'block', padding: '11px 20px',
                            fontFamily: 'Inter', fontSize: 11,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            transition: 'color 0.2s ease, padding-left 0.2s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#D1AFA1'; e.currentTarget.style.paddingLeft = '26px'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.paddingLeft = '20px'; }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            background: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.1)',
            maxHeight: '80vh', overflowY: 'auto',
          }}>
            {NAV_LINKS.map(link => (
              <div key={link.label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link
                    to={link.to}
                    style={{
                      display: 'block', flex: 1, padding: '14px 24px',
                      fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: navIconColor,
                      textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <ChevronDown size={14} style={{ transform: mobileExpanded === link.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                  )}
                </div>
                {link.children && mobileExpanded === link.label && (
                  <div style={{ background: '#111' }}>
                    {link.children.map(child => (
                      <Link
                        key={child.label}
                        to={child.to}
                        style={{
                          display: 'block', padding: '11px 36px',
                          fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.12em',
                          textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
                          textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(26,26,26,0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 120, paddingBottom: 40, paddingLeft: 20, paddingRight: 20,
        }}>
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
            style={{ position: 'absolute', top: 24, right: 32, background: 'none', border: 'none', cursor: 'pointer', color: navTextColor }}
          >
            <X size={28} />
          </button>
          <p style={{ fontFamily: 'Raleway', fontWeight: 300, fontSize: 13, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
            Search for flowers
          </p>
          <div style={{ width: '100%', maxWidth: 640, position: 'relative' }}>
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) { navigate(`/products?q=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); } }}
              placeholder="Type to search..."
              style={{
                width: '100%', padding: '18px 56px 18px 20px',
                background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)',
                color: navTextColor, fontFamily: 'Raleway', fontSize: 28, fontWeight: 300,
                letterSpacing: '0.05em', outline: 'none',
              }}
            />
            <Search size={22} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div style={{ width: '100%', maxWidth: 640, marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {searchResults.slice(0, 6).map(p => (
                <Link
                  key={p._id}
                  to={`/products/${p.slug || p._id}`}
                  onClick={() => setSearchOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ aspectRatio: '3/4', background: '#2a2a2a', overflow: 'hidden' }}>
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{ fontFamily: 'Inter', fontSize: 11, color: navTextColor, margin: 0, letterSpacing: '0.05em' }}>{p.name}</p>
                      <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#D1AFA1', margin: '4px 0 0', fontWeight: 600 }}>AED {p.salePrice || p.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {searchLoading && <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter', fontSize: 12, marginTop: 24 }}>Searching…</p>}
        </div>
      )}
    </>
  );
}
