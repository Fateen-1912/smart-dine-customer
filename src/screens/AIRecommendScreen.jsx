import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import BottomNav from '../components/BottomNav';

const SUGGESTION_CHIPS = [
  'I want something spicy 🌶️',
  'Suggest Italian food 🍝',
  'Something sweet 🍰',
  'Light and healthy 🥗',
  'Cheesy burger 🍔',
  'Japanese cuisine 🍱',
];

const BOT_WELCOME = {
  id:    'welcome',
  role:  'bot',
  text:  "Hi! 👋 I'm Smart Chef, your AI food assistant. Tell me what you're craving and I'll find the best options across our food court for you!",
  items: [],
};

export default function AIRecommendScreen() {
  const navigate  = useNavigate();
  const [messages,  setMessages]  = useState([BOT_WELCOME]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [trending,  setTrending]  = useState([]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    api.get('/api/menu/trending?limit=4')
      .then(data => setTrending(data))
      .catch(() => {}); // trending is non-critical, fail silently
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: userText, items: [] };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await api.post('/api/ai/recommend', { message: userText });
      const botMsg = {
        id:    Date.now() + 1,
        role:  'bot',
        text:  data.reply,
        items: data.items || [],
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errMsg = {
        id:    Date.now() + 1,
        role:  'bot',
        text:  "Sorry, I couldn't connect to the chef right now. Please try again!",
        items: [],
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', background: '#F8F8F8', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E2069 0%, #2D2D8F 100%)',
        padding: '20px 20px 20px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>🤖</div>
          <div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800 }}>AI Food Assistant</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Smart Chef · Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trending strip — populated from API */}
      {trending.length > 0 && (
        <div style={{ background: '#fff', padding: '14px 0 14px 20px', flexShrink: 0, borderBottom: '1px solid #F0F0F0' }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            🔥 Trending in Food Court
          </p>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingRight: 20 }}>
            {trending.map((item, idx) => {
              const tags = ['🔥 Most Ordered', '⭐ Top Rated', '🍕 Popular', '🍜 Fan Fav'];
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/restaurant/${item.restaurant.id}`)}
                  style={{
                    flexShrink: 0, width: 110, background: '#F8F8F8',
                    borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                    border: '1px solid #F0F0F0',
                  }}
                >
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: 72, objectFit: 'cover' }} />
                  <div style={{ padding: '6px 8px' }}>
                    <p style={{ margin: '0 0 2px', fontSize: 10, color: '#E86B1F', fontWeight: 700 }}>{tags[idx] || '🔥 Popular'}</p>
                    <h4 style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#1C1C1C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h4>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#E86B1F' }}>Rs {item.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        {messages.map(msg => (
          <div key={msg.id}>
            <div style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12, gap: 8, alignItems: 'flex-end',
            }}>
              {msg.role === 'bot' && (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1E2069, #2D2D8F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0,
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: '78%',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #E86B1F, #CC5500)' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1C1C1C',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '12px 14px', fontSize: 14, lineHeight: 1.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                {msg.text}
              </div>
            </div>

            {/* Item cards from AI response */}
            {msg.items && msg.items.length > 0 && (
              <div style={{ marginBottom: 16, marginLeft: 38 }}>
                {msg.items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/restaurant/${item.restaurant?.id || item.restaurantId}`)}
                    style={{
                      display: 'flex', gap: 12, background: '#fff',
                      borderRadius: 14, padding: '12px', marginBottom: 8,
                      cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                      border: '1px solid #F0F0F0',
                    }}
                  >
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#1C1C1C' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 4px', fontSize: 11, color: '#888' }}>
                        {item.restaurant?.name || item.restaurantName}
                      </p>
                      <p style={{ margin: '0 0 4px', fontSize: 11, color: '#22C55E', fontWeight: 600 }}>
                        ✓ {item.reason || 'Popular in the food court'}
                      </p>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#E86B1F' }}>Rs {item.price}</span>
                    </div>
                    <div style={{
                      alignSelf: 'center', background: '#E86B1F', color: '#fff',
                      borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>Order</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E2069, #2D2D8F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🤖</div>
            <div style={{
              background: '#fff', borderRadius: '18px 18px 18px 4px',
              padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#E86B1F',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length === 1 && (
        <div style={{ padding: '0 16px 8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {SUGGESTION_CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                style={{
                  flexShrink: 0, background: '#fff', border: '1.5px solid #E86B1F',
                  borderRadius: 20, padding: '7px 14px',
                  fontSize: 12, fontWeight: 600, color: '#E86B1F', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div style={{
        background: '#fff', padding: '10px 16px', borderTop: '1px solid #F0F0F0', flexShrink: 0,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="What are you craving today?"
          style={{
            flex: 1, border: '1.5px solid #E5E5E5', borderRadius: 22,
            padding: '12px 16px', fontSize: 14, outline: 'none',
            background: '#F8F8F8', color: '#1C1C1C',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: input.trim() && !loading ? '#E86B1F' : '#E5E5E5',
            border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
            boxShadow: input.trim() && !loading ? '0 4px 12px rgba(232,107,31,0.4)' : 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.7); opacity: 0.5; }
          50%       { transform: scale(1);   opacity: 1;   }
        }
      `}</style>

      <BottomNav />
    </div>
  );
}
