import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { restaurants } from '../data/mockData';

const FeaturedPartners: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white pb-20 overflow-y-auto scrollbar-hide">
      <div className="flex flex-col space-y-3 px-6 pt-6">
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

      <BottomNav />
    </div>
  );
};

export default FeaturedPartners;
