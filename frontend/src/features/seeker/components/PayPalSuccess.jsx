import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { bookingApi } from '../../../services/api';
import { toast } from 'react-hot-toast';

const PayPalSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const processPayment = async () => {
    try {
      // Get payment details from URL
      const paymentId = searchParams.get('paymentId');
      const PayerID = searchParams.get('PayerID');

      if (!paymentId || !PayerID) {
        throw new Error('Missing payment information from PayPal');
      }

      // Get booking details from localStorage
      const pendingBookingStr = localStorage.getItem('pendingBooking');
      console.log('Retrieved pending booking from localStorage:', pendingBookingStr);
      
      if (!pendingBookingStr) {
        throw new Error('No pending booking found in localStorage');
      }

      const pendingBooking = JSON.parse(pendingBookingStr);
      if (!pendingBooking || !pendingBooking.id) {
        throw new Error('Invalid pending booking data');
      }

      console.log('Processing payment with:', { paymentId, PayerID, pendingBooking });

      // Execute PayPal payment
      const paymentResult = await bookingApi.executePayPalPayment(paymentId, PayerID);
      console.log('Payment execution result:', paymentResult);

      if (paymentResult.state !== 'approved') {
        throw new Error('Payment was not approved by PayPal');
      }

      // Update booking status to CONFIRMED
      const bookingUpdateResult = await bookingApi.updateBookingStatus(pendingBooking.id, 'CONFIRMED');
      console.log('Booking status update result:', bookingUpdateResult);

      // Create receipt data
      setReceipt({
        bookingId: pendingBooking.id,
        propertyName: pendingBooking.propertyName,
        checkInDate: new Date(pendingBooking.checkInDate).toLocaleDateString(),
        checkOutDate: new Date(pendingBooking.checkOutDate).toLocaleDateString(),
        numberOfGuests: pendingBooking.numberOfGuests,
        totalAmount: pendingBooking.totalAmount,
        paymentId: paymentId,
        paymentDate: new Date().toLocaleDateString(),
        paymentMethod: 'PayPal'
      });

      // Clear pending booking from localStorage
      localStorage.removeItem('pendingBooking');
      
      toast.success('Payment successful! Your booking is confirmed.');
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error.message || 'Failed to process payment');
      toast.error(error.message || 'Failed to process payment');
      
      // Redirect to booking page after error
      setTimeout(() => {
        navigate('/seeker-dashboard/bookings');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    processPayment();
  }, []);

  const handleDownloadReceipt = () => {
    // Create receipt content
    const receiptContent = `
      BOOKING RECEIPT
      ------------------------------
      Booking ID: ${receipt.bookingId}
      Property: ${receipt.propertyName}
      Check-in: ${receipt.checkInDate}
      Check-out: ${receipt.checkOutDate}
      Guests: ${receipt.numberOfGuests}
      Total Amount: $${receipt.totalAmount}
      Payment ID: ${receipt.paymentId}
      Payment Date: ${receipt.paymentDate}
      Payment Method: ${receipt.paymentMethod}
      ------------------------------
      Thank you for your booking!
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${receipt.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600 mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center">
        <div className="bg-black/80 rounded-xl p-8 max-w-md w-full mx-4 border border-red-600">
          <div className="text-red-500 text-center mb-6">
            <div className="text-xl font-bold mb-2">Payment Failed</div>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate('/seeker-dashboard/bookings')}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 inline-block mr-2" />
            Return to My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (receipt) {
    return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center p-4">
        <div className="bg-black/80 rounded-xl p-8 max-w-md w-full mx-4 border border-orange-600">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-300">Your booking has been confirmed.</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="border-t border-b border-orange-600/30 py-4 space-y-3">
              <div className="flex justify-between text-white">
                <span>Booking ID:</span>
                <span className="font-mono">{receipt.bookingId}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Property:</span>
                <span>{receipt.propertyName}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Check-in:</span>
                <span>{receipt.checkInDate}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Check-out:</span>
                <span>{receipt.checkOutDate}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Guests:</span>
                <span>{receipt.numberOfGuests}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Total Amount:</span>
                <span>${receipt.totalAmount}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Payment ID:</span>
                <span className="font-mono">{receipt.paymentId}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Payment Date:</span>
                <span>{receipt.paymentDate}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Payment Method:</span>
                <span>{receipt.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownloadReceipt}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
            
            <button
              onClick={() => navigate('/seeker-dashboard/bookings')}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PayPalSuccess; 