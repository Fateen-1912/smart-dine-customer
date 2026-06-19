import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Check } from 'lucide-react';
import { menuItems } from '../data/mockData';
import { useCartStore } from '../store/cartStore';

const AddToOrder: React.FC = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(state => state.addToCart);

  // Mock options for customization
  const topCookieOptions = [
    { id: 'choc-chip', name: 'Chocolate Chip', price: 0 },
    { id: 'cookies-cream', name: 'Cookies and Cream', price: 0 },
    { id: 'funfetti', name: 'Funfetti', price: 0 },
  ];

  const bottomCookieOptions = [
    { id: 'choc-chip', name: 'Chocolate Chip', price: 0 },
    { id: 'cookies-cream', name: 'Cookies and Cream', price: 0 },
    { id: 'funfetti', name: 'Funfetti', price: 0 },
  ];

  const [selectedTopCookie, setSelectedTopCookie] = useState(topCookieOptions[0].id);
  const [selectedBottomCookie, setSelectedBottomCookie] = useState(bottomCookieOptions[0].id);

  const item = menuItems.find(i => i.id === itemId);

  if (!item) {
    return (
        <div className="flex flex-col h-full bg-white justify-center items-center">
            <p>Item not found</p>
            <button onClick={() => navigate(-1)} className="text-[#DD4E24] mt-4">Go Back</button>
        </div>
    );
  }

  const handleAddToCart = () => {
    // In a real app, we would pass the selected options to the cart
    // For now, we just add the base item as per existing store logic
    addToCart(item, quantity);
    navigate('/cart');
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto scrollbar-hide relative">
      <div className="relative h-72 w-full shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-12 left-4 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="px-6 pt-6 pb-32 space-y-6">
        <h1 className="text-2xl font-bold text-[#2C155F]">{item.name}</h1>
        <p className="text-gray-500 leading-relaxed">
           {item.description}
        </p>

        {/* Functional Customizations */}
        <div className="space-y-4">
           <h3 className="font-bold text-[#2C155F]">Choice of Top Cookie</h3>
           <div className="space-y-2">
             {topCookieOptions.map((option) => (
               <label key={option.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-colors">
                 <div className="flex items-center space-x-3">
                   <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedTopCookie === option.id ? 'border-[#DD4E24] bg-[#DD4E24]' : 'border-gray-300'}`}>
                     {selectedTopCookie === option.id && <Check className="w-3 h-3 text-white" />}
                   </div>
                   <span className="text-gray-700 font-medium">{option.name}</span>
                 </div>
                 <input 
                   type="radio" 
                   name="topCookie" 
                   value={option.id} 
                   checked={selectedTopCookie === option.id}
                   onChange={() => setSelectedTopCookie(option.id)}
                   className="hidden"
                 />
               </label>
             ))}
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="font-bold text-[#2C155F]">Choice of Bottom Cookie</h3>
           <div className="space-y-2">
             {bottomCookieOptions.map((option) => (
               <label key={option.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-colors">
                 <div className="flex items-center space-x-3">
                   <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedBottomCookie === option.id ? 'border-[#DD4E24] bg-[#DD4E24]' : 'border-gray-300'}`}>
                     {selectedBottomCookie === option.id && <Check className="w-3 h-3 text-white" />}
                   </div>
                   <span className="text-gray-700 font-medium">{option.name}</span>
                 </div>
                 <input 
                   type="radio" 
                   name="bottomCookie" 
                   value={option.id} 
                   checked={selectedBottomCookie === option.id}
                   onChange={() => setSelectedBottomCookie(option.id)}
                   className="hidden"
                 />
               </label>
             ))}
           </div>
        </div>

        <div className="flex justify-between items-center pt-4">
           <div className="flex items-center space-x-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-[#DD4E24] text-white flex items-center justify-center hover:bg-[#c03d1b]"
              >
                <Plus className="w-4 h-4" />
              </button>
           </div>
           <span className="text-2xl font-bold text-[#2C155F]">Rs {item.price * quantity}</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 max-w-[375px] mx-auto">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-[#DD4E24] text-white font-bold py-4 rounded-xl shadow-lg uppercase tracking-wide"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default AddToOrder;
<div className="container-mobile"></div>