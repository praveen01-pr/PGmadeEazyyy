import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { seekerApi } from '../../../services/api';
import { MapPin, Heart, ArrowLeft, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PropertyDetails from './PropertyDetails';

const SavedPGs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const data = await seekerApi.getFavorites(user.id);
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load saved PGs');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (e, propertyId) => {
    e.stopPropagation();
    try {
      await seekerApi.toggleFavorite(user.id, propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success('Removed from Saved PGs');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from saved');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/seeker-dashboard')}
            className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Saved PGs</h1>
        </div>

        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-black/80 rounded-xl border border-orange-600/30">
            <Heart className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 mb-4 text-lg">You haven't saved any PGs yet.</p>
            <button
              onClick={() => navigate('/seeker-dashboard/find-pg')}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-semibold transition"
            >
              Explore PGs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <div
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className="bg-black/50 border border-orange-600 hover:border-orange-500 transition rounded-xl overflow-hidden cursor-pointer flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-900">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <button
                    onClick={(e) => removeFavorite(e, property.id)}
                    className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 rounded-full text-red-500 hover:text-red-600 transition"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 truncate">{property.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{property.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-300 mt-auto">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{property.area}, {property.city}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-orange-600/30">
                      <div>
                        <span className="text-orange-500 font-bold text-lg">₹{property.rent}</span>
                        <span className="text-xs text-gray-400">/mo</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Deposit: ₹{property.deposit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => {
            setSelectedProperty(null);
            fetchSavedProperties();
          }}
        />
      )}
    </div>
  );
};

export default SavedPGs;
