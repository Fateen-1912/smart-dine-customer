import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import headerBg from '../assets/images/home_header_bg.png';
import { restaurants } from '../data/mockData';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const bestPicks = restaurants.filter(r => r.isFeatured);

  return (
    <div className="flex flex-col h-full bg-white pb-20 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex justify-between items-end">
        <div className="flex flex-col space-y-0.5">
          <span className="text-[#4D6C43] text-xs font-medium">Delivery to</span>
          <div className="flex items-center space-x-1">
            <span className="text-[#DD4E24] text-sm font-bold">HayStreet, Perth</span>
            <span className="text-[#DD4E24] text-xs">▼</span>
          </div>
        </div>
        <button className="text-[#DD4E24] text-sm font-medium">Filter</button>
      </div>

      {/* Hero Banner */}
      <div className="px-6 mb-6" onClick={() => navigate('/restaurant/1')}>
        <div className="w-full h-44 rounded-2xl overflow-hidden shadow-md cursor-pointer">
          <img src={headerBg} alt="Featured Food" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Best Picks Section */}
      <div className="mb-6">
        <div className="px-6 flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-[#2C155F]">Best Picks Restaurants by team</h2>
          <button onClick={() => navigate('/partners')} className="text-[#DD4E24] text-xs font-medium">See all</button>
        </div>

        <div className="flex overflow-x-auto px-6 space-x-3 pb-2 scrollbar-hide">
          {bestPicks.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="flex-shrink-0 w-56 h-56 rounded-xl overflow-hidden shadow-sm cursor-pointer relative"
            >
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              {/* Rating badge */}
              <div className="absolute top-2 right-2 bg-[#4CAF50] text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center space-x-0.5">
                <span>{restaurant.rating}</span>
                <span>★</span>
              </div>
              {/* Bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <h3 className="text-white font-bold text-sm">{restaurant.name}</h3>
                <p className="text-white/80 text-[10px] mt-0.5">{restaurant.tags.slice(1).join(' • ')}</p>
                <p className="text-white/60 text-[10px] mt-0.5">{restaurant.delivery}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Restaurants Section */}
      <div className="px-6 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-[#2C155F]">All Restaurants</h2>
          <button onClick={() => navigate('/search')} className="text-[#DD4E24] text-xs font-medium">See all</button>
        </div>

        <div className="flex flex-col space-y-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="flex bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer border border-gray-100"
            >
              {/* Image */}
              <div className="w-28 h-28 relative shrink-0">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-1.5 right-1 bg-white/90 px-1.5 py-0.5 rounded text-[9px] font-semibold text-gray-700">
                  {restaurant.time}
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 p-3 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#2C155F] text-sm">{restaurant.name}</h3>
                  <span className="bg-[#4CAF50] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {restaurant.rating} ★
                  </span>
                </div>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  {restaurant.priceRange} • {restaurant.tags.slice(1).join(' • ')}
                </p>
                <div className="flex items-center text-gray-400 text-[11px] mt-1 space-x-1">
                  <span>★ {restaurant.rating}</span>
                  <span>•</span>
                  <span>{restaurant.reviewCount}</span>
                </div>
                <p className="text-gray-400 text-[11px] mt-0.5">{restaurant.delivery}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
