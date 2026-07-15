import { useState } from 'react';
import PropTypes from 'prop-types';

const PersonalDetails = ({ formData, handleChange, errors }) => {
  const [maxDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Personal Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-gray-200">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-gray-200">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
            placeholder="Enter your email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-gray-200">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
            placeholder="Enter your password"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-gray-200">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-gray-200">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
            placeholder="Enter your phone number"
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 bg-black/50 border-gray-700 rounded focus:ring-orange-500"
            />
            <label className="text-gray-200 text-sm">
              I agree to the <a href="/terms" className="text-orange-500 hover:text-orange-600">Terms and Conditions</a> and <a href="/privacy" className="text-orange-500 hover:text-orange-600">Privacy Policy</a>
            </label>
          </div>
          {errors.termsAgreed && <p className="text-red-500 text-sm mt-1">{errors.termsAgreed}</p>}
        </div>
      </div>
    </div>
  );
};

PersonalDetails.propTypes = {
  formData: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    phone: PropTypes.string,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
    currentCity: PropTypes.string
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    phone: PropTypes.string,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
    currentCity: PropTypes.string
  })
};

export default PersonalDetails;
