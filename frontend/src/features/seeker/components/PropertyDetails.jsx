import React, { useState, useEffect } from 'react';
import { X, MapPin, Users, DollarSign, Building, Phone, Mail, Clock, User, Home, Calendar, Shield, Wifi, Utensils, Dumbbell, ParkingCircle, Shirt, Tv, AirVent, Key, Waves, Lock, CheckCircle, ChevronLeft, ChevronRight, Star, MessageSquare } from 'lucide-react';
import BookingForm from './BookingForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { reviewApi } from '../../../services/api';
import { toast } from 'react-hot-toast';

const PropertyDetails = ({ property, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (property?.id) {
      fetchReviews();
    }
  }, [property]);

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const data = await reviewApi.getReviews(property.id);
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    try {
      setSubmittingReview(true);
      const reviewData = {
        seekerId: user.id,
        seekerName: user.name,
        rating,
        comment: comment.trim()
      };
      const newReview = await reviewApi.createReview(property.id, reviewData);
      setReviews(prev => [newReview, ...prev]);
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleChatWithOwner = () => {
    if (!user) {
      toast.error('Please login to message the owner');
      navigate('/login');
      return;
    }
    const params = new URLSearchParams({
      propertyId: property.id,
      propertyName: property.name,
      providerId: property.ownerId || '',
      providerName: property.ownerName || 'Owner'
    });
    onClose();
    navigate(`/seeker-dashboard/messages?${params.toString()}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    navigate('/seeker-dashboard/bookings');
  };

  const amenities = {
    'Wi-Fi': <Wifi className="w-5 h-5" />,
    'Food': <Utensils className="w-5 h-5" />,
    'Gym': <Dumbbell className="w-5 h-5" />,
    'Parking': <ParkingCircle className="w-5 h-5" />,
    'Laundry': <Shirt className="w-5 h-5" />,
    'TV': <Tv className="w-5 h-5" />,
    'AC': <AirVent className="w-5 h-5" />,
    'Security': <Lock className="w-5 h-5" />,
    'Swimming Pool': <Waves className="w-5 h-5" />
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black/80 rounded-xl overflow-hidden border border-orange-600">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-orange-600">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {property.name}
                {reviews.length > 0 && (
                  <span className="text-sm font-semibold px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                )}
              </h2>
              <p className="text-gray-400 text-sm">ID: {property.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-orange-600/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image Carousel */}
          <div className="relative h-[400px]">
            <img
              src={property.images[currentImageIndex]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Property Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Basic Information</h3>
                <div className="text-gray-300">
                  <p><MapPin className="inline-block w-5 h-5 text-orange-500" /> {property.city}, {property.area}</p>
                  <p><DollarSign className="inline-block w-5 h-5 text-orange-500" /> ₹{property.rent}/month</p>
                  <p><Users className="inline-block w-5 h-5 text-orange-500" /> {property.rooms} rooms</p>
                  <p><Home className="inline-block w-5 h-5 text-orange-500" /> {property.buildingType}</p>
                  <p><Key className="inline-block w-5 h-5 text-orange-500" /> Deposit: ₹{property.deposit}</p>
                  <p><Calendar className="inline-block w-5 h-5 text-orange-500" /> Category: {property.category}</p>
                </div>
              </div>

              {/* Property Features */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Property Features</h3>
                <div className="grid grid-cols-2 gap-3 text-gray-300">
                  {property.amenities?.map((amenity, index) => (
                    <p key={index}>{amenities[amenity]} {amenity}</p>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">House Rules</h3>
                <ul className="text-gray-300">
                  {property.rules?.map((rule, index) => (
                    <li key={index}><CheckCircle className="inline-block w-5 h-5 text-orange-500" /> {rule}</li>
                  ))}
                </ul>
              </div>

              {/* Owner Information */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Owner Information</h3>
                <p className="text-gray-300"><User className="inline-block w-5 h-5 text-orange-500" /> {property.ownerName}</p>
                <p className="text-gray-300"><Phone className="inline-block w-5 h-5 text-orange-500" /> {property.ownerPhone}</p>
                <p className="text-gray-300"><Mail className="inline-block w-5 h-5 text-orange-500" /> {property.ownerEmail}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleChatWithOwner}
                className="flex-1 px-6 py-3 bg-zinc-900 border border-orange-600 text-white rounded-lg hover:bg-orange-600/10 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5 text-orange-500" />
                Chat with Owner
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    toast.error('Please sign in to book this PG.');
                    navigate('/login');
                  } else {
                    setShowBookingForm(true);
                  }
                }}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
              >
                Book Now
              </button>
            </div>

            {/* Reviews Section */}
            <div className="mt-8 border-t border-orange-600/30 pt-6">
              <h3 className="text-xl font-bold text-white mb-4">Reviews & Ratings</h3>
              
              {/* Review Input Form */}
              {user && user.role === 'seeker' && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-zinc-950 rounded-xl border border-orange-600/20">
                  <h4 className="text-sm font-semibold mb-3">Write a Review</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-400">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Tell others about your experience staying here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows="3"
                    className="w-full p-3 bg-black border border-orange-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm mb-3 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition disabled:opacity-50 text-sm font-semibold"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {reviewLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No reviews yet. Be the first to leave a review!</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-600/20 rounded-full flex items-center justify-center text-xs font-bold text-orange-500">
                            {rev.seekerName?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <span className="text-sm font-semibold text-white">{rev.seekerName}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating ? 'text-yellow-500 fill-current' : 'text-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{rev.comment}</p>
                      <span className="text-xxs text-gray-500 block text-right mt-1">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          property={property}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
