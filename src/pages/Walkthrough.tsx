import React from 'react';
import { useNavigate } from 'react-router-dom';
import illustration from '../assets/images/walkthrough_illustration.png';

const Walkthrough: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full bg-[#F8F4EE] flex flex-col px-6 pt-10 pb-10">
      {/* Illustration */}
      <div className="w-[260px] h-[260px] mx-auto">
        <img
          src={illustration}
          alt="Choose your food"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/300x300/orange/white?text=Food';
          }}
        />
      </div>

      {/* Text */}
      <div className="text-center mt-4 px-2">
        <h1 className="text-[32px] font-extrabold text-[#2C155F] leading-tight">
          Choose your food
        </h1>
        <p className="text-[#6B7280] text-[15px] leading-relaxed mt-3 px-4">
          Easily find your type of food craving and you'll get delivery in wide range.
        </p>
      </div>

      {/* Spacer pushes button to bottom */}
      <div className="flex-1" />

      {/* Button pinned to bottom */}
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-[#E85A2A] text-white text-sm font-bold py-5 rounded-[24px] shadow-lg uppercase tracking-[0.2em] active:scale-95 transition-transform"
      >
        Get Started
      </button>
    </div>
  );
};

export default Walkthrough;