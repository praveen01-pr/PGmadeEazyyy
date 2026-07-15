import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, CreditCard, Mail, Home, AlertCircle } from 'lucide-react';
import { bookingApi } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const BookingForm = ({ property, onClose }) => {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    roomsToBook: 1,
    paymentMethod: 'PAYPAL'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calculatedAmount, setCalculatedAmount] = useState({ inr: 0, usd: 0, days: 0 });
  const [availableRooms, setAvailableRooms] = useState(property.rooms);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Function to fetch available rooms
  const fetchAvailableRooms = async (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return;

    try {
      const response = await bookingApi.getAvailableRooms(
        property.id,
        formatDateForAPI(checkIn),
        formatDateForAPI(checkOut)
      );

      if (response.data) {
        setAvailableRooms(response.data.availableRooms);
        
        // If selected rooms is more than available, adjust it
        if (formData.roomsToBook > response.data.availableRooms) {
          setFormData(prev => ({
            ...prev,
            roomsToBook: response.data.availableRooms
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      toast.error('Failed to check room availability');
    }
  };

  // Ensure user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Remove the direct navigation check
  if (!user) {
    return null;
  }

  // Convert DD/MM/YYYY to Date object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Calculate amounts with DD/MM/YYYY format
  const calculateAmounts = (checkIn, checkOut, rooms = formData.roomsToBook) => {
    console.log('Calculating amounts with:', { 
      checkIn, 
      checkOut, 
      price: property?.rent,
      propertyName: property?.name 
    });
    
    if (!checkIn || !checkOut || !rooms) {
      console.log('Missing dates or rooms for calculation');
      return { inr: 0, usd: 0, days: 0 };
    }

    if (!property?.rent) {
      console.error('Property rent is not available:', property);
      return { inr: 0, usd: 0, days: 0 };
    }

    try {
      const checkInDate = parseDate(checkIn);
      const checkOutDate = parseDate(checkOut);
      
      if (!checkInDate || !checkOutDate) {
        console.log('Invalid date format');
        return { inr: 0, usd: 0, days: 0 };
      }

      // Validate year is reasonable (between 2024 and 2100)
      const year = checkInDate.getFullYear();
      if (year < 2024 || year > 2100) {
        console.log('Invalid year in dates');
        return { inr: 0, usd: 0, days: 0 };
      }
      
      if (checkOutDate <= checkInDate) {
        console.log('Check-out date must be after check-in date');
        return { inr: 0, usd: 0, days: 0 };
      }

      const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const totalInr = days * property.rent * rooms;
      const USD_CONVERSION_RATE = 0.012;
      const totalUsd = Number((totalInr * USD_CONVERSION_RATE).toFixed(2));

      const result = {
        inr: totalInr,
        usd: totalUsd,
        days: days
      };
      
      console.log('Calculation result:', result);
      return result;
    } catch (error) {
      console.error('Error calculating amounts:', error);
      return { inr: 0, usd: 0, days: 0 };
    }
  };

  const validateDateFormat = (dateString) => {
    if (!dateString) return true; // Empty is valid, will be caught by required field
    
    // Check format DD/MM/YYYY
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateString)) return false;

    const [_, day, month, year] = dateString.match(regex);
    const numDay = parseInt(day, 10);
    const numMonth = parseInt(month, 10);
    const numYear = parseInt(year, 10);

    // Basic validation
    if (numMonth < 1 || numMonth > 12) return false;
    if (numDay < 1 || numDay > 31) return false;
    if (numYear < 2024 || numYear > 2100) return false;

    // Check valid day for month
    const daysInMonth = new Date(numYear, numMonth, 0).getDate();
    if (numDay > daysInMonth) return false;

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For date fields, validate format
    if ((name === 'checkInDate' || name === 'checkOutDate')) {
      if (!value || value.length < formData[name].length) {
        const newFormData = {
          ...formData,
          [name]: value
        };
        setFormData(newFormData);
        return;
      }

      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 8) {
        let formatted = cleaned;
        if (cleaned.length > 4) {
          formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
        } else if (cleaned.length > 2) {
          formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        }
        
        const newFormData = {
          ...formData,
          [name]: formatted
        };
        setFormData(newFormData);

        // Check availability when both dates are valid
        if (validateDateFormat(formatted)) {
          const checkInDate = name === 'checkInDate' ? formatted : formData.checkInDate;
          const checkOutDate = name === 'checkOutDate' ? formatted : formData.checkOutDate;
          
          if (validateDateFormat(checkInDate) && validateDateFormat(checkOutDate)) {
            fetchAvailableRooms(checkInDate, checkOutDate);
            const amounts = calculateAmounts(checkInDate, checkOutDate, formData.roomsToBook);
            setCalculatedAmount(amounts);
          }
        }
      }
      return;
    }

    // Handle non-date fields
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);

    // Recalculate amounts if changing roomsToBook
    if (name === 'roomsToBook') {
      const amounts = calculateAmounts(
        formData.checkInDate,
        formData.checkOutDate,
        value
      );
      setCalculatedAmount(amounts);
    }
  };

  // Function to format date for API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handlePaymentMethodChange = (method) => {
    const newFormData = {
      ...formData,
      paymentMethod: method
    };
    setFormData(newFormData);
    
    // Recalculate amounts with current dates
    const amounts = calculateAmounts(
      newFormData.checkInDate,
      newFormData.checkOutDate,
      newFormData.roomsToBook
    );
    setCalculatedAmount(amounts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (calculatedAmount.inr <= 0) {
        throw new Error("Invalid dates selected");
      }

      // Create booking data with formatted dates and seeker's email
      const bookingData = {
        propertyId: property.id,
        seekerId: user.id,
        email: user.email,
        checkInDate: formatDateForAPI(formData.checkInDate),
        checkOutDate: formatDateForAPI(formData.checkOutDate),
        numberOfGuests: formData.numberOfGuests,
        roomsToBook: formData.roomsToBook,
        totalAmount: calculatedAmount.inr,
        paymentMethod: formData.paymentMethod,
        status: formData.paymentMethod === 'CASH' ? 'PENDING' : 'CONFIRMED',
        paymentStatus: formData.paymentMethod === 'CASH' ? 'PENDING' : 'PAID'
      };

      console.log('Sending booking data:', bookingData);

      // Create booking
      const response = await bookingApi.createBooking(bookingData);
      console.log('Booking response:', response);
      
      if (!response || !response.data) {
        throw new Error('Invalid booking response');
      }

      const booking = response.data;
      console.log('Created booking:', booking);

      if (formData.paymentMethod === 'PAYPAL') {
        // Store booking data for PayPal success page
        const pendingBookingData = {
          ...booking,
          propertyName: property.name,
          totalAmount: calculatedAmount.usd
        };
        localStorage.setItem('pendingBooking', JSON.stringify(pendingBookingData));
        
        // Create PayPal payment (in USD)
        const paymentResponse = await bookingApi.createPayPalPayment({
          bookingId: booking.id,
          amount: calculatedAmount.usd,
          currency: 'USD',
          description: `Booking for ${property.name} (${calculatedAmount.days} days)`,
          returnUrl: `${window.location.origin}/seeker/paypal-success`,
          cancelUrl: `${window.location.origin}/seeker/paypal-cancel`
        });

        if (!paymentResponse || !paymentResponse.data || !paymentResponse.data.approvalUrl) {
          throw new Error('Invalid PayPal payment response');
        }

        // Use window.location.href instead of navigate for PayPal redirect
        window.location.href = paymentResponse.data.approvalUrl;
      } else {
        // For cash payments, update booking status to PAID
        await bookingApi.updateBookingStatus(booking.id, 'PAID');
        
        // Show success message and use setTimeout for navigation
        toast.success('Booking created successfully! Please complete the payment to confirm your booking.');
        setTimeout(() => {
          navigate('/seeker/my-bookings');
        }, 1000);
      }
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || error.message || 'Failed to create booking');
      toast.error(error.response?.data?.message || error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="bg-black/80 rounded-xl p-6 max-w-md w-full mx-4 border border-orange-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Book {property.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-orange-600/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Availability Information */}
          <div className="bg-orange-600/10 border border-orange-600 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-orange-500" />
              <h3 className="text-white font-semibold">Room Availability</h3>
            </div>
            {formData.checkInDate && formData.checkOutDate && validateDateFormat(formData.checkInDate) && validateDateFormat(formData.checkOutDate) ? (
              <div>
                <p className="text-gray-300 text-sm">
                  {availableRooms} out of {property.rooms} rooms available for selected dates
                </p>
                {availableRooms === 0 && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>No rooms available for these dates</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-300 text-sm">
                Select dates to check room availability
              </p>
            )}
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-white mb-2">Number of Rooms to Book</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="roomsToBook"
                value={formData.roomsToBook}
                onChange={handleInputChange}
                min="1"
                max={availableRooms}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            {formData.roomsToBook > availableRooms && (
              <div className="text-red-500 text-sm mt-1">
                Cannot book more rooms than available
              </div>
            )}
          </div>

          {/* Check-in Date */}
          <div>
            <label className="block text-white mb-2">Check-in Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                placeholder="DD/MM/YYYY"
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                pattern="\d{2}/\d{2}/\d{4}"
                maxLength="10"
              />
            </div>
            {formData.checkInDate && !validateDateFormat(formData.checkInDate) && (
              <div className="text-red-500 text-sm mt-1">
                Please enter a valid date in DD/MM/YYYY format
              </div>
            )}
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-white mb-2">Check-out Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                placeholder="DD/MM/YYYY"
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                pattern="\d{2}/\d{2}/\d{4}"
                maxLength="10"
              />
            </div>
            {formData.checkOutDate && !validateDateFormat(formData.checkOutDate) && (
              <div className="text-red-500 text-sm mt-1">
                Please enter a valid date in DD/MM/YYYY format
              </div>
            )}
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-white mb-2">Number of Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                min="1"
                max={property.capacity}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-white mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-orange-600 rounded-lg text-gray-300 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Payment Method - Only PayPal */}
          <div>
            <label className="block text-white mb-2">Payment Method</label>
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('PAYPAL')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${formData.paymentMethod === 'PAYPAL' ? 'bg-orange-600' : 'bg-black/50'} border-orange-600 text-white`}
              >
                <CreditCard className="w-5 h-5" />
                PayPal
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          {/* Price Display */}
          {property?.rent && (
            <div className="text-white text-sm space-y-1">
              <p>Price per room per night: ₹{property.rent.toLocaleString()}</p>
              {calculatedAmount.inr > 0 && (
                <p>Total for {formData.roomsToBook} room(s) for {calculatedAmount.days} night(s):</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || calculatedAmount.inr <= 0 || formData.roomsToBook > availableRooms || availableRooms === 0}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 
             availableRooms === 0 ? 'No Rooms Available' :
             calculatedAmount.inr > 0 
               ? `Confirm Booking (₹${calculatedAmount.inr.toLocaleString()} / $${calculatedAmount.usd})` 
               : 'Select dates to see amount'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;