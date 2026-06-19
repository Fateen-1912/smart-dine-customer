import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    style={{
      width: 46, height: 26, borderRadius: 13,
      background: value ? '#E86B1F' : '#D0D0D0',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.25s ease', flexShrink: 0,
    }}
  >
    <div style={{
      position: 'absolute', top: 3,
      left: value ? 23 : 3,
      width: 20, height: 20, borderRadius: '50%', background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      transition: 'left 0.25s ease',
    }} />
  </div>
);

const SettingRow = ({ icon, label, sub, toggle, value, onChange, onClick }) => (
  <div
    onClick={toggle ? undefined : onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 20px', background: '#fff',
      borderBottom: '1px solid #F5F5F5',
      cursor: toggle ? 'default' : 'pointer',
    }}
  >
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: '#FFF5EF', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 17, flexShrink: 0,
    }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1C' }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{sub}</div>}
    </div>
    {toggle ? (
      <Toggle value={value} onChange={onChange} />
    ) : (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )}
  </div>
);

const SectionHeader = ({ label }) => (
  <div style={{ padding: '14px 20px 6px', background: '#F8F8F8' }}>
    <span style={{ fontSize: 11, fontWeight: 700, color: '#AAAAAA', letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</span>
  </div>
);

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [promos, setPromos] = useState(false);
  const [sound, setSound] = useState(true);
  const [haptic, setHaptic] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '28px 20px 20px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E2069" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1E2069' }}>Settings</h2>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>Manage your app preferences</p>
        </div>
      </div>

      {/* Notifications */}
      <SectionHeader label="Notifications" />
      <div style={{ background: '#fff' }}>
        <SettingRow icon="🔔" label="Push Notifications" sub="Order status updates" toggle value={notifications} onChange={setNotifications} />
        <SettingRow icon="🍽️" label="Order Ready Alerts" sub="When your food is ready" toggle value={orderAlerts} onChange={setOrderAlerts} />
        <SettingRow icon="🎉" label="Promotions & Offers" sub="Deals and discounts" toggle value={promos} onChange={setPromos} />
      </div>

      {/* App Preferences */}
      <SectionHeader label="App Preferences" />
      <div style={{ background: '#fff' }}>
        <SettingRow icon="🔊" label="Sound Effects" sub="Button taps and alerts" toggle value={sound} onChange={setSound} />
        <SettingRow icon="📳" label="Haptic Feedback" sub="Vibration on interactions" toggle value={haptic} onChange={setHaptic} />
      </div>

      {/* General */}
      <SectionHeader label="General" />
      <div style={{ background: '#fff' }}>
        <SettingRow
          icon="🌐"
          label="Language"
          sub="English (default)"
          onClick={() => showToast('Language settings coming soon')}
        />
        <SettingRow
          icon="🗑️"
          label="Clear Cache"
          sub="Free up app storage"
          onClick={() => showToast('Cache cleared successfully!')}
        />
        <SettingRow
          icon="⭐"
          label="Rate the App"
          sub="Tell us what you think"
          onClick={() => showToast('Thank you for your support!')}
        />
        <SettingRow
          icon="📄"
          label="Privacy Policy"
          sub="How we handle your data"
          onClick={() => showToast('Opening privacy policy...')}
        />
      </div>

      {/* App Info */}
      <div style={{ textAlign: 'center', padding: '24px 20px', color: '#CCCCCC', fontSize: 12 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🍕</div>
        Smart Dine · Food Court Edition{'\n'}
        <span style={{ fontSize: 11 }}>Version 1.0.0</span>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: '#1C1C1C', color: '#fff', borderRadius: 20,
          padding: '10px 20px', fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 200,
          whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
