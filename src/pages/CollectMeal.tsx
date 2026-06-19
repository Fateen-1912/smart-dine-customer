import React from 'react';
import { useNavigate } from 'react-router-dom';
import collect from '../assets/images/collect_illustration.png';

const CollectMeal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#F8F4EE] px-8 pt-12 pb-10">
      {/* Large heading */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold text-[#2C155F] text-center leading-tight mb-10">
          Your Order<br />is Ready<br />for Take Away
        </h1>

        <div className="w-56 h-56 mb-10">
          <img src={collect} alt="Collect Meal" className="w-full h-full object-contain" />
        </div>

        <p className="text-[#2C155F] text-base font-medium text-center leading-snug">
          Please Collect Your Meal<br />From the Counter
        </p>
      </div>

      {/* Keep browsing link */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/home')}
          className="text-[#DD4E24] font-bold text-xs uppercase tracking-widest py-2"
        >
          KEEP BROWSING
        </button>
      </div>
    </div>
  );
};

export default CollectMeal;
