import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, CreditCard, Mail, Home, AlertCircle, DollarSign } from 'lucide-react';
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
  const [isIndefinite, setIsIndefinite] = useState(false); // Indefinite monthly stay toggle
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

  if (!user) {
    return null;
  }

  // Convert DD/MM/YYYY to Date object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Auto-calculate check-out date exactly 30 days after check-in for monthly stays
  const calculateCheckOutDate = (checkInStr) => {
    if (!validateDateFormat(checkInStr)) return '';
    const checkInDate = parseDate(checkInStr);
    if (!checkInDate) return '';
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 30); // 30 days later
    
    const d = String(checkOutDate.getDate()).padStart(2, '0');
    const m = String(checkOutDate.getMonth() + 1).padStart(2, '0');
    const y = checkOutDate.getFullYear();
    return `${d}/${m}/${y}`;
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
    if (!dateString) return true;
    
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateString)) return false;

    const [_, day, month, year] = dateString.match(regex);
    const numDay = parseInt(day, 10);
    const numMonth = parseInt(month, 10);
    const numYear = parseInt(year, 10);

    if (numMonth < 1 || numMonth > 12) return false;
    if (numDay < 1 || numDay > 31) return false;
    if (numYear < 2024 || numYear > 2100) return false;

    const daysInMonth = new Date(numYear, numMonth, 0).getDate();
    if (numDay > daysInMonth) return false;

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For date fields, validate format and handle calculations
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
        
        // If indefinite stay is active, auto-calculate check-out date as 30 days after check-in
        let checkOutVal = formData.checkOutDate;
        if (name === 'checkInDate' && isIndefinite) {
          checkOutVal = calculateCheckOutDate(formatted);
        } else if (name === 'checkOutDate') {
          checkOutVal = formatted;
        }

        const newFormData = {
          ...formData,
          checkInDate: name === 'checkInDate' ? formatted : formData.checkInDate,
          checkOutDate: checkOutVal
        };
        setFormData(newFormData);

        // Check availability when both dates are valid
        if (validateDateFormat(newFormData.checkInDate) && validateDateFormat(newFormData.checkOutDate)) {
          fetchAvailableRooms(newFormData.checkInDate, newFormData.checkOutDate);
          const amounts = calculateAmounts(newFormData.checkInDate, newFormData.checkOutDate, formData.roomsToBook);
          setCalculatedAmount(amounts);
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

      const response = await bookingApi.createBooking(bookingData);
      console.log('Booking response:', response);
      
      if (!response || !response.data) {
        throw new Error('Invalid booking response');
      }

      const booking = response.data;
      console.log('Created booking:', booking);

      if (formData.paymentMethod === 'PAYPAL') {
        const pendingBookingData = {
          ...booking,
          propertyName: property.name,
          totalAmount: calculatedAmount.usd
        };
        localStorage.setItem('pendingBooking', JSON.stringify(pendingBookingData));
        
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

        window.location.href = paymentResponse.data.approvalUrl;
      } else {
        // For cash / direct payments, redirect immediately to bookings dashboard
        toast.success('Booking requested! Please pay the owner directly upon check-in.');
        setTimeout(() => {
          navigate('/seeker-dashboard/bookings');
        }, 1200);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create booking');
      toast.error(error.response?.data?.message || error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Scrollable Container Wrapper with max-height to fit all screen sizes */}
      <div className="bg-black/80 rounded-xl p-6 max-w-md w-full mx-4 border border-orange-600 max-h-[90vh] overflow-y-auto scrollbar-thin">
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

            {/* Indefinite Stay Toggle */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isIndefinite"
                checked={isIndefinite}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsIndefinite(checked);
                  if (checked && formData.checkInDate) {
                    const checkOutVal = calculateCheckOutDate(formData.checkInDate);
                    setFormData(prev => ({
                      ...prev,
                      checkOutDate: checkOutVal
                    }));
                    if (validateDateFormat(formData.checkInDate) && validateDateFormat(checkOutVal)) {
                      fetchAvailableRooms(formData.checkInDate, checkOutVal);
                      const amounts = calculateAmounts(formData.checkInDate, checkOutVal, formData.roomsToBook);
                      setCalculatedAmount(amounts);
                    }
                  }
                }}
                className="w-4 h-4 accent-orange-500 border-zinc-800 rounded bg-zinc-900 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="isIndefinite" className="text-xs text-zinc-300 cursor-pointer select-none">
                I don't have a check-out date (Stay indefinitely / Pay monthly)
              </label>
            </div>
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
                className={`w-full pl-10 pr-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${isIndefinite ? 'bg-zinc-900/50 cursor-not-allowed opacity-70' : ''}`}
                required
                disabled={isIndefinite}
                pattern="\d{2}/\d{2}/\d{4}"
                maxLength="10"
              />
            </div>
            {isIndefinite && (
              <p className="text-xxs text-orange-400 mt-1 leading-normal">
                Monthly Stay enabled. First month's security deposit covers your initial 30 days. You will pay rent directly to the owner each month.
              </p>
            )}
            {formData.checkOutDate && !validateDateFormat(formData.checkOutDate) && !isIndefinite && (
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

          {/* Email */}
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

          {/* Payment Method - PayPal and Cash / Pay to Owner */}
          <div>
            <label className="block text-white mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('PAYPAL')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-semibold transition-all ${
                  formData.paymentMethod === 'PAYPAL' 
                    ? 'bg-orange-600 border-orange-600 text-white' 
                    : 'bg-black/50 border-zinc-800 text-gray-400 hover:border-orange-500/50 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                PayPal
              </button>
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('CASH')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-semibold transition-all ${
                  formData.paymentMethod === 'CASH' 
                    ? 'bg-orange-600 border-orange-600 text-white' 
                    : 'bg-black/50 border-zinc-800 text-gray-400 hover:border-orange-500/50 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Pay Owner
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
            <div className="text-white text-xs space-y-1 pt-2 border-t border-zinc-800/80">
              <p>Price per room per month: ₹{property.rent.toLocaleString()}</p>
              {calculatedAmount.inr > 0 && (
                <p className="font-semibold text-orange-400">
                  Initial Booking Total: ₹{calculatedAmount.inr.toLocaleString()} {formData.paymentMethod === 'PAYPAL' ? `($${calculatedAmount.usd})` : ''} ({calculatedAmount.days} days)
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || calculatedAmount.inr <= 0 || formData.roomsToBook > availableRooms || availableRooms === 0}
            className="w-full px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/10 text-xs tracking-wider uppercase"
          >
            {loading ? 'Processing...' : 
             availableRooms === 0 ? 'No Rooms Available' :
             calculatedAmount.inr > 0 
               ? `Confirm Booking` 
               : 'Select dates to see amount'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;