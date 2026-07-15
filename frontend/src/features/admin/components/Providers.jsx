import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { adminApi } from '../../../services/api';
import { toast } from 'react-hot-toast';

const Providers = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProviders();
      setProviders(response || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to load providers');
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading providers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="flex items-center text-white hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">Property Providers</h1>

        {providers.length === 0 ? (
          <div className="text-white text-center py-8">No providers found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-black/80 border border-orange-600 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-white">{provider.fullName}</h2>
                    <p className="text-gray-400">ID: {provider.id}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <Phone className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{provider.email}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{provider.currentCity}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                    <span>DOB: {provider.dateOfBirth}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-orange-600/30">
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gender:</span>
                      <span className="text-white">{provider.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID Type:</span>
                      <span className="text-white">{provider.govtIdType}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Providers; 