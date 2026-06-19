import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();


  if (cartCount === 0) {
    return (
      <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: '#fff', padding: '52px 20px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E2069" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1E2069' }}>Your Orders</h2>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
          <div style={{ fontSize: 64 }}>🛒</div>
          <h3 style={{ margin: 0, color: '#1E2069', fontWeight: 700 }}>Your cart is empty</h3>
          <p style={{ color: '#888', textAlign: 'center', lineHeight: 1.5 }}>Add items from a restaurant to get started</p>
          <button
            onClick={() => navigate('/home')}
            style={{
              background: '#E86B1F', color: '#fff', border: 'none', borderRadius: 14,
              padding: '16px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '52px 20px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E2069" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1E2069' }}>Your Orders</h2>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {cartItems.map(item => (
          <div key={item.id} style={{
            background: '#fff',
            borderRadius: 16,
            padding: '16px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}>
            <img src={item.imageUrl || item.image} alt={item.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1C1C1C' }}>{item.name}</h4>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCCCCC', padding: 0, fontSize: 16, lineHeight: 1 }}
                  title="Remove"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
                  </svg>
                </button>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#E86B1F' }}>Rs {item.price}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E5E5', borderRadius: 24, overflow: 'hidden' }}>
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{
                      width: 32, height: 32, background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 18, color: '#1E2069', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >−</button>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1E2069', padding: '0 8px' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{
                      width: 32, height: 32, background: '#E86B1F', border: 'none',
                      cursor: 'pointer', fontSize: 18, color: '#fff', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%', margin: 2,
                    }}
                  >+</button>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#1E2069' }}>Rs {item.price * item.quantity}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Order Summary */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #E5E5E5' }}>
            <span style={{ fontSize: 14, color: '#888' }}>Subtotal</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1C' }}>Rs {cartTotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1E2069' }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#1E2069' }}>Rs {cartTotal}</span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: '#AAAAAA' }}>Pay at counter after placing your order</p>
        </div>
      </div>

      {/* Checkout Button */}
      <div style={{ padding: '16px 20px', background: '#fff', borderTop: '1px solid #F0F0F0' }}>
        <button
          onClick={() => navigate('/payment')}
          style={{
            width: '100%', padding: '18px', background: '#E86B1F', color: '#fff',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            letterSpacing: 1.2, cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(232,107,31,0.35)',
          }}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
}
