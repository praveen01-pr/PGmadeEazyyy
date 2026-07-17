import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Users, DollarSign, Building, Phone, Mail, Clock, User, Search, ArrowLeft, Star, Heart, Scale, X, Check, Shield } from 'lucide-react';
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
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [priceRange, setPriceRange] = useState({ min: searchParams.get('min') || '', max: searchParams.get('max') || '' });
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Server Wake-up Notice State (Render free-tier helper)
  const [showWakeUpNotice, setShowWakeUpNotice] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setShowWakeUpNotice(true);
      }, 2500); // show notice if it takes longer than 2.5 seconds
    } else {
      setShowWakeUpNotice(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

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

  // Real-time Property Filtering Logic
  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchTerm || 
                         (property.name && property.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (property.area && property.area.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCity = !selectedCity || 
                       (property.city && property.city.toLowerCase() === selectedCity.toLowerCase());
    
    const matchesPrice = (!priceRange.min || property.rent >= Number(priceRange.min)) &&
                         (!priceRange.max || property.rent <= Number(priceRange.max));

    const matchesCategory = !selectedCategory || 
                           (property.category && property.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesAmenities = selectedAmenities.length === 0 || 
                            selectedAmenities.every(amenity => 
                              property.amenities && property.amenities.some(a => a.toLowerCase() === amenity.toLowerCase())
                            );

    return matchesSearch && matchesCity && matchesPrice && matchesCategory && matchesAmenities;
  });

  const cities = [...new Set(properties.filter(p => p.city).map(property => property.city))];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        {showWakeUpNotice && (
          <div className="max-w-md bg-zinc-950 border border-zinc-850 p-5 rounded-xl shadow-xl shadow-orange-500/5 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-sm font-bold text-orange-500 tracking-wide uppercase">Connecting to Server</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              We are waking up your database on the Render Free Tier. Since it goes to sleep after 15 minutes of inactivity, the very first load can take up to <strong>50 seconds</strong>.
            </p>
            <p className="text-xxs text-zinc-500 mt-2">
              (Subsequent searches and actions will be completely instant once awake!)
            </p>
          </div>
        )}
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
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="container mx-auto px-4 py-8 pb-32">
        
        {/* Header Back & Title */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/seeker-dashboard')}
            className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Find Your Perfect PG
          </h1>
        </div>

        {/* Top Card: Search Bar & City Selector */}
        <div className="bg-zinc-950/80 rounded-xl p-4 mb-6 border border-orange-600/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name, brand, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-1/2 px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-1/2 px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Main Section: Sidebar + Property Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Sticky Sidebar Filters */}
          <div className="w-full lg:w-1/4 bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 h-fit lg:sticky lg:top-20">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-800">
              <h3 className="font-bold text-white">Advanced Filters</h3>
              <button 
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedAmenities([]);
                  setPriceRange({ min: "", max: "" });
                  setSearchTerm("");
                  setSelectedCity("");
                }}
                className="text-xs text-orange-500 hover:text-orange-400 transition"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter Cards */}
            <div className="mb-6">
              <h4 className="font-medium text-xs text-zinc-400 uppercase tracking-wider mb-3">Hostel Category</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All", value: "" },
                  { label: "Boys Only", value: "boys" },
                  { label: "Girls Only", value: "girls" },
                  { label: "Unisex / Coliving", value: "unisex" }
                ].map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                      selectedCategory === cat.value
                        ? 'bg-orange-500 text-black font-semibold border-orange-500 shadow-md shadow-orange-500/10'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Filters */}
            <div>
              <h4 className="font-medium text-xs text-zinc-400 uppercase tracking-wider mb-3">Key Amenities</h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                {["Wi-Fi", "Food", "AC", "Security", "Laundry", "Gym", "Power Backup"].map(amenity => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none hover:text-white transition">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                          } else {
                            setSelectedAmenities([...selectedAmenities, amenity]);
                          }
                        }}
                        className="w-4 h-4 accent-orange-500 border-zinc-800 rounded bg-zinc-900 focus:ring-0 cursor-pointer"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Properties Listings Grid */}
          <div className="w-full lg:w-3/4">
            {filteredProperties.length === 0 ? (
              <div className="text-zinc-400 text-center py-16 bg-zinc-950/30 rounded-xl border border-dashed border-zinc-800">
                No properties found matching your criteria. Try widening your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  const isCompared = compareList.some(item => item.id === property.id);
                  return (
                    <div
                      key={property.id}
                      onClick={() => setSelectedProperty(property)}
                      className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer flex flex-col relative group"
                    >
                      {/* Image Slider Wrapper */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                        
                        {/* Compare Selection Box */}
                        <div 
                          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/85 px-2.5 py-1 rounded-full border border-zinc-800 hover:bg-black/95 transition shadow-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input 
                            type="checkbox"
                            id={`compare-${property.id}`}
                            checked={isCompared}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (compareList.length >= 3) {
                                  toast.error("You can compare up to 3 hostels at once.");
                                  return;
                                }
                                setCompareList([...compareList, property]);
                              } else {
                                setCompareList(compareList.filter(item => item.id !== property.id));
                              }
                            }}
                            className="w-3.5 h-3.5 accent-orange-500 rounded cursor-pointer"
                          />
                          <label htmlFor={`compare-${property.id}`} className="text-xxs font-bold text-white cursor-pointer select-none tracking-wide">
                            COMPARE
                          </label>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => handleToggleFavorite(e, property.id)}
                          className="absolute top-3 right-3 z-10 p-2 bg-black/70 hover:bg-black/90 rounded-full transition"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              savedIds.includes(property.id)
                                ? 'text-red-500 fill-current'
                                : 'text-white hover:text-red-500'
                            }`}
                          />
                        </button>

                        {/* Images */}
                        {property.images && property.images.length > 0 ? (
                          <>
                            <img
                              src={property.images[currentImageIndex[property.id]]}
                              alt={`${property.name} - Image ${currentImageIndex[property.id] + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {property.images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage(property.id);
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                                >
                                  ←
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage(property.id);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                                >
                                  →
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-black/50 px-2 py-0.5 rounded-full">
                                  {property.images.map((_, index) => (
                                    <div
                                      key={index}
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        index === currentImageIndex[property.id]
                                          ? 'bg-orange-500'
                                          : 'bg-zinc-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                            <Building className="w-12 h-12 text-zinc-700" />
                          </div>
                        )}
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h2 className="text-base font-bold text-white leading-tight group-hover:text-orange-500 transition-colors">{property.name}</h2>
                            <span className="shrink-0 px-2 py-0.5 text-xxs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">
                              {property.category ? property.category.toUpperCase() : 'UNISEX'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2.5">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                            <span className="text-xs font-semibold text-white">4.8</span>
                            <span className="text-xxs text-zinc-500">(Premium Host)</span>
                          </div>

                          <div className="space-y-2 text-xs text-zinc-300">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-orange-500" />
                              <span>{property.city}, {property.area}</span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-black text-orange-500">₹{property.rent}</span>
                              <span className="text-xxs text-zinc-500 line-through">₹{Math.round(property.rent * 1.4)}</span>
                              <span className="text-xxs font-bold text-green-500 bg-green-500/10 px-1 py-0.5 rounded">40% OFF</span>
                              <span className="text-xxs text-zinc-500">/mo</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {/* Amenity Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {property.amenities && property.amenities.length > 0 ? (
                              property.amenities.slice(0, 3).map((amenity, i) => (
                                <span key={i} className="text-xxs px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded border border-zinc-800">
                                  {amenity}
                                </span>
                              ))
                            ) : (
                              <>
                                <span className="text-xxs px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded border border-zinc-800">Wi-Fi</span>
                                <span className="text-xxs px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded border border-zinc-800">AC</span>
                                <span className="text-xxs px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded border border-zinc-800">Food</span>
                              </>
                            )}
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProperty(property);
                            }}
                            className="w-full mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-md shadow-orange-600/10"
                          >
                            VIEW DETAILS
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Property Details Modal Overlay */}
        {selectedProperty && (
          <PropertyDetails
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}

        {/* Floating Bottom Comparison Drawer */}
        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-orange-600 shadow-2xl py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-bold text-white tracking-wide">Compare Hostels ({compareList.length}/3)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {compareList.map(p => (
                  <div key={p.id} className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-xs text-white max-w-[120px] truncate">{p.name}</span>
                    <button 
                      onClick={() => setCompareList(compareList.filter(item => item.id !== p.id))}
                      className="text-zinc-500 hover:text-red-500 font-extrabold text-sm transition"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto justify-end">
              <button 
                onClick={() => setCompareList([])}
                className="px-4 py-2 text-xs font-semibold border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-red-400 rounded-lg transition"
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowCompareModal(true)}
                disabled={compareList.length < 2}
                className={`px-6 py-2 rounded-lg font-bold text-xs tracking-wider transition ${
                  compareList.length < 2 
                    ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-850'
                    : 'bg-orange-500 hover:bg-orange-600 text-black shadow-lg shadow-orange-500/20'
                }`}
              >
                COMPARE NOW
              </button>
            </div>
          </div>
        )}

        {/* Fullscreen Comparison Overlay Modal */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-zinc-855 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative">
              
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-white">Compare Hostels Side-by-Side</h2>
                </div>
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid / Comparison Table */}
              <div className="flex-grow overflow-y-auto p-6">
                <div className="grid grid-cols-4 gap-4 min-w-[700px] divide-x divide-zinc-900">
                  
                  {/* Features Label Column */}
                  <div className="space-y-6 pt-48 pr-2">
                    <div className="h-10 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center">Rent & Fees</div>
                    <div className="h-10 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center">Security Deposit</div>
                    <div className="h-10 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center">Category</div>
                    <div className="h-10 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center">Location</div>
                    <div className="h-28 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-start pt-2">Key Amenities</div>
                    <div className="h-12 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center">House Rules</div>
                    <div className="h-20 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center">Contact Owner</div>
                  </div>

                  {/* Property Columns */}
                  {compareList.map(p => (
                    <div key={p.id} className="pl-4 space-y-6 flex flex-col">
                      
                      {/* Host Card Header Details */}
                      <div className="h-44 flex flex-col items-center text-center">
                        <img 
                          src={p.images && p.images[0] ? p.images[0] : ""} 
                          alt={p.name}
                          className="w-32 h-20 object-cover rounded-lg border border-zinc-800 shadow-md mb-2.5"
                        />
                        <h3 className="text-sm font-extrabold text-white line-clamp-2 max-w-[200px]">{p.name}</h3>
                        <span className="text-xxs text-zinc-500 mt-1">{p.rooms} rooms available</span>
                      </div>

                      {/* Rent */}
                      <div className="h-10 flex flex-col justify-center">
                        <span className="text-base font-black text-orange-500">₹{p.rent} <span className="text-xxs text-zinc-500">/mo</span></span>
                        <span className="text-xxs text-green-500 font-bold">Includes 40% OFF Special Discount</span>
                      </div>

                      {/* Security Deposit */}
                      <div className="h-10 flex items-center font-bold text-sm text-white">
                        ₹{p.deposit || 'N/A'}
                      </div>

                      {/* Category */}
                      <div className="h-10 flex items-center">
                        <span className="px-2.5 py-0.5 text-xxs font-bold bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
                          {p.category ? p.category.toUpperCase() : 'UNISEX'}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="h-10 flex flex-col justify-center text-xs text-zinc-300">
                        <span className="font-semibold text-white">{p.area}</span>
                        <span>{p.city}</span>
                      </div>

                      {/* Amenities checklist compares */}
                      <div className="h-28 flex flex-wrap gap-1.5 content-start pt-2">
                        {["Wi-Fi", "Food", "AC", "Security", "Laundry", "Gym"].map(amenity => {
                          const hasIt = p.amenities && p.amenities.some(a => a.toLowerCase() === amenity.toLowerCase());
                          return (
                            <div key={amenity} className={`flex items-center gap-1 text-xxs px-2 py-0.5 rounded border ${
                              hasIt 
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-zinc-950 border-zinc-900 text-zinc-600 line-through'
                            }`}>
                              {hasIt ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                              <span>{amenity}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Rules */}
                      <div className="h-12 text-xs text-zinc-400 flex items-center max-w-[220px] line-clamp-2">
                        {p.rules && p.rules[0] ? p.rules[0] : 'Standard rules apply'}
                      </div>

                      {/* Contact Owner Info */}
                      <div className="h-20 flex flex-col justify-center text-xxs text-zinc-400 space-y-0.5 border-t border-zinc-900/50 pt-2">
                        <span className="font-semibold text-white text-xs">{p.ownerName}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-orange-500" /> {p.ownerPhone}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-orange-500" /> {p.ownerEmail}</span>
                      </div>

                    </div>
                  ))}

                  {/* Empty state slots if less than 3 hostels selected */}
                  {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <div key={idx} className="pl-4 flex flex-col items-center justify-center text-center text-zinc-750 bg-zinc-950/20 border border-dashed border-zinc-900 rounded-xl h-full py-20 min-h-[300px]">
                      <Scale className="w-8 h-8 mb-2 text-zinc-800" />
                      <span className="text-xs font-semibold">Select another hostel to compare</span>
                    </div>
                  ))}

                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-zinc-900 flex justify-end">
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs tracking-wider rounded-lg shadow-lg shadow-orange-500/10 transition"
                >
                  CLOSE COMPARISON
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FindPG;