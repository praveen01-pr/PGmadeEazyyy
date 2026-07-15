import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { providerService } from '../../../services/providerService';

const ProviderProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    currentCity: '',
    govtIdType: '',
    govtIdNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    role: '',
    userType: ''
  });

  useEffect(() => {
    fetchProviderProfile();
  }, []);

  const fetchProviderProfile = async () => {
    try {
      setLoading(true);
      const data = await providerService.getProviderProfile(user.id);
      setFormData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await providerService.updateProviderProfile(user.id, formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-black p-6 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/provider-dashboard')}
          className="flex items-center text-white hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-black/80 rounded-xl p-6 border border-orange-600">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-orange-500" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">{formData.fullName}</h1>
                <p className="text-gray-400">Property Provider</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Current City</label>
                <input
                  type="text"
                  name="currentCity"
                  value={formData.currentCity}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div className="border-t border-orange-600 pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Government ID Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">ID Type</label>
                  <select
                    name="govtIdType"
                    value={formData.govtIdType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                  >
                    <option value="">Select ID Type</option>
                    <option value="aadhar">Aadhar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="driving">Driving License</option>
                    <option value="voter">Voter ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2">ID Number</label>
                  <input
                    type="text"
                    name="govtIdNumber"
                    value={formData.govtIdNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-orange-600 pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Emergency Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Emergency Contact Number</label>
                  <input
                    type="tel"
                    name="emergencyContactNumber"
                    value={formData.emergencyContactNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-black/50 border border-orange-600 rounded p-2 text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile; 