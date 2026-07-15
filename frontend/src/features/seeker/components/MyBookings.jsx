import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
// Add ArrowLeft to the imports at the top
import { Loader2, AlertCircle, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      console.log('Fetching bookings for user:', user.id);
      
      const response = await bookingApi.getSeekerBookings(user.id);
      console.log('Bookings API response:', response);
      
      if (!response) {
        throw new Error('No response from server');
      }

      if (Array.isArray(response)) {
        // If response is already an array, use it directly
        setBookings(response);
        return;
      }

      // Ensure response.data exists and is an array
      const bookingsData = response?.data || [];
      
      if (!Array.isArray(bookingsData)) {
        throw new Error('Invalid response format');
      }

      console.log('Raw bookings data:', bookingsData);
      
      // Remove duplicate bookings for the same property
      const uniqueBookings = bookingsData.reduce((acc, current) => {
        const exists = acc.find(item => item.propertyId === current.propertyId);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      console.log('Processed bookings:', uniqueBookings);
      
      setBookings(uniqueBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Failed to fetch bookings');
      toast.error(error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-500';
      case 'PENDING':
        return 'text-yellow-500';
      case 'CANCELLED':
        return 'text-red-500';
      case 'COMPLETED':
        return 'text-blue-500';
      case 'PAID':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5" />;
      case 'PENDING':
        return <Clock className="w-5 h-5" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5" />;
      case 'PAID':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getPaymentStatusDisplay = (booking) => {
    if (booking.paymentMethod === 'PAYPAL') {
      return booking.paymentStatus || 'PENDING';
    } else if (booking.paymentMethod === 'CASH') {
      return booking.status === 'PAID' ? 'PAID' : 'PENDING';
    }
    return booking.paymentStatus || 'N/A';
  };

  const getPaymentStatusColor = (booking) => {
    const status = getPaymentStatusDisplay(booking);
    switch (status) {
      case 'PAID':
        return 'text-green-500';
      case 'PENDING':
        return 'text-yellow-500';
      case 'FAILED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Add this component at the top level of your component
  const BackButton = () => (
    <div className="container mx-auto px-4 py-4">
      <button 
        onClick={() => navigate('/seeker-dashboard')}
        className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
        <span>Back to Dashboard</span>
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <BackButton />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <BackButton />
        <div className="flex items-center justify-center flex-1">
          <div className="text-red-500 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <BackButton />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Bookings Found</h2>
            <p className="text-gray-400">You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/seeker-dashboard/find-pg')}
              className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
            >
              Find a PG
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Remove the BackButton component and update all return statements to use a single structure
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/seeker-dashboard')}
            className="p-2 hover:bg-orange-500/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-orange-500" />
          </button>
          <h1 className="text-3xl font-bold text-white ml-4">My Bookings</h1>
        </div>

        <div className="min-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>{error}</p>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No Bookings Found</h2>
                <p className="text-gray-400">You haven't made any bookings yet.</p>
                <button
                  onClick={() => navigate('/seeker-dashboard/find-pg')}
                  className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
                >
                  Find a PG
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-black/80 rounded-xl overflow-hidden border border-orange-600"
                >
                  {/* Property Image */}
                  <div className="relative h-48">
                    <img
                      src={booking.property?.images?.[0] || '/placeholder-image.jpg'}
                      alt={booking.property?.name || 'Property'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="text-sm font-medium">{booking.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{booking.property?.name || 'Unnamed Property'}</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                      <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                      <p>Guests: {booking.numberOfGuests}</p>
                      <p>Total Amount: ₹{booking.totalAmount}</p>
                    </div>

                    {/* Owner Contact */}
                    <div className="mt-4 pt-4 border-t border-orange-600">
                      <h4 className="text-white font-medium mb-2">Owner Contact</h4>
                      <div className="space-y-1 text-gray-300">
                        <p>{booking.property?.ownerName || 'N/A'}</p>
                        <p>{booking.property?.ownerPhone || 'N/A'}</p>
                        <p>{booking.property?.ownerEmail || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mt-4 pt-4 border-t border-orange-600">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Payment Status:</span>
                        <span className={`font-medium ${getPaymentStatusColor(booking)}`}>
                          {getPaymentStatusDisplay(booking)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;