import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { propertyApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';

const validationSchema = {
  basicInfo: {
    name: { required: true, minLength: 3 },
    buildingType: { required: true },
    category: { required: true },
    ownerName: { required: true },
    ownerPhone: { required: true },
  },
  location: {
    address: { required: true },
    city: { required: true },
    area: { required: true },
    pincode: { required: true },
  },
  propertyDetails: {
    area: { required: true },
    rooms: { required: true },
  },
  pricing: {
    rent: { required: true },
    deposit: { required: true },
  },
};

const AMENITIES_OPTIONS = [
  'Wi-Fi',
  'AC',
  'TV',
  'Refrigerator',
  'Washing Machine',
  'Parking',
  'Security',
  'Power Backup',
  'Water Supply 24/7',
  'Lift',
  'CCTV',
  'Gym',
  'Swimming Pool',
  'Garden',
  'Housekeeping'
];

const RULES_OPTIONS = [
  'No Smoking',
  'No Pets',
  'No Parties',
  'No Guests Overnight',
  'Vegetarians Only',
  'No Alcohol',
  'No Loud Music',
  'Gate Closing Time',
  'ID Proof Mandatory',
  'Background Verification'
];

export default function AddProperty() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    basicInfo: {
      name: '',
      buildingType: '',
      category: '',
      ownerName: user?.name || '',
      ownerPhone: '',
      ownerEmail: user?.email || '',
    },
    location: {
      city: '',
      area: '',
      address: '',
      pincode: '',
    },
    propertyDetails: {
      rooms: '',
      area: '',
    },
    pricing: {
      rent: '',
      deposit: '',
    },
    amenities: [],
    rules: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (section, field, value) => {
    const rules = validationSchema[section]?.[field];
    if (!rules) return true;

    const errors = {};
    if (rules.required && !value) {
      errors[field] = 'This field is required';
    }
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `Minimum length is ${rules.minLength} characters`;
    }
    return errors;
  };

  const handleInputChange = (e, section, field) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const fieldErrors = validateField(section, field, value);
    
    setErrors(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...fieldErrors
      }
    }));

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    
    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      setErrors({
        global: `The following files are too large (max 5MB): ${fileNames}. Please resize your images before uploading.`
      });
      return;
    }
    
    // Check file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      const fileNames = invalidFiles.map(f => f.name).join(', ');
      setErrors({
        global: `The following files are not images: ${fileNames}. Please upload only image files.`
      });
      return;
    }
    
    setSelectedFiles(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRuleToggle = (rule) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.includes(rule)
        ? prev.rules.filter(r => r !== rule)
        : [...prev.rules, rule]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate all required fields
      const validationErrors = {};
      Object.entries(validationSchema).forEach(([section, fields]) => {
        Object.entries(fields).forEach(([field, rules]) => {
          const value = formData[section][field];
          if (rules.required && (!value || value.trim() === '')) {
            validationErrors[section] = {
              ...validationErrors[section],
              [field]: 'This field is required'
            };
          }
        });
      });

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Create FormData object
      const submitData = new FormData();
      
      // Create property object
      const propertyData = {
        name: formData.basicInfo.name,
        buildingType: formData.basicInfo.buildingType,
        category: formData.basicInfo.category,
        ownerName: formData.basicInfo.ownerName,
        ownerPhone: formData.basicInfo.ownerPhone,
        ownerEmail: formData.basicInfo.ownerEmail,
        city: formData.location.city,
        area: formData.location.area,
        address: formData.location.address,
        pincode: formData.location.pincode,
        rooms: parseInt(formData.propertyDetails.rooms),
        areaInSqft: parseFloat(formData.propertyDetails.area),
        rent: parseFloat(formData.pricing.rent),
        deposit: parseFloat(formData.pricing.deposit),
        amenities: formData.amenities,
        rules: formData.rules,
      };

      // Append property data as JSON string
      submitData.append('property', JSON.stringify(propertyData));

      // Append images if any
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file, index) => {
          submitData.append('images', file);
        });
      }

      // Submit the form
      await propertyApi.createProperty(submitData);
      toast.success('Property added successfully!');
      navigate('/provider-dashboard/my-properties');
    } catch (error) {
      console.error('Error creating property:', error);
      if (error.response?.data?.message) {
        setErrors({
          global: error.response.data.message
        });
      } else {
        setErrors({
          global: error.message || 'Failed to submit property. Please try again later.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto bg-black/80 rounded-xl p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/provider-dashboard')}
            className="flex items-center text-white hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">Add New Property</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.entries(errors).map(([section, sectionErrors]) => (
            <div key={section} className="text-red-500">
              {Object.entries(sectionErrors).map(([field, error]) => (
                <p key={field}>{error}</p>
              ))}
            </div>
          ))}
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Property Name</label>
                <input
                  type="text"
                  value={formData.basicInfo.name}
                  onChange={(e) => handleInputChange(e, 'basicInfo', 'name')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter property name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Building Type</label>
                <select
                  value={formData.basicInfo.buildingType || ''}
                  onChange={(e) => handleInputChange(e, 'basicInfo', 'buildingType')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select building type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="room">Room</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={formData.basicInfo.category || ''}
                  onChange={(e) => handleInputChange(e, 'basicInfo', 'category')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select category</option>
                  <option value="pg">PG</option>
                  <option value="rental">Rental</option>
                  <option value="short-term">Short Term</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Owner Name</label>
                <input
                  type="text"
                  value={formData.basicInfo.ownerName}
                  onChange={(e) => handleInputChange(e, 'basicInfo', 'ownerName')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Owner Phone</label>
                  <input
                    type="tel"
                    value={formData.basicInfo.ownerPhone}
                    onChange={(e) => handleInputChange(e, 'basicInfo', 'ownerPhone')}
                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Owner Email</label>
                  <input
                    type="email"
                    value={formData.basicInfo.ownerEmail}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-orange-600 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Location Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange(e, 'location', 'city')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Area</label>
                <input
                  type="text"
                  value={formData.location.area}
                  onChange={(e) => handleInputChange(e, 'location', 'area')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange(e, 'location', 'address')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
                <input
                  type="text"
                  value={formData.location.pincode}
                  onChange={(e) => handleInputChange(e, 'location', 'pincode')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Property Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Total Rooms</label>
                <input
                  type="number"
                  value={formData.propertyDetails.rooms}
                  onChange={(e) => handleInputChange(e, 'propertyDetails', 'rooms')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Area (sq ft)</label>
                <input
                  type="number"
                  value={formData.propertyDetails.area}
                  onChange={(e) => handleInputChange(e, 'propertyDetails', 'area')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Pricing</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent</label>
                <input
                  type="number"
                  value={formData.pricing.rent}
                  onChange={(e) => handleInputChange(e, 'pricing', 'rent')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="₹"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Security Deposit</label>
                <input
                  type="number"
                  value={formData.pricing.deposit}
                  onChange={(e) => handleInputChange(e, 'pricing', 'deposit')}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="₹"
                />
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Property Images</h2>
            <div className="grid grid-cols-4 gap-4">
              {previewImages.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="inline-flex items-center px-6 py-3 border-2 border-dashed border-orange-500 rounded-lg cursor-pointer hover:bg-black/50"
              >
                <span className="text-orange-500">Upload Images</span>
              </label>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-white">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {AMENITIES_OPTIONS.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    formData.amenities.includes(amenity)
                      ? 'bg-orange-600 text-white'
                      : 'bg-black/50 text-gray-300 hover:bg-black/70'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Rules Section */}
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-white">House Rules</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {RULES_OPTIONS.map((rule) => (
                <button
                  key={rule}
                  type="button"
                  onClick={() => handleRuleToggle(rule)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    formData.rules.includes(rule)
                      ? 'bg-orange-600 text-white'
                      : 'bg-black/50 text-gray-300 hover:bg-black/70'
                  }`}
                >
                  {rule}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg bg-black/50 text-gray-300 hover:bg-black/70 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
