import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Building,
  User,
  LogOut,
  Menu,
  Plus,
  AlertCircle,
  XCircle,
  Info,
} from 'lucide-react';
import { propertyApi } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/provider-dashboard' },
  { icon: Building, label: 'My Properties', path: '/provider-dashboard/my-properties' },
  { icon: Plus, label: 'Add New Property', path: '/provider-dashboard/add-property' },
  { icon: XCircle, label: 'Rejected', path: '/provider-dashboard/rejected-properties' },
  { icon: User, label: 'Profile', path: '/provider-dashboard/profile' },
  { icon: LogOut, label: 'Logout', isLogout: true }
];

const ProviderDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleClickOutside = (e) => {
    if (
      isSidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target) &&
      !e.target.closest('#hamburger-button')
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const ownerName = user.name;
      const ownerProperties = await propertyApi.getPropertiesByOwner(ownerName);
      setProperties(ownerProperties);
    } catch {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (propertyId) => {
    navigate(`/provider/edit-property/${propertyId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="relative bg-black min-h-[calc(100vh-120px)] flex overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          className="z-40 w-64 bg-black/90 border-r border-orange-600 p-4 space-y-4"
        >
          <h1 className="text-2xl font-bold text-white mb-6">Features</h1>
          {menuItems.map((item, index) => (
            item.isLogout ? (
              <button
                key={index}
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 text-white transition w-full"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-orange-600 text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </div>
      )}

      {/* Content + Overlay */}
      <div className="flex-1 relative">
        {/* Blur Overlay */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-30 backdrop-blur-sm bg-black/20 transition"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="relative z-20 p-6">
          {/* Hamburger Button */}
          <button
            id="hamburger-button"
            onClick={toggleSidebar}
            className="mb-4 p-2 rounded bg-orange-600 text-white hover:bg-orange-500 transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Welcome Section */}
          <div className="bg-black/80 rounded-xl p-6 border border-orange-600 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user.name}!</h2>
            <p className="text-gray-400">Manage your properties and profile</p>
          </div>

          {/* Property Approval Info Section */}
          <div className="bg-black/80 rounded-xl p-6 border border-orange-600 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-600/20 p-3 rounded-lg">
                <Info className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Property Approval Process</h3>
                <p className="text-gray-300 mb-4">
                  After you add a new property, our admin team will review it to ensure it meets our quality standards. Here's what you need to know:
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>New properties will show as <span className="text-yellow-500">PENDING</span> until reviewed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Approval typically takes 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Once approved, your property will be visible to seekers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>If rejected, you'll receive feedback and can make necessary changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Properties Section */}
          <div className="bg-black/80 rounded-xl p-6 border border-orange-600">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Properties</h2>
              <button
                onClick={() => navigate('/provider-dashboard/add-property')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition"
              >
                <Plus className="w-5 h-5" />
                Add Property
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-black/50 p-6 rounded-lg border border-orange-600">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">{property.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{property.city}, {property.area}</p>
                  <p className="text-sm text-gray-300 mb-2">₹{property.rent}/month</p>
                  <p className="text-sm text-gray-300 mb-4">{property.rooms} rooms</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleEdit(property.id)}
                      className="bg-orange-600 hover:bg-orange-500 text-white py-2 px-4 rounded transition"
                    >
                      Edit
                    </button>
                    {property.status === 'PENDING' && (
                      <div className="flex items-center text-yellow-500">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Awaiting Approval</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
