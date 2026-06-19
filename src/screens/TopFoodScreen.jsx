import { useNavigate } from 'react-router-dom';
import { restaurants } from '../data/restaurants';
import BottomNav from '../components/BottomNav';

const topItems = restaurants.flatMap(r =>
  r.menu.slice(0, 2).map(item => ({ ...item, restaurantName: r.name, restaurantId: r.id }))
).sort(() => Math.random() - 0.5).slice(0, 8);

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#FFB800">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function TopFoodScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '52px 20px 20px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#1E2069' }}>Top Food</h1>
        <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Most popular dishes right now</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {topItems.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
              style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              }}
            >
              <div style={{ position: 'relative', height: 120 }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: 8, padding: '3px 8px',
                  display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 12, fontWeight: 700, color: '#1C1C1C',
                }}>
                  <StarIcon />4.5
                </div>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <h4 style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#1C1C1C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h4>
                <p style={{ margin: '0 0 6px', fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.restaurantName}</p>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#E86B1F' }}>Rs {item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
