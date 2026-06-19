import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
    const timer = setTimeout(() => {
      navigate('/collect-meal');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate, clearCart]);

  return (
    <div className="flex flex-col h-full bg-white items-center justify-center px-6">
      {/* Cream info card */}
      <div className="bg-[#F8F4EE] rounded-3xl w-full p-8 flex flex-col items-center text-center mb-8">
        {/* Yellow checkmark circle */}
        <div className="w-16 h-16 rounded-full bg-[#FFBB4E] flex items-center justify-center mb-5">
          <Check className="w-8 h-8 text-white stroke-[3]" />
        </div>
        <h2 className="text-base font-bold text-[#2C155F] mb-3">
          You Place the Order Successfully
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-5">
          You placed the order successfully. You will get your food within 25 minutes. Thanks for using our services. Enjoy your food :)
        </p>
        <button
          onClick={() => navigate('/home')}
          className="text-[#DD4E24] font-bold text-xs uppercase tracking-widest"
        >
          KEEP BROWSING
        </button>
      </div>

      {/* Success heading */}
      <h1 className="text-2xl font-bold text-[#2C155F] mb-2">Order Successful!</h1>
      <p className="text-gray-500 text-sm text-center">Your order has been placed successfully.</p>
    </div>
  );
};

export default OrderSuccess;
