import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      onClick={() => navigate('/onboarding')}
      style={{
        height: '100%',
        background: '#FDF6EE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Smart Dine"
        style={{
          width: 200,
          height: 200,
          objectFit: 'contain',
          borderRadius: 36,
        }}
      />

      <div style={{ textAlign: 'center', padding: '0 40px' }}>
        <h1 style={{ color: '#1E2069', fontSize: 28, fontWeight: 700, margin: '0 0 12px' }}>Welcome</h1>
        <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          It's a pleasure to meet you. We are excited that you're here so let's get started!
        </p>
      </div>

      <div style={{
        width: 40,
        height: 4,
        background: '#E86B1F',
        borderRadius: 2,
        opacity: 0.4,
      }} />
    </div>
  );
}
