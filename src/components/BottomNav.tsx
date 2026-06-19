import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Bookmark, FileText, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 flex justify-between items-center pb-8 z-50">
      <button 
        onClick={() => navigate('/home')}
        className={`flex flex-col items-center space-y-1 ${isActive('/home') ? 'text-[#DD4E24]' : 'text-gray-400 hover:text-[#DD4E24]'} transition-colors`}
      >
        <Home className={`w-6 h-6 ${isActive('/home') ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      
      <button 
        onClick={() => navigate('/search')}
        className={`flex flex-col items-center space-y-1 ${isActive('/search') ? 'text-[#DD4E24]' : 'text-gray-400 hover:text-[#DD4E24]'} transition-colors`}
      >
        <Search className="w-6 h-6" />
        <span className="text-[10px] font-medium">Discovery</span>
      </button>
      
      <button 
        onClick={() => navigate('/cart')}
        className={`flex flex-col items-center space-y-1 ${isActive('/cart') ? 'text-[#DD4E24]' : 'text-gray-400 hover:text-[#DD4E24]'} transition-colors`}
      >
        <Bookmark className="w-6 h-6" />
        <span className="text-[10px] font-medium">Orders</span>
      </button>
      
      <button 
        onClick={() => navigate('/partners')}
        className={`flex flex-col items-center space-y-1 ${isActive('/partners') ? 'text-[#DD4E24]' : 'text-gray-400 hover:text-[#DD4E24]'} transition-colors`}
      >
        <FileText className="w-6 h-6" />
        <span className="text-[10px] font-medium">Top Food</span>
      </button>
      
      <button 
        onClick={() => navigate('/profile')}
        className={`flex flex-col items-center space-y-1 ${isActive('/profile') ? 'text-[#DD4E24]' : 'text-gray-400 hover:text-[#DD4E24]'} transition-colors`}
      >
        <User className={`w-6 h-6 ${isActive('/profile') ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;
