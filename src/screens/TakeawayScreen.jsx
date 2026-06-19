import { useNavigate } from 'react-router-dom';

export default function TakeawayScreen() {
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
      textAlign: 'center',
    }}>
      {/* Title */}
      <div>
        <h1 style={{
          fontSize: 30,
          fontWeight: 900,
          color: '#1E2069',
          lineHeight: 1.2,
          margin: '0 0 12px',
        }}>
          Your Order<br />is Ready<br />for Take Away
        </h1>
      </div>

      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 100, lineHeight: 1, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))' }}>
          🥡
        </div>
      </div>

      {/* Bottom Text */}
      <div style={{ width: '100%' }}>
        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.6, margin: '0 0 32px' }}>
          Please Collect Your Meal From the Counter
        </p>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'none',
            border: 'none',
            color: '#E86B1F',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.5,
            textDecoration: 'underline',
          }}
        >
          KEEP BROWSING
        </button>
      </div>
    </div>
  );
}
