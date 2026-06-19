import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { ChevronLeft, User, Mail, Phone, MapPin, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white pb-20 overflow-y-auto scrollbar-hide">
      <div className="px-4 pt-12 pb-4 flex items-center mb-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-xl font-bold text-center flex-1 mr-8 text-[#2C155F]">
          Profile
        </h1>
      </div>

      <div className="px-6 pt-4 flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#2C155F]">John Doe</h2>
        <p className="text-gray-500">john.doe@example.com</p>
      </div>

      <div className="px-6 mt-8 space-y-6">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <User className="text-[#DD4E24]" />
            <div className="flex-1">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-bold text-[#2C155F]">John Doe</p>
            </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <Mail className="text-[#DD4E24]" />
            <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-bold text-[#2C155F]">john.doe@example.com</p>
            </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <Phone className="text-[#DD4E24]" />
            <div className="flex-1">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-bold text-[#2C155F]">+61 123 456 789</p>
            </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <MapPin className="text-[#DD4E24]" />
            <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-bold text-[#2C155F]">HayStreet, Perth</p>
            </div>
        </div>

        <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 text-red-500 font-bold py-4 mt-8"
        >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
