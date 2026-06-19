import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { restaurants, menuItems, categories } from '../data/mockData';

const SingleRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <div className="flex flex-col h-full bg-white justify-center items-center">
        <p>Restaurant not found</p>
        <button onClick={() => navigate('/home')} className="text-[#DD4E24] mt-4">Go Home</button>
      </div>
    );
  }

  const restaurantItems = menuItems.filter(item => item.restaurantId === id);
  const filteredItems = activeCategory === 'all'
    ? restaurantItems
    : restaurantItems.filter(item => item.categoryId === activeCategory);

  const availableCategoryIds = Array.from(new Set(restaurantItems.map(item => item.categoryId)));
  const restaurantCategories = categories.filter(c => availableCategoryIds.includes(c.id));

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto scrollbar-hide">
      {/* Header with back button */}
      <div className="px-4 pt-12 pb-2 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="px-6 pb-8">
        {/* Restaurant name + description */}
        <h1 className="text-2xl font-bold text-[#2C155F] mb-2">{restaurant.name}</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-5">{restaurant.description}</p>

        {/* Stats row */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-1 text-gray-600 text-sm">
            <Star className="w-4 h-4 text-[#FFBB4E] fill-current" />
            <span className="font-medium">{restaurant.rating}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <span>⏱</span>
            <span>{restaurant.time}</span>
          </div>
          <div className="flex items-center space-x-1 text-[#4CAF50] text-sm font-medium">
            <span>🚗</span>
            <span>{restaurant.delivery}</span>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex overflow-x-auto space-x-2 pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#DD4E24] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          {restaurantCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#DD4E24] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-5">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/add-to-order/${item.id}`)}
                className="flex items-center space-x-4 cursor-pointer border-b border-gray-100 pb-5 last:border-0"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#2C155F] text-sm">{item.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-[#2C155F] text-sm">Rs {item.price}</span>
                    <button className="bg-gray-100 text-[#DD4E24] text-xs font-bold px-4 py-1.5 rounded-lg">
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              No items found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleRestaurant;
