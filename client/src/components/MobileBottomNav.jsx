import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Search, label: 'Shop', to: '/products' },
  { icon: ShoppingBag, label: 'Cart', to: '/cart', badge: true },
  { icon: Heart, label: 'Wishlist', to: '/wishlist' },
  { icon: User, label: 'Account', to: '/dashboard' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav className="mobile-bottom-nav">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.to);
        const to = item.label === 'Account' && !user ? '/login' : item.to;

        return (
          <Link
            key={item.label}
            to={to}
            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-bottom-nav-icon">
              <Icon size={20} />
              {item.badge && cartCount > 0 && (
                <span className="mobile-bottom-nav-badge">{cartCount}</span>
              )}
            </div>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
