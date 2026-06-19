import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BASE_URL } from '../api/client';

const STAGES = [
  { label: 'Order Placed',       icon: '📋', desc: 'Your order has been received by the outlet',  color: '#E86B1F' },
  { label: 'Preparing',          icon: '👨‍🍳', desc: 'Our chefs are preparing your food with care', color: '#E86B1F' },
  { label: 'Ready for Collection', icon: '✅', desc: 'Please collect your order from the counter',   color: '#22C55E' },
];

const TOTAL_SECONDS = 15 * 60;

// Map backend status strings to stage indices
const STATUS_TO_STAGE = { PLACED: 0, PREPARING: 1, READY: 2, COLLECTED: 2, CANCELLED: 2 };

export default function OrderTrackingScreen() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const socketRef   = useRef(null);

  // orderId comes from navigation state set by OrderSuccessScreen
  const orderId = location.state?.orderId || '';

  const [currentStage,   setCurrentStage]   = useState(0);
  const [seconds,        setSeconds]        = useState(TOTAL_SECONDS);
  const [tableTimer,     setTableTimer]     = useState(null);
  const [remainingTime,  setRemainingTime]  = useState(null);

  useEffect(() => {
    // Countdown timer — runs independently of socket
    const interval = setInterval(() => {
      setSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    if (!orderId) {
      // No real order — fall back to demo simulation
      const t1 = setTimeout(() => setCurrentStage(1), 4000);
      const t2 = setTimeout(() => setCurrentStage(2), 9000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval); };
    }

    // Connect to backend Socket.IO
    const token  = localStorage.getItem('accessToken');
    const socket = io(BASE_URL, {
      auth:    { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Customer] Socket connected! Joining order:', orderId);
      socket.emit('join:order', orderId);
    });

    socket.on('order:status_update', (data) => {
      console.log('[Timer Received]', JSON.stringify(data, null, 2));
      const stage = STATUS_TO_STAGE[data.status];
      console.log('[Stage Mapping] status:', data.status, '-> stage:', stage);
      if (stage !== undefined) {
        console.log('[Stage Update] Setting stage to:', stage);
        setCurrentStage(stage);
      }
      if (data.tableTimer) {
        console.log('[Timer Set] Setting tableTimer:', data.tableTimer);
        setTableTimer(data.tableTimer);
      }
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
      // Fall back to demo simulation if socket fails
      setTimeout(() => setCurrentStage(1), 10_000);
      setTimeout(() => setCurrentStage(2), 30_000);
    });

    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.emit('leave:order', orderId);
        socketRef.current.disconnect();
      }
    };
  }, [orderId]);

  // Dining timer countdown — runs when order is collected and we have table timer data
  useEffect(() => {
    console.log('[Timer Effect] tableTimer:', tableTimer, 'currentStage:', currentStage);
    if (tableTimer && currentStage === 2) {
      console.log('[Timer Effect] Starting dining timer countdown');
      const calculateRemaining = () => {
        const elapsed = (Date.now() - new Date(tableTimer.occupiedAt).getTime()) / 60000;
        const remaining = Math.max(0, tableTimer.duration - elapsed);
        console.log('[Timer Calc] elapsed:', elapsed.toFixed(2), 'min, remaining:', remaining.toFixed(2), 'min');
        setRemainingTime(remaining);
      };

      calculateRemaining();
      const interval = setInterval(calculateRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [tableTimer, currentStage]);

  const formatTimeRemaining = (minutes) => {
    if (minutes < 0) return 'Expired';
    const m = Math.floor(minutes);
    const s = Math.floor((minutes - m) * 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const mins       = Math.floor(seconds / 60);
  const secs       = seconds % 60;
  const isReady    = currentStage === 2;
  const progressPct = ((TOTAL_SECONDS - seconds) / TOTAL_SECONDS) * 100;

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #E86B1F 0%, #CC5500 100%)', padding: '28px 20px 32px' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 16 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#fff' }}>Track Your Order</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
          {isReady ? 'Your food is ready!' : "We'll let you know when it's ready!"}
        </p>
      </div>

      {/* Timer Card */}
      <div style={{ margin: '-16px 20px 0', background: '#fff', borderRadius: 20, padding: '24px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', textAlign: 'center', zIndex: 1 }}>
        {isReady ? (
          <>
            <div style={{ fontSize: 60, marginBottom: 8 }}>🎉</div>
            <h2 style={{ margin: '0 0 4px', color: '#22C55E', fontWeight: 800, fontSize: 20 }}>Order Ready!</h2>
            <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Please collect your order from the counter</p>
          </>
        ) : (
          <>
            <p style={{ margin: '0 0 6px', color: '#888', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Estimated Ready Time
            </p>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#E86B1F', letterSpacing: -2, lineHeight: 1 }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
            <p style={{ margin: '6px 0 16px', color: '#AAAAAA', fontSize: 12 }}>minutes remaining</p>
            <div style={{ background: '#F0F0F0', borderRadius: 6, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #FFB800, #E86B1F)',
                borderRadius: 6, transition: 'width 1s linear',
              }} />
            </div>
          </>
        )}
      </div>

      {/* Dining Timer Card - shown when order is COLLECTED */}
      {isReady && remainingTime !== null && (
        <div style={{
          margin: '20px 20px 0', background: '#E8F5FF', borderRadius: 20, padding: '24px 20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '2px solid #5BA3D0',
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#1E3A5F', textAlign: 'center' }}>
            Dining Time Remaining
          </h3>
          <div style={{
            fontSize: 48, fontWeight: 900, color: '#2C5AA0', textAlign: 'center',
            letterSpacing: -1, fontFamily: 'monospace', marginBottom: 12,
          }}>
            {formatTimeRemaining(remainingTime)}
          </div>
          {remainingTime > 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: '#1E3A5F', textAlign: 'center', lineHeight: 1.4 }}>
              Enjoy your meal! Your table is reserved for {tableTimer.duration} minutes
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: '#C85A54', textAlign: 'center', fontWeight: 600, lineHeight: 1.4 }}>
              Dining time has ended. Please enjoy your meal and leave when ready.
            </p>
          )}
        </div>
      )}

      {/* Stage Progress */}
      <div style={{ margin: '20px 20px 0', background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 800, color: '#1E2069' }}>Order Progress</h3>
        {STAGES.map((stage, idx) => {
          const isDone   = idx < currentStage;
          const isActive = idx === currentStage;
          const dotColor   = isDone ? '#22C55E' : isActive ? '#E86B1F' : '#E0E0E0';
          const labelColor = isDone ? '#22C55E' : isActive ? '#E86B1F' : '#AAAAAA';

          return (
            <div key={stage.label} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: dotColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  boxShadow: isActive ? `0 4px 14px rgba(232,107,31,0.45)` : isDone ? '0 4px 12px rgba(34,197,94,0.3)' : 'none',
                  transition: 'all 0.5s ease',
                }}>
                  <span style={{ fontSize: isDone ? 20 : 18 }}>{isDone ? '✓' : stage.icon}</span>
                </div>
                {idx < STAGES.length - 1 && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 28,
                    background: isDone ? '#22C55E' : '#E5E5E5',
                    margin: '4px 0', transition: 'background 0.6s ease',
                  }} />
                )}
              </div>
              <div style={{ paddingTop: 10, paddingBottom: idx < STAGES.length - 1 ? 20 : 0 }}>
                <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: labelColor, transition: 'color 0.4s' }}>
                  {stage.label}
                  {isActive && (
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, color: '#E86B1F', background: '#FFF0E7', borderRadius: 8, padding: '2px 8px' }}>
                      IN PROGRESS
                    </span>
                  )}
                </h4>
                <p style={{ margin: 0, fontSize: 12, color: isActive || isDone ? '#888' : '#CCCCCC', lineHeight: 1.4 }}>
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collection Info */}
      <div style={{
        margin: '16px 20px',
        background: 'linear-gradient(135deg, #FFF5EF, #FFF0E0)',
        borderRadius: 16, padding: '18px',
        border: '1px solid rgba(232,107,31,0.15)',
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>🏪</div>
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#1E2069' }}>Collection Point</h4>
            <p style={{ margin: 0, fontSize: 12, color: '#888', lineHeight: 1.5 }}>
              Collect your order from the outlet counter. Show this screen to the staff member upon arrival.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 20px 28px' }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            width: '100%', padding: '16px',
            background: isReady ? '#22C55E' : '#E86B1F',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 8px 24px ${isReady ? 'rgba(34,197,94,0.35)' : 'rgba(232,107,31,0.35)'}`,
            transition: 'all 0.4s ease',
          }}
        >
          {isReady ? '🎉 Go Back Home' : 'Back to Home'}
        </button>
      </div>
    </div>
  );
}
