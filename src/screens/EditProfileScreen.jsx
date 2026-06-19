import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const InputField = ({ label, value, onChange, error, prefix, placeholder, type = 'text', maxLength }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
      {label}
    </label>
    <div style={{
      display: 'flex', alignItems: 'center',
      border: `1.5px solid ${error ? '#E53935' : '#E5E5E5'}`,
      borderRadius: 12, overflow: 'hidden', background: '#fff', transition: 'border-color 0.2s',
    }}>
      {prefix && (
        <div style={{
          padding: '15px 14px', background: '#F8F8F8',
          borderRight: '1px solid #E5E5E5',
          fontSize: 14, fontWeight: 600, color: '#1E2069', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {prefix}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{ flex: 1, padding: '15px 14px', border: 'none', outline: 'none', fontSize: 15, color: '#1C1C1C', background: 'transparent' }}
      />
    </div>
    {error && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#E53935' }}>{error}</p>}
  </div>
);

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const { phone, name, updateProfile } = useAuth();

  const [editName,  setEditName]  = useState(name  || '');
  const [editPhone, setEditPhone] = useState(
    // Strip the +92 prefix if present so the input shows only the number
    phone ? phone.replace(/^\+92/, '') : ''
  );
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState('');

  const validate = () => {
    const e = {};
    if (!editName.trim())               e.name  = 'Full name is required';
    else if (editName.trim().length < 2) e.name  = 'Name must be at least 2 characters';
    if (!editPhone || editPhone.length < 10) e.phone = 'Enter a valid 10-digit number';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setErrors({});
    setSaving(true);

    try {
      const updated = await api.patch('/api/auth/profile', {
        name:  editName.trim(),
        phone: `+92${editPhone}`,
      });
      // Update context so ProfileScreen reflects the new values immediately
      updateProfile({ name: updated.name, phone: updated.phone });
      setToast('Profile updated successfully!');
      setTimeout(() => navigate(-1), 1400);
    } catch (err) {
      setToast('');
      setErrors({ general: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height: '100%', background: '#F8F8F8', width: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        background: '#fff', padding: '28px 20px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid #F0F0F0',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E2069" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#1E2069' }}>My Profile</h2>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>View and edit your information</p>
        </div>
      </div>

      {/* Avatar */}
      <div style={{
        background: 'linear-gradient(135deg, #E86B1F 0%, #CC5500 100%)',
        padding: '28px 20px', textAlign: 'center', width: '100%', boxSizing: 'border-box',
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: '50%',
          background: 'rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', fontSize: 38, border: '2.5px solid rgba(255,255,255,0.5)',
        }}>
          {editName.trim() ? editName.trim()[0].toUpperCase() : '👤'}
        </div>
        <p style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: 16 }}>
          {editName.trim() || 'Your Name'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', fontSize: 13 }}>
          {editPhone ? `+92 ${editPhone}` : 'No number yet'}
        </p>
      </div>

      {/* Form */}
      <div style={{ padding: '24px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 700, color: '#1E2069', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Personal Information
          </h3>

          <InputField
            label="Full Name"
            value={editName}
            onChange={e => { setEditName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
            error={errors.name}
            placeholder="Enter your full name"
          />

          <InputField
            label="Phone Number"
            value={editPhone}
            onChange={e => { setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrors(prev => ({ ...prev, phone: '' })); }}
            error={errors.phone}
            prefix="+92"
            placeholder="3xx-xxxxxxx"
            type="tel"
            maxLength={10}
          />

          {errors.general && (
            <p style={{ color: '#E53935', fontSize: 13, marginTop: -8 }}>{errors.general}</p>
          )}

          <div style={{ marginBottom: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Membership
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFF5EF', border: '1.5px solid rgba(232,107,31,0.2)', borderRadius: 12, padding: '15px 14px' }}>
              <span style={{ fontSize: 18 }}>🏪</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#E86B1F' }}>Food Court Member</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', padding: '17px',
            background: saving ? '#CCCCCC' : '#E86B1F',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, letterSpacing: 1,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 8px 24px rgba(232,107,31,0.35)',
            transition: 'all 0.2s',
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{
            width: '100%', padding: '15px',
            background: 'transparent', color: '#888',
            border: '1.5px solid #E5E5E5', borderRadius: 14,
            fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 12,
          }}
        >
          Cancel
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          background: '#22C55E', color: '#fff', borderRadius: 20, padding: '12px 24px',
          fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
          zIndex: 300, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
        }}>
          <span>✓</span> {toast}
        </div>
      )}
    </div>
  );
}
