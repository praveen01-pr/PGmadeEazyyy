import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, MapPin, Users, DollarSign, XCircle } from 'lucide-react';
import { propertyApi } from '../../../services/api';
import { toast } from 'react-hot-toast';

const AdminRejectedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRejectedProperties();
  }, []);

  const loadRejectedProperties = async () => {
    try {
      setLoading(true);
      const rejectedProperties = await propertyApi.getRejectedProperties();
      setProperties(rejectedProperties);
    } catch (err) {
      toast.error('Failed to load rejected properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center text-white hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Rejected Properties</h1>
            <p className="text-gray-400 mt-2">Properties that have been rejected with reasons</p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-0">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-black/80 p-6 rounded-xl shadow-xl border border-red-600 hover:shadow-red-500/20 transition-shadow duration-300"
              >
                {/* Rejection Reason Section */}
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-red-500 font-semibold">Rejection Reason</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {property.rejectionReason || 'No specific reason provided'}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-orange-500" />
                    <h2 className="text-xl font-semibold text-white">
                      {property.name}
                    </h2>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{property.city}, {property.area} sq ft</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                    <span>₹{property.rent}/month</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{property.rooms} rooms</span>
                  </div>
                </div>

                {/* Owner Details */}
                <div className="bg-black/50 p-4 rounded-lg border border-orange-600 mt-4">
                  <h3 className="text-white font-semibold mb-2">Owner Details</h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>Name: {property.ownerName}</p>
                    <p>Email: {property.ownerEmail}</p>
                    <p>Phone: {property.ownerPhone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No rejected properties found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRejectedProperties; 