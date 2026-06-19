import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/confirm');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-base font-bold text-center flex-1 mr-8 text-[#2C155F]">
          Smart Dine
        </h1>
      </div>

      <div className="flex-1 px-6 pt-10 flex flex-col">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#2C155F] mb-3">Welcome Back</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Enter your phone number to use Smart Dine and enjoy your food :)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
          <div className="space-y-2">
            <label className="text-gray-400 text-xs uppercase tracking-widest font-medium">
              Phone Number
            </label>
            <div className="flex items-center border-b-2 border-gray-200 pb-3">
              <span className="text-lg text-[#2C155F] font-medium mr-3">+61</span>
              <div className="w-px h-5 bg-gray-300 mr-3" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 text-base text-[#2C155F] placeholder-gray-300 outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[#DD4E24] text-white font-bold py-4 rounded-xl shadow-md uppercase tracking-widest text-sm"
            >
              SIGN UP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
