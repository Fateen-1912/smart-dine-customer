import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function TableNumberInputScreen({ isModal = false, onClose = null, onTableSelected = null }) {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectTable = async () => {
    if (!tableNumber.trim()) {
      setError('Please enter a table number');
      return;
    }

    const tableNum = parseInt(tableNumber.trim(), 10);
    if (isNaN(tableNum) || tableNum <= 0) {
      setError('Please enter a valid table number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Validate table exists and is available
      await api.get(`/api/orders/validate-table/${tableNum}`);

      // If switching tables, release the old one first
      const oldTableId = localStorage.getItem('selectedTableId');
      if (oldTableId && oldTableId !== tableNum.toString()) {
        try {
          await api.post(`/api/orders/release-table/${oldTableId}`, {});
        } catch (e) {
          // Continue even if release fails
          console.log('Old table release failed:', e.message);
        }
      }

      // Claim the table immediately (marks OCCUPIED on dashboard)
      const claimedTable = await api.post(`/api/orders/claim-table/${tableNum}`, {});

      // Save to localStorage with userId to prevent cross-user reuse
      localStorage.setItem('selectedTableId', claimedTable.id.toString());
      localStorage.setItem('selectedTableSession', JSON.stringify({
        tableId: claimedTable.id,
        tableNumber: tableNum,
        userId: userId,
        createdAt: new Date().toISOString(),
      }));

      if (onTableSelected) {
        onTableSelected(claimedTable.id);
      } else if (!isModal) {
        navigate('/home');
      } else if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Table not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSelectTable();
    }
  };

  return (
    <div style={{ height: '100%', background: isModal ? 'transparent' : '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      {!isModal && (
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
      )}

      {/* Modal Card (when used as modal) */}
      {isModal && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '32px 24px',
            width: '100%',
            maxWidth: '380px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1E2069', margin: '0 0 10px', textAlign: 'center' }}>
              Enter Your Table Number
            </h1>
            <p style={{ color: '#888', fontSize: 13, margin: '0 0 28px', lineHeight: 1.5, textAlign: 'center' }}>
              Tell us which table you're sitting at
            </p>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
              TABLE NUMBER
            </label>
            <input
              type="number"
              value={tableNumber}
              onChange={e => { setTableNumber(e.target.value); setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 5"
              autoFocus
              style={{
                width: '100%',
                padding: '16px 14px',
                border: '1.5px solid #E5E5E5',
                borderRadius: 10,
                fontSize: 15,
                color: '#1C1C1C',
                outline: 'none',
                marginBottom: error ? 6 : 24,
                boxSizing: 'border-box',
              }}
            />
            {error && <p style={{ color: '#E86B1F', fontSize: 12, margin: '0 0 20px', textAlign: 'center' }}>{error}</p>}

            <button
              onClick={handleSelectTable}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#CCCCCC' : '#E86B1F',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 16px rgba(232,107,31,0.3)',
              }}
            >
              {loading ? 'Validating...' : 'CONFIRM TABLE'}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                style={{
                  marginTop: 12,
                  width: '100%',
                  padding: '12px',
                  background: 'none',
                  color: '#888',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full-screen form (when not modal) */}
      {!isModal && (
        <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1E2069', margin: '0 0 10px' }}>
            Enter Your Table Number
          </h1>
          <p style={{ color: '#888', fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>
            Which table are you dining at? We'll remember this for your orders
          </p>

          <label style={{ fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
            TABLE NUMBER
          </label>
          <input
            type="number"
            value={tableNumber}
            onChange={e => { setTableNumber(e.target.value); setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 5"
            autoFocus
            style={{
              width: '100%',
              padding: '16px 14px',
              border: '1.5px solid #E5E5E5',
              borderRadius: 10,
              fontSize: 15,
              color: '#1C1C1C',
              outline: 'none',
              marginBottom: error ? 6 : 28,
              boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ color: '#E86B1F', fontSize: 12, margin: '0 0 24px' }}>{error}</p>}

          <button
            onClick={handleSelectTable}
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
            {loading ? 'Validating...' : 'CONFIRM TABLE'}
          </button>
        </div>
      )}
    </div>
  );
}
