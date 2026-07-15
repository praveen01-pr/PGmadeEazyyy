import PropTypes from 'prop-types';

const OccupationDetails = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Occupation Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1">
          <label className="text-gray-200">Occupation Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleChange({
                target: { name: 'occupationType', value: 'business' }
              })}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                formData.occupationType === 'business'
                  ? 'border-orange-500 bg-black/80 text-white'
                  : 'border-gray-700 bg-black/60 text-gray-300 hover:border-orange-600'
              }`}
            >
              Business Owner
            </button>
            <button
              type="button"
              onClick={() => handleChange({
                target: { name: 'occupationType', value: 'individual' }
              })}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                formData.occupationType === 'individual'
                  ? 'border-orange-500 bg-black/80 text-white'
                  : 'border-gray-700 bg-black/60 text-gray-300 hover:border-orange-600'
              }`}
            >
              Individual Owner
            </button>
          </div>
          {errors.occupationType && <span className="text-red-500 text-sm">{errors.occupationType}</span>}
        </div>

        {formData.occupationType === 'business' && (
          <>
            <div className="space-y-1">
              <label className="text-gray-200">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
                placeholder="Enter your business name"
              />
              {errors.businessName && <span className="text-red-500 text-sm">{errors.businessName}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
              >
                <option value="">Select Business Type</option>
                <option value="hostel">Hostel</option>
                <option value="pg">Paying Guest</option>
                <option value="apartment">Apartment Complex</option>
              </select>
              {errors.businessType && <span className="text-red-500 text-sm">{errors.businessType}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Years in Business</label>
              <select
                name="yearsInBusiness"
                value={formData.yearsInBusiness}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
              >
                <option value="">Select Experience</option>
                <option value="0">Less than 1 Year</option>
                <option value="1">1-3 Years</option>
                <option value="3">3-5 Years</option>
                <option value="5">5+ Years</option>
              </select>
              {errors.yearsInBusiness && <span className="text-red-500 text-sm">{errors.yearsInBusiness}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">GST Number (Optional)</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
                placeholder="Enter your GST number"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-gray-200">Business Address</label>
              <textarea
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white h-24 resize-none"
                placeholder="Enter your business address"
              />
              {errors.businessAddress && <span className="text-red-500 text-sm">{errors.businessAddress}</span>}
            </div>
          </>
        )}

        {formData.occupationType === 'individual' && (
          <>
            <div className="space-y-1">
              <label className="text-gray-200">Property Type</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
              >
                <option value="">Select Property Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
              </select>
              {errors.propertyType && <span className="text-red-500 text-sm">{errors.propertyType}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Years as Owner</label>
              <select
                name="yearsAsOwner"
                value={formData.yearsAsOwner}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
              >
                <option value="">Select Experience</option>
                <option value="0">Less than 1 Year</option>
                <option value="1">1-3 Years</option>
                <option value="3">3-5 Years</option>
                <option value="5">5+ Years</option>
              </select>
              {errors.yearsAsOwner && <span className="text-red-500 text-sm">{errors.yearsAsOwner}</span>}
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-gray-200">Property Address</label>
              <textarea
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white h-24 resize-none"
                placeholder="Enter your property address"
              />
              {errors.propertyAddress && <span className="text-red-500 text-sm">{errors.propertyAddress}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

OccupationDetails.propTypes = {
  formData: PropTypes.shape({
    occupationType: PropTypes.string,
    // Business fields
    businessName: PropTypes.string,
    businessType: PropTypes.string,
    yearsInBusiness: PropTypes.string,
    gstNumber: PropTypes.string,
    businessAddress: PropTypes.string,
    // Individual fields
    propertyType: PropTypes.string,
    yearsAsOwner: PropTypes.string,
    propertyAddress: PropTypes.string
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    occupationType: PropTypes.string,
    // Business fields
    businessName: PropTypes.string,
    businessType: PropTypes.string,
    yearsInBusiness: PropTypes.string,
    businessAddress: PropTypes.string,
    // Individual fields
    propertyType: PropTypes.string,
    yearsAsOwner: PropTypes.string,
    propertyAddress: PropTypes.string
  })
};

export default OccupationDetails;
