import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Users, DollarSign, Building, Phone, Mail, Clock, User, Search, ArrowLeft, Star, Heart } from 'lucide-react';
import { propertyApi, seekerApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import PropertyDetails from './PropertyDetails';

const FindPG = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [priceRange, setPriceRange] = useState({ min: searchParams.get('min') || '', max: searchParams.get('max') || '' });
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetchApprovedProperties();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    try {
      const data = await seekerApi.getFavorites(user.id);
      setSavedIds(data.map(p => p.id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleToggleFavorite = async (e, propertyId) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save properties');
      navigate('/login');
      return;
    }
    try {
      const res = await seekerApi.toggleFavorite(user.id, propertyId);
      setSavedIds(res.savedProperties || []);
      if (res.isFavorite) {
        toast.success('Property saved!');
      } else {
        toast.success('Property removed from saved.');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const fetchApprovedProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getApprovedProperties();
      setProperties(response || []);
      // Initialize current image index for each property
      const initialIndexes = {};
      response.forEach(property => {
        initialIndexes[property.id] = 0;
      });
      setCurrentImageIndex(initialIndexes);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (property && property.images && property.images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [propertyId]: (prev[propertyId] + 1) % property.images.length
      }));
    }
  };

  const prevImage = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (property && property.images && property.images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [propertyId]: prev[propertyId] === 0 ? property.images.length - 1 : prev[propertyId] - 1
      }));
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchTerm || 
                         (property.name && property.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.area && property.area.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = !selectedCity || 
                       (property.city && property.city.toLowerCase() === selectedCity.toLowerCase());
    const matchesPrice = (!priceRange.min || property.rent >= Number(priceRange.min)) &&
                        (!priceRange.max || property.rent <= Number(priceRange.max));
    return matchesSearch && matchesCity && matchesPrice;
  });

  const cities = [...new Set(properties.filter(p => p.city).map(property => property.city))];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/seeker-dashboard')}
            className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Find Your Perfect PG</h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-black/80 rounded-xl p-4 mb-6 border border-orange-600">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full px-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full px-4 py-2 bg-black/50 border border-orange-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-white text-center py-8">No properties found matching your criteria</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className="bg-black/80 rounded-xl overflow-hidden border border-orange-600 hover:shadow-orange-500/20 transition-shadow duration-300 cursor-pointer"
              >
                {/* Image Carousel */}
                <div className="relative aspect-[4/3]">
                  <button
                    onClick={(e) => handleToggleFavorite(e, property.id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-black/70 hover:bg-black/90 rounded-full transition group"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        savedIds.includes(property.id)
                          ? 'text-red-500 fill-current'
                          : 'text-white group-hover:text-red-500'
                      }`}
                    />
                  </button>
                  {property.images && property.images.length > 0 ? (
                    <>
                      <img
                        src={property.images[currentImageIndex[property.id]]}
                        alt={`${property.name} - Image ${currentImageIndex[property.id] + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(property.id);
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                          >
                            ←
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(property.id);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                          >
                            →
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {property.images.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                  index === currentImageIndex[property.id]
                                    ? 'bg-orange-500'
                                    : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Building className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-lg font-semibold text-white">{property.name}</h2>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      APPROVED
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-white">4.8</span>
                    <span className="text-xs text-gray-400">(Guest Choice)</span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{property.city}, {property.area}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-orange-500">₹{property.rent}</span>
                      <span className="text-xs text-zinc-500 line-through">₹{Math.round(property.rent * 1.4)}</span>
                      <span className="text-xxs font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">40% OFF</span>
                      <span className="text-xxs text-zinc-400">/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>{property.rooms} rooms available</span>
                    </div>
                  </div>

                  {/* OYO Amenity Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {property.amenities && property.amenities.length > 0 ? (
                      property.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="text-xxs px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800">
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="text-xxs px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800">Free Wi-Fi</span>
                        <span className="text-xxs px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800">AC Rooms</span>
                        <span className="text-xxs px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800">CCTV Security</span>
                      </>
                    )}
                  </div>

                  {/* Owner Info */}
                  <div className="mt-4 pt-4 border-t border-orange-600">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <User className="w-4 h-4 text-orange-500" />
                      <span>{property.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                      <Phone className="w-4 h-4 text-orange-500" />
                      <span>{property.ownerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                      <Mail className="w-4 h-4 text-orange-500" />
                      <span>{property.ownerEmail}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(property);
                    }}
                    className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Property Details Modal */}
        {selectedProperty && (
          <PropertyDetails
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FindPG; 