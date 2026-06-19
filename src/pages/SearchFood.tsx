import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { Search } from 'lucide-react';
import { categories, restaurants, menuItems } from '../data/mockData';

const SearchFood: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredItems = menuItems.filter(i => 
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white pb-20 overflow-y-auto scrollbar-hide">
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-3xl font-bold text-[#2C155F] mb-6">Search</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for food, restaurants..." 
            className="w-full bg-gray-100 rounded-xl py-4 pl-12 pr-4 text-gray-700 outline-none focus:ring-2 focus:ring-[#DD4E24]"
          />
        </div>

        {query ? (
            <div className="space-y-8">
                {filteredRestaurants.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-[#2C155F] mb-4">Restaurants</h2>
                        <div className="space-y-4">
                            {filteredRestaurants.map(r => (
                                <div 
                                    key={r.id}
                                    onClick={() => navigate(`/restaurant/${r.id}`)}
                                    className="flex items-center space-x-4 p-2 rounded-xl hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                        <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#2C155F]">{r.name}</h3>
                                        <p className="text-xs text-gray-500">{r.tags.join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {filteredItems.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-[#2C155F] mb-4">Items</h2>
                        <div className="space-y-4">
                            {filteredItems.map(item => (
                                <div 
                                    key={item.id}
                                    onClick={() => navigate(`/add-to-order/${item.id}`)}
                                    className="flex items-center space-x-4 p-2 rounded-xl hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#2C155F]">{item.name}</h3>
                                        <p className="text-xs text-gray-500">Rs {item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {filteredRestaurants.length === 0 && filteredItems.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        No results found for "{query}"
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#2C155F]">Top Categories</h2>
            <div className="grid grid-cols-2 gap-4">
                {categories.map(cat => (
                    <div 
                        key={cat.id}
                        className="relative h-32 rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => setQuery(cat.name)}
                    >
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{cat.name}</span>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default SearchFood;
