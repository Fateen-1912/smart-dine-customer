import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { setPhone } = useAuth();
  const [number, setNumber] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (number.trim().length < 6) {
      setError('Please enter a valid phone number');
      return;
    }

    const fullPhone = `+92${number}`;
    setError('');
    setLoading(true);

    try {
      await api.post('/api/auth/request-otp', { phone: fullPhone });
      setPhone(fullPhone);
      navigate('/otp', { state: { phone: fullPhone } });
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '52px 20px 16px',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E2069" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1E2069' }}>Smart Dine</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1E2069', margin: '0 0 10px' }}>Welcome Back</h1>
        <p style={{ color: '#888', fontSize: 14, margin: '0 0 40px', lineHeight: 1.5 }}>
          Enter your phone number to use Smart Dine and enjoy your food :)
        </p>

        <label style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
          PHONE NUMBER
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1.5px solid #E5E5E5',
          borderRadius: 10,
          overflow: 'hidden',
          marginBottom: error ? 6 : 40,
        }}>
          <div style={{
            padding: '16px 14px',
            background: '#F8F8F8',
            borderRight: '1px solid #E5E5E5',
            fontSize: 15,
            fontWeight: 600,
            color: '#1E2069',
            whiteSpace: 'nowrap',
          }}>
            +92
          </div>
          <input
            type="tel"
            value={number}
            onChange={e => { setNumber(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
            placeholder="3xx-xxxxxxx"
            style={{
              flex: 1,
              padding: '16px 14px',
              border: 'none',
              outline: 'none',
              fontSize: 15,
              color: '#1C1C1C',
              background: 'transparent',
            }}
          />
        </div>
        {error && <p style={{ color: '#E86B1F', fontSize: 12, margin: '0 0 32px' }}>{error}</p>}

        <button
          onClick={handleSignUp}
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            background: loading ? '#CCCCCC' : '#E86B1F',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1.2,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(232,107,31,0.35)',
          }}
        >
          {loading ? 'Sending OTP...' : 'SIGN UP'}
        </button>

        <p style={{ textAlign: 'center', margin: '16px 0 0', color: '#AAAAAA', fontSize: 12 }}>
          Demo: OTP code is always <strong style={{ color: '#E86B1F' }}>1234</strong>
        </p>
      </div>
    </div>
  );
}
