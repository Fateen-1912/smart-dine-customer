import { useNavigate } from 'react-router-dom';

export default function OnboardingScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100%',
      background: '#F5EFE6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '60px 32px 50px',
    }}>
      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 260, height: 260 }}>
          {/* Large circle background */}
          <div style={{
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: '#EDE3D3',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 100,
          }}>
            🍕
          </div>
          {/* Floating food items */}
          <div style={{ position: 'absolute', top: 10, right: 20, fontSize: 36, animation: 'float 3s ease-in-out infinite' }}>🍉</div>
          <div style={{ position: 'absolute', top: 0, left: 30, fontSize: 30, animation: 'float 3.5s ease-in-out infinite 0.5s' }}>🥦</div>
          <div style={{ position: 'absolute', bottom: 20, right: 10, fontSize: 32, animation: 'float 2.8s ease-in-out infinite 1s' }}>🍅</div>
          <div style={{ position: 'absolute', bottom: 10, left: 20, fontSize: 28, animation: 'float 3.2s ease-in-out infinite 0.3s' }}>🥕</div>
        </div>
      </div>

      {/* Text + Button */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1E2069', margin: '0 0 12px', lineHeight: 1.2 }}>
          Choose your food
        </h2>
        <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, margin: '0 0 36px' }}>
          Easily find your type of food craving and you'll get delivery in wide range.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            padding: '18px',
            background: '#E86B1F',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1.2,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(232,107,31,0.4)',
          }}
        >
          GET STARTED
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
