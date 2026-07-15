import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Edit, Trash2, Plus, ArrowLeft, MapPin, Users, DollarSign, AlertCircle } from 'lucide-react';
import { propertyApi } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const ownerProperties = await propertyApi.getPropertiesByOwner(user.email);
      setProperties(ownerProperties);
    } catch (err) {
      setError('Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
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

  const handleEdit = (property) => {
    setEditingProperty(property.id);
    setEditForm({
      name: property.name,
      city: property.city,
      area: property.area,
      rent: property.rent,
      rooms: property.rooms,
      buildingType: property.buildingType,
      deposit: property.deposit,
      ownerName: property.ownerName,
      ownerPhone: property.ownerPhone,
      ownerEmail: property.ownerEmail,
      amenities: property.amenities || [],
      rules: property.rules || []
    });
  };

  const validateForm = () => {
    const requiredFields = ['name', 'city', 'area', 'rent', 'rooms', 'buildingType'];
    
    // Validate required fields
    for (const field of requiredFields) {
      if (!editForm[field] || editForm[field].toString().trim() === '') {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Validate numeric fields
    const numericFields = ['rent', 'rooms', 'deposit'];
    for (const field of numericFields) {
      if (editForm[field] && isNaN(Number(editForm[field]))) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a number`);
        return false;
      }
    }
    
    // Validate phone number format
    if (editForm.ownerPhone && !/^[0-9]{10}$/.test(editForm.ownerPhone)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    
    return true;
  };

  const handleSave = async (propertyId) => {
    if (!validateForm()) return;
    
    try {
      // Create FormData and append property as JSON string
      const formData = new FormData();
      formData.append('property', JSON.stringify(editForm));
      
      await propertyApi.updateProperty(propertyId, formData);
      toast.success('Property updated successfully');
      loadProperties();
      setEditingProperty(null);
      setEditForm({});
    } catch (error) {
      toast.error('Failed to update property');
    }
  };

  const handleCancel = () => {
    setEditingProperty(null);
    setEditForm({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs (amenities and rules)
    if (type === 'checkbox') {
      setEditForm(prev => {
        const currentArray = prev[name] || [];
        return {
          ...prev,
          [name]: checked 
            ? [...currentArray, value]
            : currentArray.filter(item => item !== value)
        };
      });
    } else {
      // Handle other inputs
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyApi.deleteProperty(propertyId);
        toast.success('Property deleted successfully');
        loadProperties(); // Reload the properties list
      } catch (err) {
        toast.error('Failed to delete property');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        {error}
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
              onClick={() => navigate('/provider-dashboard')}
              className="flex items-center text-white hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My Properties</h1>
            <button
              onClick={() => navigate('/provider-dashboard/add-property')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
            >
              <Plus className="h-5 w-5" />
              Add New Property
            </button>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-0">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-black/80 p-6 rounded-xl shadow-xl border border-orange-600 hover:shadow-orange-500/20 transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-orange-500" />
                    <h2 className="text-xl font-semibold text-white">
                      {property.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.approvalStatus === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : property.approvalStatus === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {property.approvalStatus}
                    </span>
                    {property.approvalStatus === 'PENDING' && (
                      <div className="flex items-center text-yellow-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span>Awaiting Admin Review</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Image */}
                <div className="h-48 overflow-hidden mb-4">
                  <img
                    src={property.images?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={property.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                    {editingProperty === property.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="city"
                          value={editForm.city}
                          onChange={handleInputChange}
                          className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white w-24"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          name="area"
                          value={editForm.area}
                          onChange={handleInputChange}
                          className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white w-24"
                          placeholder="Area"
                        />
                      </div>
                    ) : (
                      <span>{property.city}, {property.area} sq ft</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                    {editingProperty === property.id ? (
                      <input
                        type="number"
                        name="rent"
                        value={editForm.rent}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white w-32"
                        placeholder="Rent"
                      />
                    ) : (
                      <span>₹{property.rent}/month</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="w-5 h-5 mr-2 text-orange-500" />
                    {editingProperty === property.id ? (
                      <input
                        type="number"
                        name="rooms"
                        value={editForm.rooms}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white w-24"
                        placeholder="Rooms"
                      />
                    ) : (
                      <span>{property.rooms} rooms</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Building2 className="w-5 h-5 mr-2 text-orange-500" />
                    {editingProperty === property.id ? (
                      <input
                        type="text"
                        name="buildingType"
                        value={editForm.buildingType}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white w-32"
                        placeholder="Building Type"
                      />
                    ) : (
                      <span>{property.buildingType}</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                    {editingProperty === property.id ? (
                      <input
                        type="number"
                        name="deposit"
                        value={editForm.deposit}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white w-32"
                        placeholder="Deposit"
                      />
                    ) : (
                      <span>Deposit: ₹{property.deposit}</span>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-white font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-orange-600/20 text-orange-500 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Owner Details */}
                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-2">Owner Details</h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    {editingProperty === property.id ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-16">Name:</span>
                          <input
                            type="text"
                            name="ownerName"
                            value={editForm.ownerName}
                            onChange={handleInputChange}
                            className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16">Phone:</span>
                          <input
                            type="text"
                            name="ownerPhone"
                            value={editForm.ownerPhone}
                            onChange={handleInputChange}
                            className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16">Email:</span>
                          <input
                            type="email"
                            name="ownerEmail"
                            value={editForm.ownerEmail}
                            onChange={handleInputChange}
                            className="bg-black/50 border border-orange-600 rounded px-2 py-1 text-white flex-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p>Name: {property.ownerName}</p>
                        <p>Phone: {property.ownerPhone}</p>
                        <p>Email: {property.ownerEmail}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Rules */}
                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-2">Rules</h3>
                  {editingProperty === property.id ? (
                    <textarea
                      name="rules"
                      value={editForm.rules.join('\n')}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        rules: e.target.value.split('\n').filter(rule => rule.trim() !== '')
                      }))}
                      className="w-full bg-black/50 border border-orange-600 rounded px-2 py-1 text-white text-sm"
                      placeholder="Enter rules (one per line)"
                      rows="4"
                    />
                  ) : (
                    property.rules && property.rules.length > 0 && (
                      <ul className="text-gray-300 text-sm list-disc list-inside">
                        {property.rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  {editingProperty === property.id ? (
                    <button
                      onClick={() => handleSave(property.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
                    >
                      <Edit className="h-5 w-5" />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(property)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition"
                    >
                      <Edit className="h-5 w-5" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                You haven't added any properties yet.
              </p>
              <button
                onClick={() => navigate('/provider-dashboard/add-property')}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
              >
                Add Your First Property
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProperties;