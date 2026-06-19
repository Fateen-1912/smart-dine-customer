import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Calendar, Banknote } from 'lucide-react';

const AddPayment: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const handlePlaceOrder = () => {
    navigate('/order-success');
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-lg font-bold text-center flex-1 mr-8 text-[#2C155F]">
          Add Payment Method
        </h1>
      </div>

      <div className="flex-1 px-6 pt-4 overflow-y-auto pb-32 scrollbar-hide">
        <p className="text-gray-500 text-sm text-center mb-6">
          Select your payment method to complete the purchase.
        </p>

        {/* Payment Method Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 py-5 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${
              paymentMethod === 'card'
                ? 'border-[#DD4E24] bg-orange-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#DD4E24]' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-[#DD4E24]' : 'text-gray-500'}`}>
              Credit Card
            </span>
          </button>
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`flex-1 py-5 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${
              paymentMethod === 'cash'
                ? 'border-[#DD4E24] bg-orange-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <Banknote className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-[#DD4E24]' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-[#DD4E24]' : 'text-gray-500'}`}>
              Cash
            </span>
          </button>
        </div>

        {paymentMethod === 'card' ? (
          <div className="space-y-4">
            {/* Card Number */}
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 space-x-3 bg-white">
              <input
                type="text"
                placeholder="Card Number"
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300"
              />
            </div>
            {/* MM / CVC */}
            <div className="flex space-x-4">
              <div className="flex-1 flex items-center border border-gray-200 rounded-xl px-4 py-3 space-x-3 bg-white">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="MM/"
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 w-full"
                />
              </div>
              <div className="flex-1 flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-white">
                <input
                  type="text"
                  placeholder="CVC"
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 w-full"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
              <Banknote className="w-10 h-10 text-[#DD4E24]" />
            </div>
            <h3 className="text-lg font-bold text-[#2C155F]">Cash Payment</h3>
            <p className="text-gray-500 text-sm">
              Please pay at the counter to confirm your order.
            </p>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-[#DD4E24] text-white font-bold py-4 rounded-xl shadow-lg uppercase tracking-widest text-sm"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
};

export default AddPayment;
