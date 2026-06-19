import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotal } = useCartStore();

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-lg font-bold text-center flex-1 mr-8 text-[#2C155F]">
          Your Orders
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-40 scrollbar-hide">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/home')}
              className="text-[#DD4E24] font-bold"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map(item => (
              <div key={item.id} className="flex items-center space-x-4 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#2C155F] text-sm">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400 ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Rs {item.price}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 text-gray-500" />
                      </button>
                      <span className="font-bold text-sm text-[#2C155F] w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#DD4E24] text-white flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-[#2C155F] text-sm">Rs {item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-gray-500 text-sm">
              <span>Subtotal</span>
              <span>Rs {getTotal()}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 text-sm">
              <span>Delivery</span>
              <span className="text-[#4CAF50] font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-base font-bold text-[#2C155F]">Total</span>
              <span className="text-xl font-bold text-[#2C155F]">Rs {getTotal()}</span>
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
          <button
            onClick={() => navigate('/payment')}
            className="w-full bg-[#DD4E24] text-white font-bold py-4 rounded-xl shadow-lg uppercase tracking-widest text-sm"
          >
            CHECKOUT
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
