import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OrderSuccessScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const cardRef   = useRef(null);

  // Receive order data from PaymentScreen or CashConfirmScreen
  const orderId        = location.state?.orderId        || '';
  const tokenNumber    = location.state?.tokenNumber    || '';
  const restaurantName = location.state?.restaurantName || '';

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.transform = 'scale(1)';
      el.style.opacity   = '1';
    });
  }, []);

  return (
    <div style={{
      height: '100%', background: '#F8F8F8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px', overflowY: 'auto',
    }}>
      {/* Animated Success Card */}
      <div
        ref={cardRef}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #FFB800 0%, #E86B1F 100%)',
          borderRadius: 24, padding: '40px 28px',
          textAlign: 'center', marginBottom: 28,
          boxShadow: '0 12px 40px rgba(232,107,31,0.3)',
          transform: 'scale(0.85)', opacity: 0,
          transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
        }}
      >
        {/* Check Circle */}
        <div style={{
          width: 72, height: 72,
          background: 'rgba(255,255,255,0.28)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 20, margin: '0 0 12px', lineHeight: 1.3 }}>
          You Place the Order Successfully
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 1.7, margin: '0 0 20px' }}>
          You placed the order successfully. You will get your food within 25 minutes. Thanks for using our services. Enjoy your food :)
        </p>

        {/* Token Number — shown if available */}
        {tokenNumber && (
          <div style={{
            background: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: '14px 20px',
            marginBottom: 20, border: '1.5px solid rgba(255,255,255,0.4)',
          }}>
            <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Your Pickup Token
            </p>
            <p style={{ margin: 0, color: '#fff', fontSize: 32, fontWeight: 900, letterSpacing: 3 }}>
              {tokenNumber}
            </p>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
              Show this number at the counter
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'rgba(255,255,255,0.2)', color: '#fff',
            border: '2px solid rgba(255,255,255,0.6)', borderRadius: 10,
            padding: '12px 36px', fontSize: 13, fontWeight: 700, letterSpacing: 0.8, cursor: 'pointer',
          }}
        >
          KEEP BROWSING
        </button>
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#1E2069' }}>Order Successful!</h2>
        <p style={{ color: '#888', fontSize: 14 }}>Your order has been placed successfully.</p>
      </div>

      {/* Action buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={() => navigate('/order-tracking', { state: { orderId } })}
          style={{
            width: '100%', padding: '16px',
            background: '#E86B1F', color: '#fff',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 8px 24px rgba(232,107,31,0.35)',
          }}
        >
          Track Your Order
        </button>
        <button
          onClick={() => navigate('/home')}
          style={{
            width: '100%', padding: '16px',
            background: 'transparent', color: '#E86B1F',
            border: '2px solid #E86B1F', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
