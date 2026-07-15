import PropTypes from 'prop-types';

const Verification = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Verification & Agreement</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-gray-200">Government ID Type</label>
          <select
            name="govtIdType"
            value={formData.govtIdType}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
          >
            <option value="">Select ID Type</option>
            <option value="aadhar">Aadhar Card</option>
            <option value="pan">PAN Card</option>
            <option value="dl">Driving License</option>
          </select>
          {errors.govtIdType && <span className="text-red-500 text-sm">{errors.govtIdType}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-gray-200">ID Number</label>
          <input
            type="text"
            name="govtIdNumber"
            value={formData.govtIdNumber}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
            placeholder="Enter your ID number"
          />
          {errors.govtIdNumber && <span className="text-red-500 text-sm">{errors.govtIdNumber}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-gray-200">Emergency Contact Name</label>
          <input
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
            placeholder="Enter emergency contact name"
          />
          {errors.emergencyContactName && <span className="text-red-500 text-sm">{errors.emergencyContactName}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-gray-200">Emergency Contact Number</label>
          <input
            type="tel"
            name="emergencyContactNumber"
            value={formData.emergencyContactNumber}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
            placeholder="Enter emergency contact number"
          />
          {errors.emergencyContactNumber && <span className="text-red-500 text-sm">{errors.emergencyContactNumber}</span>}
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
            className="w-4 h-4 text-orange-500 bg-black/50 border-gray-700 rounded focus:ring-orange-500"
          />
          <label className="text-gray-200">
            I agree to the <a href="/terms" className="text-orange-500 hover:text-orange-600">Terms and Conditions</a>
            and <a href="/privacy" className="text-orange-500 hover:text-orange-600">Privacy Policy</a>
          </label>
        </div>
        {errors.termsAgreed && <span className="text-red-500 text-sm">{errors.termsAgreed}</span>}
      </div>
    </div>
  );
};

Verification.propTypes = {
  formData: PropTypes.shape({
    govtIdType: PropTypes.string,
    govtIdNumber: PropTypes.string,
    emergencyContactName: PropTypes.string,
    emergencyContactNumber: PropTypes.string,
    termsAgreed: PropTypes.bool
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default Verification;
