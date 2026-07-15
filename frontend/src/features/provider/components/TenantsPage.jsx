import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Home } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const TenantsPage = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        if (!user?.email) {
          setError('User email not found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/properties/owner/email/${encodeURIComponent(user.email)}`);
        // Ensure response.data is an array
        const tenantsData = Array.isArray(response.data) ? response.data : [];
        setTenants(tenantsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to fetch tenant data');
        setLoading(false);
      }
    };

    fetchTenants();
  }, [user?.email]); // Update dependency to user.email

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/provider-dashboard')}
          className="flex items-center text-white hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Tenants</h1>
        
        {tenants.length === 0 ? (
          <div className="bg-black/80 border border-orange-600 rounded-lg p-8 text-center">
            <p className="text-gray-400">No tenants found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <div key={tenant._id} className="bg-black/80 border border-orange-600 rounded-lg p-6 hover:border-orange-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{tenant.seeker.name}</h3>
                    <p className="text-gray-400 text-sm flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {tenant.seeker.email}
                    </p>
                    <p className="text-gray-400 text-sm flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-2" />
                      {tenant.seeker.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-orange-600/30 pt-4">
                  <div className="flex items-center text-gray-300">
                    <Home className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm">{tenant.property.name}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm">
                      From: {new Date(tenant.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-300 pl-6">
                    <span className="text-sm">
                      To: {new Date(tenant.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-orange-600/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Booking Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${tenant.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500' : tenant.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tenant.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Payment Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${tenant.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-500' : tenant.paymentStatus === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tenant.paymentStatus}
                    </span>
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

export default TenantsPage;