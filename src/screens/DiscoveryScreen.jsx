import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import BottomNav from '../components/BottomNav';

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB800">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const cuisineFilters = ['All', 'Burgers', 'Pizza', 'Coffee', 'Japanese', 'Italian'];

// Maps filter button labels to actual cuisine values in the database
const filterMap = {
  'All':      [],
  'Burgers':  ['American', 'Fast Food'],
  'Pizza':    ['Pizza', 'Italian'],
  'Coffee':   ['Coffee', 'Cafe', 'Dessert'],
  'Japanese': ['Japanese', 'Asian'],
  'Italian':  ['Italian', 'Pizza'],
};

export default function DiscoveryScreen() {
  const navigate = useNavigate();
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [activeFilter,   setActiveFilter]   = useState('All');
  const [search,         setSearch]         = useState('');

  useEffect(() => {
    api.get('/api/restaurants')
      .then(data => { setAllRestaurants(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const filtered = allRestaurants.filter(r => {
    const allowed = filterMap[activeFilter] || [];
    const matchFilter = activeFilter === 'All' ||
      r.cuisines.some(c => allowed.some(a => c.toLowerCase().includes(a.toLowerCase())));
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisines.some(c => c.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '52px 20px 16px' }}>
        <h1 style={{ margin: '0 0 14px', fontSize: 22, fontWeight: 800, color: '#1E2069' }}>Discover</h1>
        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#F5F5F5', borderRadius: 12, padding: '12px 16px', marginBottom: 16,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants or cuisines..."
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, outline: 'none', color: '#1C1C1C' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#AAAAAA', cursor: 'pointer', fontSize: 18, padding: 0 }}>×</button>
          )}
        </div>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {cuisineFilters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                flexShrink: 0, padding: '7px 16px', borderRadius: 20,
                border: `1.5px solid ${activeFilter === f ? '#E86B1F' : '#E5E5E5'}`,
                background: activeFilter === f ? '#E86B1F' : '#fff',
                color: activeFilter === f ? '#fff' : '#888',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#AAAAAA', fontSize: 14 }}>
            Loading restaurants...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#AAAAAA' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#AAAAAA' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <p style={{ fontSize: 16 }}>No restaurants found</p>
          </div>
        ) : (
          filtered.map(r => (
            <div
              key={r.id}
              onClick={() => navigate(`/restaurant/${r.id}`)}
              style={{ background: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
            >
              <div style={{ position: 'relative', height: 160 }}>
                <img src={r.coverImage} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: '#E86B1F', color: '#fff', borderRadius: 8, padding: '4px 10px',
                  fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <StarIcon />{r.rating}
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1C1C1C' }}>{r.name}</h3>
                <p style={{ margin: '0 0 8px', fontSize: 12, color: '#888' }}>
                  {r.priceRange} · {r.cuisines.join(' · ')}
                </p>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#AAAAAA' }}>
                  <span>⏱ ~{r.prepTimeMin} min</span>
                  <span>👍 {r.reviewCount?.toLocaleString()} ratings</span>
                  <span style={{ background: '#F0F0F0', borderRadius: 4, padding: '2px 6px', color: '#666' }}>{r.priceRange}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
