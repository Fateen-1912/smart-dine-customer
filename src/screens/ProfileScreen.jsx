import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

const MenuItem = ({ icon, label, sub, onClick, danger, badge }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 20px', background: '#fff',
      borderBottom: '1px solid #F5F5F5', cursor: 'pointer',
      width: '100%', boxSizing: 'border-box',
    }}
  >
    <div style={{
      width: 40, height: 40, borderRadius: 11,
      background: danger ? '#FFF0EF' : '#FFF5EF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, flexShrink: 0,
    }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: danger ? '#E53935' : '#1C1C1C' }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{sub}</div>}
    </div>
    {badge && (
      <span style={{
        background: '#E86B1F', color: '#fff', borderRadius: 10,
        padding: '2px 8px', fontSize: 11, fontWeight: 700, marginRight: 6,
      }}>{badge}</span>
    )}
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={danger ? '#E53935' : '#CCCCCC'} strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </div>
);

const SectionHeader = ({ label }) => (
  <div style={{ padding: '14px 20px 6px', background: '#F8F8F8' }}>
    <span style={{ fontSize: 11, fontWeight: 700, color: '#AAAAAA', letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</span>
  </div>
);

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { phone, name, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ height: '100%', width: '100%', background: '#F8F8F8', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #E86B1F 0%, #CC5500 100%)',
        padding: '28px 20px 28px',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px', fontSize: 34, border: '2.5px solid rgba(255,255,255,0.45)',
        }}>👤</div>
        <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: 19, fontWeight: 800 }}>
          {name || 'Welcome back!'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.82)', margin: 0, fontSize: 14 }}>
          {phone ? `+92 ${phone}` : 'Smart Dine Guest'}
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.18)',
          borderRadius: 20, padding: '4px 14px', marginTop: 10,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>🏪 Food Court Member</span>
        </div>
      </div>

      {/* Account Section */}
      <SectionHeader label="Account" />
      <div style={{ background: '#fff', width: '100%', display: 'block' }}>
        <MenuItem
          icon="👤"
          label="My Profile"
          sub="View and edit your info"
          onClick={() => navigate('/profile/edit')}
        />
        <MenuItem
          icon="📋"
          label="Order History"
          sub="View your past orders"
          onClick={() => navigate('/order-history')}
        />
      </div>

      {/* Preferences Section */}
      <SectionHeader label="Preferences" />
      <div style={{ background: '#fff', width: '100%', display: 'block' }}>
        <MenuItem
          icon="💳"
          label="Payment Methods"
          sub="Cards and cash options"
          onClick={() => navigate('/payment')}
        />
        <MenuItem
          icon="🔔"
          label="Notifications"
          sub="Push & in-app alerts"
          onClick={() => navigate('/settings')}
        />
        <MenuItem
          icon="⚙️"
          label="Settings"
          sub="App preferences & more"
          onClick={() => navigate('/settings')}
        />
      </div>

      {/* Support Section */}
      <SectionHeader label="Support" />
      <div style={{ background: '#fff', width: '100%', display: 'block' }}>
        <MenuItem
          icon="❓"
          label="Help & Support"
          sub="FAQs and contact us"
          onClick={() => navigate('/settings')}
        />
        <MenuItem
          icon="🚪"
          label="Logout"
          onClick={handleLogout}
          danger
        />
      </div>

      {/* App version */}
      <div style={{ textAlign: 'center', padding: '20px', color: '#CCCCCC', fontSize: 12 }}>
        Smart Dine v1.0.0 · Food Court Edition
      </div>

      <BottomNav />
    </div>
  );
}
