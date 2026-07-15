import api from './api';

export const providerService = {
  // Get provider profile details
  getProviderProfile: async (providerId) => {
    try {
      const response = await api.get(`/api/providers/${providerId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider profile:', error);
      throw error;
    }
  },

  // Update provider profile
  updateProviderProfile: async (providerId, profileData) => {
    try {
      const response = await api.put(`/api/providers/${providerId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating provider profile:', error);
      throw error;
    }
  }
}; 