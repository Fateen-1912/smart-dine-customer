import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#E86B1F' : '#BBBBBB'}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const SearchIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#E86B1F' : '#BBBBBB'} strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#E86B1F' : '#BBBBBB'} strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="7" y1="8" x2="17" y2="8" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="7" y1="16" x2="13" y2="16" />
  </svg>
);

const AIIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#E86B1F' : '#BBBBBB'} strokeWidth="2" strokeLinecap="round">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
    <circle cx="9" cy="14" r="1.5" fill={active ? '#E86B1F' : '#BBBBBB'} stroke="none" />
    <circle cx="15" cy="14" r="1.5" fill={active ? '#E86B1F' : '#BBBBBB'} stroke="none" />
  </svg>
);

const ProfileIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#E86B1F' : '#BBBBBB'} strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const path = location.pathname;

  const tabs = [
    { label: 'Home', icon: HomeIcon, route: '/home' },
    { label: 'Discover', icon: SearchIcon, route: '/discovery' },
    { label: 'Orders', icon: OrdersIcon, route: '/cart' },
    { label: 'AI Chef', icon: AIIcon, route: '/ai-recommend' },
    { label: 'Profile', icon: ProfileIcon, route: '/profile' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: '#fff',
      borderTop: '1px solid #F0F0F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '10px 0 14px',
      zIndex: 100,
      boxShadow: '0 -2px 16px rgba(0,0,0,0.07)',
    }}>
      {tabs.map(({ label, icon: Icon, route }) => {
        const active = path === route || (label === 'Orders' && path === '/cart');
        return (
          <button
            key={label}
            onClick={() => navigate(route)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 10px',
              position: 'relative',
            }}
          >
            {label === 'Orders' && cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 8,
                background: '#E86B1F',
                color: '#fff',
                borderRadius: '50%',
                width: 16,
                height: 16,
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}>{cartCount}</span>
            )}
            {label === 'AI Chef' && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 4,
                background: 'linear-gradient(135deg, #FFB800, #E86B1F)',
                color: '#fff',
                borderRadius: 6,
                padding: '1px 5px',
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: 0.3,
              }}>AI</span>
            )}
            <Icon active={active} />
            <span style={{
              fontSize: 10,
              color: active ? '#E86B1F' : '#BBBBBB',
              fontWeight: active ? 600 : 400,
            }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
