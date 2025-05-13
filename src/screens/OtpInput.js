import React, { useState, useRef, useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Toast disappears after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-2 right-2 sm:top-4 sm:right-4 px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow-lg text-white text-sm sm:text-base ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } border-2 border-transparent animate-border-pulse-${type}`}
    >
      <style>
        {`
          @keyframes pulse-success {
            0% { border-color: #3b82f6; } /* Blue */
            50% { border-color: #10b981; } /* Green */
            100% { border-color: #3b82f6; }
          }
          @keyframes pulse-error {
            0% { border-color: #ef4444; } /* Red */
            50% { border-color: #f97316; } /* Orange */
            100% { border-color: #ef4444; }
          }
          .animate-border-pulse-success {
            animation: pulse-success 2s infinite;
          }
          .animate-border-pulse-error {
            animation: pulse-error 2s infinite;
          }
        `}
      </style>
      {message}
    </div>
  );
};

const OtpInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1 || isNaN(value) || value === ' ') return; // Block space and non-digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input only if value is a non-empty digit and index < 5
    if (value && value !== ' ' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && /^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      console.log('OTP Submitted:', otpValue);
      setToast({ show: true, message: `OTP Submitted: ${otpValue}`, type: 'success' });
      setOtp(['', '', '', '', '', '']); // Clear OTP inputs
      inputRefs.current[0].focus(); // Focus first input
    } else {
      setToast({ show: true, message: 'Please enter a 6-digit OTP', type: 'error' });
    }
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  return (
    <div className="min-h-screen bg-orange-300 flex items-center justify-center">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Enter OTP</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-md hover:bg-blue-600 transition text-sm sm:text-base"
          >
            Submit OTP
          </button>
        </form>
      </div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
};

export default OtpInput;