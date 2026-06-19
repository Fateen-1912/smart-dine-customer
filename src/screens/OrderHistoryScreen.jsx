import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const STATUS_COLOR = {
  PLACED:    '#FFB800',
  PREPARING: '#E86B1F',
  READY:     '#22C55E',
  COLLECTED: '#22C55E',
  CANCELLED: '#AAAAAA',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs  = now - d;
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffDay === 0) return `Today, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDay === 1) return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function OrderHistoryScreen() {
  const navigate = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get('/api/orders/history')
      .then(data => { setOrders(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

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
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1E2069' }}>Order History</h2>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>Your past food court orders</p>
        </div>
      </div>

      <div style={{ padding: '16px 20px', flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#AAAAAA', fontSize: 14 }}>
            Loading orders...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <p style={{ color: '#AAAAAA', fontSize: 14 }}>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
            <p style={{ color: '#AAAAAA', fontSize: 16, marginBottom: 8 }}>No orders yet</p>
            <p style={{ color: '#CCCCCC', fontSize: 13 }}>Your completed orders will appear here</p>
            <button
              onClick={() => navigate('/home')}
              style={{ marginTop: 20, background: '#E86B1F', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}
            >
              Browse Food Court
            </button>
          </div>
        ) : (
          orders.map(order => {
            const statusColor = STATUS_COLOR[order.status] || '#AAAAAA';
            const itemNames   = order.items.map(i => i.name);
            const shortId     = order.id.split('-')[0].toUpperCase();

            return (
              <div
                key={order.id}
                style={{ background: '#fff', borderRadius: 16, padding: '18px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: '#1C1C1C' }}>
                      {order.restaurant.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: 12, color: '#AAAAAA' }}>{formatDate(order.createdAt)}</p>
                  </div>
                  <span style={{
                    background: statusColor === '#22C55E' ? '#F0FDF4' : '#FFF5EF',
                    color: statusColor, borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700,
                  }}>
                    {order.status === 'COLLECTED' || order.status === 'READY' ? '✓ ' : ''}{order.status}
                  </span>
                </div>

                <div style={{ background: '#F8F8F8', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.6 }}>
                    {itemNames.join(' · ')}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: '#AAAAAA' }}>
                      ID: #{shortId} · Token: {order.tokenNumber}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 800, color: '#E86B1F' }}>
                      Rs {order.subtotal}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/home')}
                    style={{
                      background: '#FFF0E7', color: '#E86B1F',
                      border: '1.5px solid #E86B1F', borderRadius: 10,
                      padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Reorder
                  </button>
                </div>
              </div>
            );
          })
        )}

        {orders.length > 0 && (
          <div style={{ textAlign: 'center', padding: '12px 0 28px', color: '#CCCCCC', fontSize: 12 }}>
            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
