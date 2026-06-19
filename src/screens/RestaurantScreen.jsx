import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';

const StarFilled = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFB800">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function MenuItemRow({ item, onAdd, onInc, onDec, qty }) {
  const [flash, setFlash] = useState(false);

  const handleAdd = () => {
    onAdd(item);
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  };

  return (
    <div style={{ background: '#fff', marginBottom: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <img src={item.imageUrl} alt={item.name} style={{ width: 82, height: 82, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#1C1C1C' }}>{item.name}</h4>
        <p style={{ margin: '0 0 8px', fontSize: 12, color: '#888', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {item.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1E2069' }}>Rs {item.price}</span>
          {qty > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E86B1F', borderRadius: 8, overflow: 'hidden' }}>
              <button onClick={onDec} style={{ background: '#E86B1F', border: 'none', color: '#fff', width: 32, height: 32, cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
              <span style={{ padding: '0 12px', fontSize: 14, fontWeight: 700, color: '#E86B1F' }}>{qty}</span>
              <button onClick={onInc} style={{ background: '#E86B1F', border: 'none', color: '#fff', width: 32, height: 32, cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              style={{
                background: flash ? '#22C55E' : '#E86B1F',
                color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', minWidth: 64,
              }}
            >
              {flash ? '✓' : 'ADD'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RestaurantScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, cartItems, cartTotal, cartCount } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/restaurants/${id}`)
      .then(data => {
        setRestaurant(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAAAAA' }}>
        Loading menu...
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <p style={{ color: '#AAAAAA', textAlign: 'center', marginBottom: 16 }}>{error || 'Restaurant not found'}</p>
        <button onClick={() => navigate(-1)} style={{ background: '#E86B1F', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  // Build flat menu list and category tab list from API response
  const categoryNames = ['All', ...restaurant.categories.map(c => c.name)];
  const allItems = restaurant.categories.flatMap(c => c.menuItems);
  const filtered = activeCategory === 'All'
    ? allItems
    : (restaurant.categories.find(c => c.name === activeCategory)?.menuItems || []);

  const getQty = (itemId) => {
    const found = cartItems.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingBottom: cartCount > 0 ? 90 : 20 }}>
      {/* Cover Image */}
      <div style={{ position: 'relative', height: 200, flexShrink: 0 }}>
        <img src={restaurant.coverImage} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 60%)' }} />
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 48, left: 16,
            background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
            width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2069" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{ position: 'absolute', bottom: 16, left: 20 }}>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {restaurant.name}
          </h2>
        </div>
      </div>

      {/* Info Card */}
      <div style={{ background: '#fff', padding: '18px 20px', marginBottom: 8 }}>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: '#666', lineHeight: 1.6 }}>{restaurant.tagline}</p>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <StarFilled />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1C1C1C' }}>{restaurant.rating}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 13 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Ready in ~{restaurant.prepTimeMin} min
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1E2069', fontSize: 13, fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E2069" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
            </svg>
            Collect at Counter
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F0F0F0', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 0, padding: '0 12px', overflowX: 'auto' }}>
          {categoryNames.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '14px 18px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700,
                color: activeCategory === cat ? '#E86B1F' : '#888',
                borderBottom: activeCategory === cat ? '3px solid #E86B1F' : '3px solid transparent',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div>
        {filtered.map(item => (
          <MenuItemRow
            key={item.id}
            item={item}
            qty={getQty(item.id)}
            onAdd={() => addToCart(item, restaurant.name)}
            onInc={() => updateQuantity(item.id, 1)}
            onDec={() => updateQuantity(item.id, -1)}
          />
        ))}
      </div>

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
        <div
          onClick={() => navigate('/cart')}
          style={{
            position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)', maxWidth: 390,
            background: '#E86B1F', borderRadius: 16, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', boxShadow: '0 8px 32px rgba(232,107,31,0.45)', zIndex: 50,
          }}
        >
          <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 8, padding: '4px 12px', color: '#fff', fontWeight: 700, fontSize: 14 }}>
            {cartCount}
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>View Cart</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Rs {cartTotal}</span>
        </div>
      )}
    </div>
  );
}
