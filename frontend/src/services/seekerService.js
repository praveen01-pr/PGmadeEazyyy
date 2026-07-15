import api from './api';

export const seekerService = {
  // Get seeker profile details
  getSeekerProfile: async (seekerId) => {
    try {
      const response = await api.get(`/api/seekers/${seekerId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seeker profile:', error);
      throw error;
    }
  },

  // Update seeker profile
  updateSeekerProfile: async (seekerId, profileData) => {
    try {
      const response = await api.put(`/api/seekers/${seekerId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating seeker profile:', error);
      throw error;
    }
  }
};