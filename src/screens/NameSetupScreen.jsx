import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function NameSetupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (name.trim().length > 50) {
      setError('Name must not exceed 50 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const updated = await api.patch('/api/auth/profile', { name });
      updateProfile({ name: updated.name });
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to save name. Please try again.');
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
        <div style={{ width: 38 }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1E2069' }}>Smart Dine</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1E2069', margin: '0 0 10px' }}>Welcome!</h1>
        <p style={{ color: '#888', fontSize: 14, margin: '0 0 40px', lineHeight: 1.5 }}>
          What's your name? We'll show this to the staff so they know who's ordering :)
        </p>

        <label style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
          YOUR NAME
        </label>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          placeholder="e.g., Ali Ahmed"
          style={{
            width: '100%',
            padding: '16px 14px',
            border: '1.5px solid #E5E5E5',
            borderRadius: 10,
            fontSize: 15,
            color: '#1C1C1C',
            outline: 'none',
            marginBottom: error ? 6 : 40,
            boxSizing: 'border-box',
          }}
        />
        {error && <p style={{ color: '#E86B1F', fontSize: 12, margin: '0 0 32px' }}>{error}</p>}

        <button
          onClick={handleContinue}
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
          {loading ? 'Saving...' : 'CONTINUE'}
        </button>
      </div>
    </div>
  );
}
