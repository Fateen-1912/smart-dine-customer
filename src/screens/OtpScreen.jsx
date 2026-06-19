import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function OTPScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { phone, login } = useAuth();
  const displayPhone = location.state?.phone || phone || '';
  const maskedPhone  = displayPhone
    ? displayPhone.slice(0, 3) + '****' + displayPhone.slice(-4)
    : '+92****xxxx';

  const [otp,     setOtp]     = useState(['', '', '', '']);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [resent,  setResent]  = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setError('');
    if (val && i < 3) refs[i + 1].current.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs[i - 1].current.focus();
    }
  };

  const handleContinue = async () => {
    if (otp.some(d => !d)) {
      setError('Please enter the 4-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await api.post('/api/auth/verify-otp', {
        phone: displayPhone,
        code:  otp.join(''),
      });
      login(data);          // stores tokens + sets context state

      // If user has no name, redirect to name setup; otherwise go to home
      const hasName = data.user.name && data.user.name.trim().length > 0;
      console.log('[OTP] Login result:');
      console.log('  - Phone:', data.user.phone);
      console.log('  - User ID:', data.user.id);
      console.log('  - Name:', data.user.name ? `"${data.user.name}"` : 'NULL/EMPTY');
      console.log('  - Has name:', hasName);
      console.log('[OTP] Note: If name setup not shown, user already has a name in database.');
      console.log('[OTP] To reset: Run script/reset-customer-names.js or clear name in database.');

      if (!hasName) {
        console.log('[OTP] Routing to: /name-setup');
        navigate('/name-setup');
      } else {
        console.log('[OTP] Routing to: /home');
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '']);
      refs[0].current.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp(['', '', '', '']);
    setResent(false);
    try {
      await api.post('/api/auth/request-otp', { phone: displayPhone });
      setResent(true);
      refs[0].current.focus();
      setTimeout(() => setResent(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
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
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1E2069' }}>Login to Smart Dine</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1E2069', margin: '0 0 12px' }}>
          Verify Phone Number
        </h1>
        <p style={{ color: '#888', fontSize: 14, margin: '0 0 40px', lineHeight: 1.6 }}>
          Enter the 4-Digit code sent to <span style={{ color: '#1E2069', fontWeight: 600 }}>{maskedPhone}</span>
        </p>

        {/* OTP Boxes */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: 58, height: 58,
                textAlign: 'center', fontSize: 24, fontWeight: 700,
                border: `2px solid ${d ? '#E86B1F' : '#E5E5E5'}`,
                borderRadius: 12, outline: 'none',
                color: '#1E2069',
                background: d ? '#FFF5EF' : '#fff',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {error  && <p style={{ color: '#E86B1F', fontSize: 12, margin: '-24px 0 20px', textAlign: 'center' }}>{error}</p>}
        {resent && <p style={{ color: '#22C55E', fontSize: 12, margin: '-24px 0 20px', textAlign: 'center' }}>Code resent!</p>}

        <button
          onClick={handleContinue}
          disabled={loading}
          style={{
            width: '100%', padding: '18px',
            background: loading ? '#CCCCCC' : '#E86B1F',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, letterSpacing: 1.2,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(232,107,31,0.35)',
            marginBottom: 24,
          }}
        >
          {loading ? 'Verifying...' : 'CONTINUE'}
        </button>

        <p style={{ textAlign: 'center', color: '#888', fontSize: 13 }}>
          Didn't receive code?{' '}
          <button
            onClick={handleResend}
            style={{ background: 'none', border: 'none', color: '#E86B1F', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}
          >
            Resend Again.
          </button>
        </p>
      </div>

      <p style={{ textAlign: 'center', color: '#BBBBBB', fontSize: 11, padding: '0 32px 24px', lineHeight: 1.5 }}>
        By Signing up you agree to our Terms Conditions &amp; Privacy Policy.
      </p>
    </div>
  );
}
