import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from '../assets/images/welcome_bg.png';
import logo from '../assets/images/welcome_logo.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/walkthrough');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="h-full w-full bg-cover bg-center flex flex-col items-center justify-center relative px-8 text-center"
      style={{ backgroundImage: `url(${bg})` }}
      onClick={() => navigate('/walkthrough')}
    >
      {/* Circle Background - Decorative */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FFBB4E] rounded-full opacity-10 pointer-events-none"></div>

      {/* Logo */}
      <div className="mb-12 relative z-10">
        <img src={logo} alt="Logo" className="w-64 h-64 object-cover rounded-full shadow-lg" />
      </div>

      {/* Text */}
      <div className="relative z-10 space-y-6 max-w-xs mx-auto">
        <h1 className="text-[28px] font-bold text-[#3A3A3A] font-sans">
          Welcome
        </h1>
        <p className="text-base text-[#3A3A3A] font-sans leading-relaxed">
          It’s a pleasure to meet you. We are excited that you’re here so let’s get started!
        </p>
      </div>
    </div>
  );
};

export default Welcome;
