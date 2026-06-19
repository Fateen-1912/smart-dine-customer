import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import TableNumberInputScreen from './TableNumberInputScreen';

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB800">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function HomeScreen() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [trending,    setTrending]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [showTableInput, setShowTableInput] = useState(false);
  const [validatingTable, setValidatingTable] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [restData, trendData] = await Promise.all([
          api.get('/api/restaurants'),
          api.get('/api/menu/trending?limit=4'),
        ]);
        setRestaurants(restData);
        setTrending(trendData);

        // Validate current table session
        await validateAndRestoreTableSession();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const validateAndRestoreTableSession = async () => {
    try {
      const selectedTableId = localStorage.getItem('selectedTableId');
      const sessionStr = localStorage.getItem('selectedTableSession');

      if (!selectedTableId || !sessionStr) {
        setShowTableInput(true);
        return;
      }

      try {
        const session = JSON.parse(sessionStr);
        // Check if session belongs to current user
        if (session.userId !== userId) {
          localStorage.removeItem('selectedTableId');
          localStorage.removeItem('selectedTableSession');
          setShowTableInput(true);
          return;
        }

        // Trust the existing session — table is occupied by this user
        // (if user placed orders there, table is now OCCUPIED)
        // Do NOT re-validate as if it's a new table entry
        setValidatingTable(false);
      } catch (err) {
        // Session data corrupt or parse failed
        localStorage.removeItem('selectedTableId');
        localStorage.removeItem('selectedTableSession');
        setShowTableInput(true);
        setValidatingTable(false);
      }
    } catch (e) {
      setShowTableInput(true);
      setValidatingTable(false);
    }
  };

  const featured = restaurants[0];

  // Show table number input modal if no table selected yet
  if (showTableInput) {
    return (
      <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Overlay backdrop */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />

        {/* Modal content - stays inside mobile container */}
        <div style={{ position: 'relative', zIndex: 50, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <TableNumberInputScreen
            isModal={true}
            onClose={() => setShowTableInput(false)}
            onTableSelected={() => setShowTableInput(false)}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>
        <div style={{ background: '#fff', padding: '20px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: '#888', marginBottom: 2 }}>Welcome to</p>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#E86B1F' }}>Smart Dine</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAAAAA', fontSize: 14 }}>
          Loading restaurants...
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
          <p style={{ color: '#AAAAAA', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#E86B1F', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '20px 20px 16px', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: '#888', marginBottom: 2 }}>Welcome to</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#E86B1F' }}>Smart Dine</span>
              <span style={{ fontSize: 14, color: '#888', fontWeight: 400 }}>Food Court</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/ai-recommend')}
            style={{
              background: 'linear-gradient(135deg, #E86B1F, #FFB800)',
              border: 'none', borderRadius: 12, padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(232,107,31,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2L9.19 8.63L2 9.24L7 13.97L5.82 21L12 17.27L18.18 21L17 13.97L22 9.24L14.81 8.63L12 2Z" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>AI Chef</span>
          </button>
        </div>

        {/* Current Table Display */}
        {!showTableInput && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#FFF5EF', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#888' }}>📍 Dining at:</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#E86B1F' }}>
                {validatingTable ? 'Validating...' : `Table ${localStorage.getItem('selectedTableId') || '—'}`}
              </span>
            </div>
            <button
              onClick={() => setShowTableInput(true)}
              disabled={validatingTable}
              style={{ background: 'none', border: 'none', color: '#E86B1F', fontSize: 12, fontWeight: 700, cursor: validatingTable ? 'not-allowed' : 'pointer', padding: '4px 8px', opacity: validatingTable ? 0.6 : 1 }}
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* Hero Banner */}
      {featured && (
        <div
          onClick={() => navigate(`/restaurant/${featured.id}`)}
          style={{
            margin: '16px 20px', borderRadius: 20, overflow: 'hidden',
            height: 190, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.14)', position: 'relative',
          }}
        >
          <img
            src={featured.coverImage}
            alt={featured.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
          }} />
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: '#E86B1F', borderRadius: 8, padding: '4px 10px',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            🔥 Featured
          </div>
          <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0 }}>{featured.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: '4px 0 0' }}>
              {featured.cuisines.join(' • ')} · Ready in ~{featured.prepTimeMin} min
            </p>
          </div>
        </div>
      )}

      {/* Trending Now */}
      {trending.length > 0 && (
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#1C1C1C' }}>🔥 Trending Now</h2>
            <button
              onClick={() => navigate('/ai-recommend')}
              style={{ background: 'none', border: 'none', color: '#E86B1F', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              See all
            </button>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {trending.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/restaurant/${item.restaurant.id}`)}
                style={{
                  flexShrink: 0, width: 130, background: '#fff',
                  borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                }}
              >
                <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: 90, objectFit: 'cover' }} />
                <div style={{ padding: '8px 10px' }}>
                  <h4 style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 700, color: '#1C1C1C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#E86B1F' }}>Rs {item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outlets Section */}
      <div style={{ padding: '0 20px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1C1C1C' }}>
            Food Court <span style={{ color: '#888', fontWeight: 400, fontSize: 14 }}>Outlets</span>
          </h2>
          <button
            onClick={() => navigate('/discovery')}
            style={{ background: 'none', border: 'none', color: '#E86B1F', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            See all
          </button>
        </div>

        {restaurants.map(r => (
          <div
            key={r.id}
            onClick={() => navigate(`/restaurant/${r.id}`)}
            style={{
              background: '#fff', borderRadius: 14, marginBottom: 14,
              overflow: 'hidden', cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              display: 'flex', height: 100,
            }}
          >
            <img
              src={r.coverImage}
              alt={r.name}
              style={{ width: 110, height: '100%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ padding: '12px 14px', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1C1C1C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                  {r.name}
                </h3>
                <div style={{
                  background: '#E86B1F', color: '#fff', borderRadius: 6, padding: '2px 7px',
                  fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
                }}>
                  <StarIcon />{r.rating}
                </div>
              </div>
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#888' }}>
                {r.priceRange} · {r.cuisines.join(' · ')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#AAAAAA' }}>
                <span>⏱ ~{r.prepTimeMin} min</span>
                <span style={{ background: '#F0F0F0', borderRadius: 4, padding: '2px 6px', color: '#666' }}>
                  {r.cuisines[0]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
