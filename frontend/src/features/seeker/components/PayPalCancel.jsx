import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PayPalCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any pending booking data
    localStorage.removeItem('pendingBooking');
    toast.error('Payment was cancelled');
  }, []);

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center">
      <div className="bg-black/80 rounded-xl p-8 max-w-md w-full mx-4 border border-orange-600">
        <div className="text-center mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h2>
          <p className="text-gray-300 mb-6">Your payment was cancelled and no charges were made.</p>
          
          <button
            onClick={() => navigate('/seeker/my-bookings')}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayPalCancel; 