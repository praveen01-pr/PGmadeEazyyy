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
                target: { name: 'occupationType', value: 'student' }
              })}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                formData.occupationType === 'student'
                  ? 'border-orange-500 bg-black/80 text-white'
                  : 'border-gray-700 bg-black/60 text-gray-300 hover:border-orange-600'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleChange({
                target: { name: 'occupationType', value: 'professional' }
              })}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                formData.occupationType === 'professional'
                  ? 'border-orange-500 bg-black/80 text-white'
                  : 'border-gray-700 bg-black/60 text-gray-300 hover:border-orange-600'
              }`}
            >
              Working Professional
            </button>
          </div>
          {errors.occupationType && <span className="text-red-500 text-sm">{errors.occupationType}</span>}
        </div>

        {formData.occupationType === 'student' && (
          <>
            <div className="space-y-1">
              <label className="text-gray-200">College Name</label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
                placeholder="Enter your college name"
              />
              {errors.collegeName && <span className="text-red-500 text-sm">{errors.collegeName}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Course Name</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
                placeholder="Enter your course name"
              />
              {errors.courseName && <span className="text-red-500 text-sm">{errors.courseName}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Year of Study</label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
              {errors.yearOfStudy && <span className="text-red-500 text-sm">{errors.yearOfStudy}</span>}
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-gray-200">College Address</label>
              <textarea
                name="collegeAddress"
                value={formData.collegeAddress}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white h-24 resize-none"
                placeholder="Enter your college address"
              />
              {errors.collegeAddress && <span className="text-red-500 text-sm">{errors.collegeAddress}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Student ID (Optional)</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
                placeholder="Enter your student ID"
              />
            </div>
          </>
        )}

        {formData.occupationType === 'professional' && (
          <>
            <div className="space-y-1">
              <label className="text-gray-200">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
                placeholder="Enter your company name"
              />
              {errors.companyName && <span className="text-red-500 text-sm">{errors.companyName}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Job Role</label>
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
                placeholder="Enter your job role"
              />
              {errors.jobRole && <span className="text-red-500 text-sm">{errors.jobRole}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Work Experience (Years)</label>
              <select
                name="workExperience"
                value={formData.workExperience}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
              >
                <option value="">Select Experience</option>
                <option value="0">Fresher</option>
                <option value="1">1-2 Years</option>
                <option value="3">3-5 Years</option>
                <option value="5">5+ Years</option>
              </select>
              {errors.workExperience && <span className="text-red-500 text-sm">{errors.workExperience}</span>}
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-gray-200">Office Address</label>
              <textarea
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white h-24 resize-none"
                placeholder="Enter your office address"
              />
              {errors.officeAddress && <span className="text-red-500 text-sm">{errors.officeAddress}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-gray-200">Work ID (Optional)</label>
              <input
                type="text"
                name="workId"
                value={formData.workId}
                onChange={handleChange}
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-white"
                placeholder="Enter your work ID"
              />
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
    // Student fields
    collegeName: PropTypes.string,
    courseName: PropTypes.string,
    yearOfStudy: PropTypes.string,
    collegeAddress: PropTypes.string,
    studentId: PropTypes.string,
    // Professional fields
    companyName: PropTypes.string,
    jobRole: PropTypes.string,
    workExperience: PropTypes.string,
    officeAddress: PropTypes.string,
    workId: PropTypes.string
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    occupationType: PropTypes.string,
    // Student fields
    collegeName: PropTypes.string,
    courseName: PropTypes.string,
    yearOfStudy: PropTypes.string,
    collegeAddress: PropTypes.string,
    // Professional fields
    companyName: PropTypes.string,
    jobRole: PropTypes.string,
    workExperience: PropTypes.string,
    officeAddress: PropTypes.string
  })
};

export default OccupationDetails;
