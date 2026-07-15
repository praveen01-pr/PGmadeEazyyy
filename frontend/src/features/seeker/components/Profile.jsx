import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Building, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { seekerService } from '../../../services/seekerService';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    dateOfBirth: '',
    gender: '',
    currentCity: '',
    govtIdType: '',
    govtIdNumber: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    termsAgreed: false,
    preferredLocation: '',
    occupationType: '',
    // Student specific fields
    collegeName: '',
    courseName: '',
    yearOfStudy: '',
    collegeAddress: '',
    studentId: '',
    // Professional specific fields
    companyName: '',
    jobRole: '',
    workExperience: '',
    officeAddress: '',
    workId: '',
    userType: ''
  });

  useEffect(() => {
    fetchSeekerProfile();
  }, []);

  const fetchSeekerProfile = async () => {
    try {
      setLoading(true);
      const data = await seekerService.getSeekerProfile(user.id);
      setProfileData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await seekerService.updateSeekerProfile(user.id, profileData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/seeker-dashboard')}
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

        <div className="bg-black/80 border border-orange-600 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-orange-500" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">{profileData.fullName}</h1>
                <p className="text-gray-400">PG Seeker</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="border-b border-orange-600/30 pb-6">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  />
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="currentCity"
                    value={profileData.currentCity}
                    onChange={handleInputChange}
                    placeholder="Current City"
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* College/Occupation Information */}
              <div className="border-b border-orange-600/30 pb-6">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">College/Occupation Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    name="occupationType"
                    value={profileData.occupationType}
                    onChange={handleInputChange}
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Occupation Type</option>
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>

                  {profileData.occupationType === 'student' ? (
                    <>
                      <input
                        type="text"
                        name="collegeName"
                        value={profileData.collegeName}
                        onChange={handleInputChange}
                        placeholder="College Name"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="courseName"
                        value={profileData.courseName}
                        onChange={handleInputChange}
                        placeholder="Course Name"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="yearOfStudy"
                        value={profileData.yearOfStudy}
                        onChange={handleInputChange}
                        placeholder="Year of Study"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="collegeAddress"
                        value={profileData.collegeAddress}
                        onChange={handleInputChange}
                        placeholder="College Address"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="studentId"
                        value={profileData.studentId}
                        onChange={handleInputChange}
                        placeholder="Student ID"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                    </>
                  ) : profileData.occupationType === 'professional' ? (
                    <>
                      <input
                        type="text"
                        name="companyName"
                        value={profileData.companyName}
                        onChange={handleInputChange}
                        placeholder="Company Name"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="jobRole"
                        value={profileData.jobRole}
                        onChange={handleInputChange}
                        placeholder="Job Role"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="workExperience"
                        value={profileData.workExperience}
                        onChange={handleInputChange}
                        placeholder="Work Experience (years)"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="officeAddress"
                        value={profileData.officeAddress}
                        onChange={handleInputChange}
                        placeholder="Office Address"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="workId"
                        value={profileData.workId}
                        onChange={handleInputChange}
                        placeholder="Work ID"
                        className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                      />
                    </>
                  ) : null}
                </div>
              </div>

              {/* Government ID Information */}
              <div className="border-b border-orange-600/30 pb-6">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">Government ID Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    name="govtIdType"
                    value={profileData.govtIdType}
                    onChange={handleInputChange}
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select ID Type</option>
                    <option value="aadhar">Aadhar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="driving">Driving License</option>
                    <option value="voter">Voter ID</option>
                  </select>
                  <input
                    type="text"
                    name="govtIdNumber"
                    value={profileData.govtIdNumber}
                    onChange={handleInputChange}
                    placeholder="Government ID Number"
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Emergency Contact Information */}
              <div className="border-b border-orange-600/30 pb-6">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">Emergency Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Emergency Contact Name"
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    name="emergencyContactNumber"
                    value={profileData.emergencyContactNumber}
                    onChange={handleInputChange}
                    placeholder="Emergency Contact Number"
                    className="bg-black/50 text-white border border-orange-600/50 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="border-b border-orange-600/30 pb-6">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400">Full Name</p>
                    <p className="text-white">{profileData.fullName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Email</p>
                    <p className="text-white">{profileData.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white">{profileData.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Date of Birth</p>
                    <p className="text-white">{profileData.dateOfBirth}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Gender</p>
                    <p className="text-white">{profileData.gender}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Current City</p>
                    <p className="text-white">{profileData.currentCity}</p>
                  </div>
                </div>
              </div>

              {/* College/Occupation Information */}
              <div className="border-b border-orange-600/30 pb-6">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">College/Occupation Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400">Occupation Type</p>
                    <p className="text-white">{profileData.occupationType}</p>
                  </div>

                  {profileData.occupationType === 'student' ? (
                    <>
                      <div className="space-y-2">
                        <p className="text-gray-400">College Name</p>
                        <p className="text-white">{profileData.collegeName}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">Course Name</p>
                        <p className="text-white">{profileData.courseName}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">Year of Study</p>
                        <p className="text-white">{profileData.yearOfStudy}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">College Address</p>
                        <p className="text-white">{profileData.collegeAddress}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">Student ID</p>
                        <p className="text-white">{profileData.studentId}</p>
                      </div>
                    </>
                  ) : profileData.occupationType === 'professional' ? (
                    <>
                      <div className="space-y-2">
                        <p className="text-gray-400">Company Name</p>
                        <p className="text-white">{profileData.companyName}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">Job Role</p>
                        <p className="text-white">{profileData.jobRole}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">Work Experience</p>
                        <p className="text-white">{profileData.workExperience} years</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">Office Address</p>
                        <p className="text-white">{profileData.officeAddress}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">Work ID</p>
                        <p className="text-white">{profileData.workId}</p>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Government ID Information */}
              <div className="border-b border-orange-600/30 pb-6">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">Government ID Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400">ID Type</p>
                    <p className="text-white">{profileData.govtIdType}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">ID Number</p>
                    <p className="text-white">{profileData.govtIdNumber}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Information */}
              <div className="pb-6">
                <h2 className="text-xl font-semibold text-orange-500 mb-4">Emergency Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400">Emergency Contact Name</p>
                    <p className="text-white">{profileData.emergencyContactName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Emergency Contact Number</p>
                    <p className="text-white">{profileData.emergencyContactNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
