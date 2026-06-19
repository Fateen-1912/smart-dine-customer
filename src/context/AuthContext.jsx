import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [phone, setPhone]       = useState('');
  const [name,  setName]        = useState('');
  const [userId, setUserId]     = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore session from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setIsRestoring(false); return; }

    api.get('/api/auth/profile')
      .then(user => {
        setPhone(user.phone || '');
        setName(user.name  || '');
        setUserId(user.id);
        setIsLoggedIn(true);

        // Validate table session belongs to current user
        const sessionStr = localStorage.getItem('selectedTableSession');
        if (sessionStr) {
          try {
            const session = JSON.parse(sessionStr);
            // If session belongs to different user, clear it
            if (session.userId !== user.id) {
              localStorage.removeItem('selectedTableId');
              localStorage.removeItem('selectedTableSession');
            }
          } catch (e) {
            // Invalid session data, clear it
            localStorage.removeItem('selectedTableId');
            localStorage.removeItem('selectedTableSession');
          }
        }
      })
      .catch(() => {
        // Token expired or backend down — clear stale tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('selectedTableId');
        localStorage.removeItem('selectedTableSession');
      })
      .finally(() => setIsRestoring(false));
  }, []);

  // Called after a successful OTP verification
  const login = ({ accessToken, refreshToken, user }) => {
    localStorage.setItem('accessToken',  accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // Clear old table session from previous login/user
    localStorage.removeItem('selectedTableId');
    localStorage.removeItem('selectedTableSession');
    setPhone(user.phone || '');
    setName(user.name   || '');
    setUserId(user.id);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Release any claimed table before logging out
      const selectedTableId = localStorage.getItem('selectedTableId');
      if (selectedTableId) {
        try {
          await api.post(`/api/orders/release-table/${selectedTableId}`, {});
        } catch (e) {
          // Silently fail if table release fails (token may be invalid)
          console.log('Table release failed during logout:', e.message);
        }
      }
    } catch (e) {
      // Ignore errors
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('selectedTableId');
    localStorage.removeItem('selectedTableSession');
    setIsLoggedIn(false);
    setPhone('');
    setName('');
    setUserId(null);
  };

  // Called by EditProfileScreen after a successful PATCH
  const updateProfile = ({ name: n, phone: p }) => {
    if (n !== undefined) setName(n);
    if (p !== undefined) setPhone(p);
  };

  return (
    <AuthContext.Provider value={{
      phone, setPhone,
      name,  setName,
      userId,
      isLoggedIn,
      isRestoring,
      login,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
