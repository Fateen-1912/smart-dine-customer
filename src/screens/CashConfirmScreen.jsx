import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';
import { io } from 'socket.io-client';

export default function CashConfirmScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { cartTotal, cartItems, clearCart } = useCart();

  const orderId        = location.state?.orderId        || '';
  const tokenNumber    = location.state?.tokenNumber    || '';
  const restaurantName = location.state?.restaurantName || cartItems[0]?.restaurantName || 'the outlet';

  const [status,    setStatus]    = useState('pending');  // 'pending' | 'confirmed'
  const [dotsCount, setDotsCount] = useState(1);

  // Animate waiting dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDotsCount(prev => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Listen for staff confirmation via Socket.IO
  useEffect(() => {
    if (!orderId) return;

    const BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-dine-api.onrender.com';
    const token = localStorage.getItem('accessToken');

    console.log('[Customer Socket] Creating socket connection to:', BASE_URL);
    console.log('[Customer Socket] Auth token:', token ? 'Present' : 'MISSING');
    console.log('[Customer Socket] Waiting for order:', orderId);

    const socket = io(BASE_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('[Customer Socket] Connected! Socket ID:', socket.id);
      console.log('[Customer Socket] Emitting join:order for:', orderId);
      socket.emit('join:order', orderId);
    });

    socket.on('order:payment_confirmed', (data) => {
      console.log('[Customer Socket] Received order:payment_confirmed event:', data);
      if (data?.orderId === orderId) {
        console.log('[Customer Socket] Payment confirmed! Navigating to tracking...');
        setStatus('confirmed');
        setTimeout(() => {
          clearCart();
          navigate('/order-tracking', { state: { orderId } });
        }, 1500);
      }
    });

    console.log('[Customer Socket] Calling socket.connect()');
    socket.connect();

    return () => {
      console.log('[Customer Socket] Cleaning up socket for order:', orderId);
      if (socket.connected) {
        socket.emit('leave:order', orderId);
      }
      socket.disconnect();
    };
  }, [orderId, navigate, clearCart]);

  const isConfirmed = status === 'confirmed';
  const dots = '.'.repeat(dotsCount);

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{
        background: '#fff', padding: '28px 20px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid #F0F0F0', flexShrink: 0,
      }}>
        <div style={{ width: 30 }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#1E2069' }}>Cash Payment</h2>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>Waiting for staff confirmation</p>
        </div>
        <div style={{ width: 30 }} />
      </div>

      <div style={{ padding: '24px 20px', flex: 1 }}>

        {/* Status Card */}
        <div style={{
          background: '#fff', borderRadius: 24, padding: '32px 24px',
          textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: 20,
          border: isConfirmed ? '2px solid #22C55E' : '2px solid rgba(232,107,31,0.2)',
          transition: 'border-color 0.4s ease',
        }}>

          {/* Icon */}
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: isConfirmed
              ? 'linear-gradient(135deg, #D1FAE5, #A7F3D0)'
              : 'linear-gradient(135deg, #FFF5EF, #FFE0CB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 42,
            border: isConfirmed ? '3px solid rgba(34,197,94,0.3)' : '3px solid rgba(232,107,31,0.15)',
            transition: 'all 0.4s ease',
          }}>
            {isConfirmed ? '✅' : '🏪'}
          </div>

          {/* Title */}
          <h2 style={{
            margin: '0 0 8px', fontSize: 20, fontWeight: 800,
            color: isConfirmed ? '#22C55E' : '#1E2069',
            transition: 'color 0.4s ease',
          }}>
            {isConfirmed ? 'Payment Confirmed!' : 'Awaiting Confirmation'}
          </h2>

          <p style={{ margin: '0 0 24px', color: '#666', fontSize: 14, lineHeight: 1.6 }}>
            {isConfirmed
              ? 'Your payment was confirmed by staff. Starting order preparation...'
              : <>Please pay at the <strong style={{ color: '#E86B1F' }}>{restaurantName}</strong> counter. Staff will confirm your payment.</>
            }
          </p>

          {/* Restaurant */}
          <div style={{
            background: '#F8F8F8', borderRadius: 12, padding: '12px 16px',
            marginBottom: 14, textAlign: 'left',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Restaurant</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1E2069' }}>{restaurantName}</span>
          </div>

          {/* Token Number */}
          {tokenNumber && (
            <div style={{
              background: 'linear-gradient(135deg, #1E2069, #2D2D8F)',
              borderRadius: 16, padding: '18px 20px',
              marginBottom: 14,
            }}>
              <p style={{ margin: '0 0 6px', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Your Token Number
              </p>
              <p style={{ margin: 0, color: '#fff', fontSize: 36, fontWeight: 900, letterSpacing: 4 }}>
                {tokenNumber}
              </p>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                Show this number at the counter
              </p>
            </div>
          )}

          {/* Payment Status Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: isConfirmed ? '#F0FDF4' : '#FFFBEB',
            border: `1.5px solid ${isConfirmed ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.4)'}`,
            borderRadius: 20, padding: '8px 18px',
            marginBottom: 20, transition: 'all 0.4s ease',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isConfirmed ? '#22C55E' : '#EAB308',
              boxShadow: isConfirmed ? '0 0 6px rgba(34,197,94,0.6)' : '0 0 6px rgba(234,179,8,0.6)',
            }} />
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: isConfirmed ? '#16A34A' : '#A16207',
            }}>
              Payment Status: {isConfirmed ? 'CONFIRMED' : 'PENDING'}
            </span>
          </div>

          {/* Amount */}
          <div style={{
            background: 'linear-gradient(135deg, #E86B1F, #CC5500)',
            borderRadius: 14, padding: '16px',
          }}>
            <p style={{ margin: '0 0 2px', color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Amount to Pay
            </p>
            <p style={{ margin: 0, color: '#fff', fontSize: 32, fontWeight: 900, letterSpacing: -1 }}>
              Rs {cartTotal}
            </p>
          </div>
        </div>

        {/* Waiting Indicator */}
        {!isConfirmed && (
          <div style={{
            background: '#fff', borderRadius: 16, padding: '18px 20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: dotsCount > i ? '#E86B1F' : '#E5E5E5',
                    transition: 'background 0.3s ease',
                  }} />
                ))}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 }}>
              Waiting for staff to confirm payment{dots}
              <br />
              <span style={{ fontSize: 11, color: '#AAAAAA' }}>
                Once confirmed, order preparation begins automatically.
              </span>
            </p>
          </div>
        )}

        {/* Order Summary */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '16px 20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Your Order
          </h4>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#444' }}>
                {item.name} <span style={{ color: '#AAAAAA' }}>×{item.quantity}</span>
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1E2069' }}>Rs {item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px dashed #E5E5E5', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#1E2069' }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#E86B1F' }}>Rs {cartTotal}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
