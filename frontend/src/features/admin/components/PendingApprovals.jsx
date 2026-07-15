import React, { useState, useEffect } from 'react';
import { propertyApi } from '../../../services/api';
import { toast } from 'react-hot-toast';

export default function PendingApprovals() {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPendingProperties();
  }, []);

  const loadPendingProperties = async () => {
    try {
      setLoading(true);
      const properties = await propertyApi.getPendingProperties();
      setPendingProperties(properties);
    } catch (err) {
      setError('Failed to load pending properties');
      toast.error('Failed to load pending properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      await propertyApi.approveProperty(propertyId, 'Property approved by admin');
      toast.success('Property approved successfully');
      loadPendingProperties();
    } catch (err) {
      toast.error('Failed to approve property');
    }
  };

  const handleReject = async (propertyId) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      try {
        await propertyApi.rejectProperty(propertyId, reason);
        toast.success('Property rejected successfully');
        loadPendingProperties();
      } catch (err) {
        toast.error('Failed to reject property');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Pending Property Approvals</h2>
      
      {pendingProperties.length === 0 ? (
        <p className="text-gray-500 text-center">No pending properties to approve</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {property.images && property.images.length > 0 && (
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
                <p className="text-gray-600 mb-2">{property.city}, {property.area}</p>
                <p className="text-gray-600 mb-2">₹{property.rent}/month</p>
                <p className="text-gray-600 mb-4">{property.rooms} rooms</p>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => handleApprove(property.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(property.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 