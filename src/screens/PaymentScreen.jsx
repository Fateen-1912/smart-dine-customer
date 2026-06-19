import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';

const CreditCardIcon = ({ active }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={active ? '#E86B1F' : '#AAAAAA'} strokeWidth="1.8" strokeLinecap="round">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const CashIcon = ({ active }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={active ? '#E86B1F' : '#AAAAAA'} strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <line x1="6" y1="12" x2="6" y2="12" strokeWidth="3" />
    <line x1="18" y1="12" x2="18" y2="12" strokeWidth="3" />
  </svg>
);

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { cartTotal, cartItems, clearCart } = useCart();
  const [method, setMethod] = useState('card');
  const [cardNum, setCardNum] = useState('');
  const [expiry,  setExpiry]  = useState('');
  const [cvc,     setCvc]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const formatCardNum = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handlePlace = async () => {
    if (method === 'card') {
      if (cardNum.replace(/\s/g, '').length < 16) { setError('Enter a valid 16-digit card number'); return; }
      if (expiry.length < 5) { setError('Enter a valid expiry date'); return; }
      if (cvc.length < 3)    { setError('Enter a valid CVC'); return; }
    }

    setError('');
    setLoading(true);

    const tableId = parseInt(localStorage.getItem('selectedTableId'), 10);
    if (!tableId || isNaN(tableId)) {
      setError('Table selection required. Please go back and select your table.');
      return;
    }

    // Build cart payload for the backend
    const items = cartItems.map(i => ({ menuItemId: i.id, quantity: i.quantity }));
    const paymentMethod = method === 'card' ? 'CARD' : 'CASH';
    const restaurantName = cartItems[0]?.restaurantName || '';

    try {
      const order = await api.post('/api/orders', { items, paymentMethod, tableId });

      if (method === 'cash') {
        // Navigate to cash confirm — keep cart alive until user confirms payment
        navigate('/cash-confirm', {
          state: { orderId: order.id, tokenNumber: order.tokenNumber, restaurantName },
        });
      } else {
        // Card: order is already paid (mock) — clear cart and go to success
        clearCart();
        navigate('/order-success', {
          state: { orderId: order.id, tokenNumber: order.tokenNumber, restaurantName },
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E2069" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1E2069' }}>Add Payment Method</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>Select your payment method to complete the purchase.</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {/* Method Selector */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
          {[
            { key: 'card', label: 'Credit\nCard', Icon: CreditCardIcon },
            { key: 'cash', label: 'Cash',         Icon: CashIcon },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              style={{
                flex: 1, padding: '20px 12px',
                border: `2px solid ${method === key ? '#E86B1F' : '#E5E5E5'}`,
                borderRadius: 14,
                background: method === key ? '#FFF5EF' : '#FAFAFA',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 8, transition: 'all 0.2s',
              }}
            >
              <Icon active={method === key} />
              <span style={{
                fontSize: 13, fontWeight: 700,
                color: method === key ? '#E86B1F' : '#888',
                textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.2,
              }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Card Form */}
        {method === 'card' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNum}
              onChange={e => setCardNum(formatCardNum(e.target.value))}
              style={{ padding: '16px 18px', border: '1.5px solid #E5E5E5', borderRadius: 10, fontSize: 16, letterSpacing: 1, outline: 'none', color: '#1C1C1C' }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 14 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                </span>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  style={{ width: '100%', padding: '16px 16px 16px 40px', border: '1.5px solid #E5E5E5', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#1C1C1C' }}
                />
              </div>
              <input
                type="text"
                placeholder="CVC"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                style={{ flex: 1, padding: '16px', border: '1.5px solid #E5E5E5', borderRadius: 10, fontSize: 15, outline: 'none', color: '#1C1C1C', letterSpacing: 2 }}
              />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ width: 80, height: 80, background: '#FFF5EF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E86B1F" strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 8px', color: '#1E2069', fontWeight: 700, fontSize: 18 }}>Cash Payment</h3>
            <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Place your order now. You will be guided to pay at the restaurant counter on the next step.
            </p>
          </div>
        )}

        {error && <p style={{ color: '#E86B1F', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}

        {/* Total */}
        <div style={{ margin: '24px 0', padding: '16px 20px', background: '#F8F8F8', borderRadius: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#888', fontSize: 15 }}>Total Amount</span>
          <span style={{ color: '#E86B1F', fontWeight: 800, fontSize: 18 }}>Rs {cartTotal}</span>
        </div>
      </div>

      {/* Place Order */}
      <div style={{ padding: '16px 20px', background: '#fff', borderTop: '1px solid #F0F0F0' }}>
        <button
          onClick={handlePlace}
          disabled={loading}
          style={{
            width: '100%', padding: '18px',
            background: loading ? '#CCCCCC' : '#E86B1F',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, letterSpacing: 1.2,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(232,107,31,0.35)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Placing Order...' : 'PLACE ORDER'}
        </button>
      </div>
    </div>
  );
}
