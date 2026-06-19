import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ConfirmPhone: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-xl font-bold text-center flex-1 mr-8 text-[#2C155F]">
          Login to Smart Dine
        </h1>
      </div>

      <div className="flex-1 px-6 pt-8 flex flex-col items-center">
        <div className="text-center mb-10 space-y-4">
          <h2 className="text-2xl font-bold text-[#2C155F]">Verify Phone Number</h2>
          <p className="text-gray-500 text-base px-4">
            Enter the 4-Digit code sent to you at +610489632578
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-8">
          <div className="flex justify-center space-x-4 w-full">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all
                  ${digit ? 'border-[#DD4E24] text-[#DD4E24] bg-white' : 'border-gray-200 bg-gray-50 text-gray-400'}
                  focus:border-[#DD4E24] focus:bg-white`}
              />
            ))}
          </div>

          <div className="w-full pt-6">
            <button
              type="submit"
              className="w-full bg-[#DD4E24] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#c44520] transition-colors uppercase tracking-wide"
            >
              Continue
            </button>
          </div>

          <div className="flex flex-col items-center space-y-2 pt-4">
            <p className="text-gray-400 text-sm">Didn't receive code?</p>
            <button type="button" className="text-[#DD4E24] font-medium text-sm">
              Resend Again.
            </button>
          </div>

          <p className="text-gray-400 text-xs text-center mt-auto pt-10 px-6">
            By Signing up you agree to our Terms Conditions & Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ConfirmPhone;