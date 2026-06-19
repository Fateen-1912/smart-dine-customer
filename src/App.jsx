import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import WelcomeScreen from './screens/WelcomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import NameSetupScreen from './screens/NameSetupScreen';
import HomeScreen from './screens/HomeScreen';
import DiscoveryScreen from './screens/DiscoveryScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import CartScreen from './screens/CartScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import TakeawayScreen from './screens/TakeawayScreen';
import ProfileScreen from './screens/ProfileScreen';
import TopFoodScreen from './screens/TopFoodScreen';
import AIRecommendScreen from './screens/AIRecommendScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CashConfirmScreen from './screens/CashConfirmScreen';

import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-wrapper">
            <div className="phone-shell">
              {/* Status Bar */}
              <div className="status-bar">
                <span className="status-time">9:41</span>
                <div className="status-icons">
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
                    <rect x="0" y="5" width="3" height="7" rx="0.5" opacity="0.35" />
                    <rect x="4.5" y="3" width="3" height="9" rx="0.5" opacity="0.6" />
                    <rect x="9" y="0.5" width="3" height="11.5" rx="0.5" />
                    <rect x="14" y="4" width="2.5" height="6" rx="0.5" opacity="0.9" />
                  </svg>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M8 2C5.6 2 3.5 3 2 4.6L0.5 3.1C2.4 1.2 5 0 8 0s5.6 1.2 7.5 3.1L14 4.6C12.5 3 10.4 2 8 2z" fill="currentColor" opacity="0.5"/>
                    <path d="M8 5.5C6.5 5.5 5.2 6.1 4.2 7L2.8 5.6C4 4.2 5.9 3.5 8 3.5s4 .7 5.2 2.1L11.8 7C10.8 6.1 9.5 5.5 8 5.5z" fill="currentColor" opacity="0.75"/>
                    <circle cx="8" cy="10.5" r="1.5" fill="currentColor"/>
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: -0.3 }}>100%</span>
                </div>
              </div>

              {/* Screens */}
              <div className="screen-content">
                <Routes>
                  <Route path="/" element={<WelcomeScreen />} />
                  <Route path="/onboarding" element={<OnboardingScreen />} />
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/otp" element={<OTPScreen />} />
                  <Route path="/name-setup" element={<NameSetupScreen />} />
                  <Route path="/home" element={<HomeScreen />} />
                  <Route path="/discovery" element={<DiscoveryScreen />} />
                  <Route path="/restaurant/:id" element={<RestaurantScreen />} />
                  <Route path="/cart" element={<CartScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/order-success" element={<OrderSuccessScreen />} />
                  <Route path="/order-tracking" element={<OrderTrackingScreen />} />
                  <Route path="/takeaway" element={<TakeawayScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/profile/edit" element={<EditProfileScreen />} />
                  <Route path="/top-food" element={<TopFoodScreen />} />
                  <Route path="/ai-recommend" element={<AIRecommendScreen />} />
                  <Route path="/order-history" element={<OrderHistoryScreen />} />
                  <Route path="/settings" element={<SettingsScreen />} />
                  <Route path="/cash-confirm" element={<CashConfirmScreen />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
