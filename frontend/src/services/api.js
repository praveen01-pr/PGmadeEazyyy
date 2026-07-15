import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

// Export the axios instance as default
export default api;

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Property API methods
export const propertyApi = {
  createProperty: async (formData) => {
    try {
      console.log('Sending request to create property');
      const response = await api.post('/api/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Property creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server response:', error.response.data);
        // Extract the actual error message from the response
        const message = error.response.data?.message || 
                       error.response.data?.error || 
                       'Failed to create property';
        throw new Error(message);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        throw new Error('Error setting up the request');
      }
    }
  },

  updateProperty: async (id, formData) => {
    try {
      const response = await api.put(`/api/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getProperty: async (id) => {
    try {
      const response = await api.get(`/api/properties/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllProperties: async () => {
    try {
      const response = await api.get('/api/properties');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getRejectedProperties: async () => {
    try {
      const response = await api.get('/api/admin/properties/rejected');
      return response.data;
    } catch (error) {
      console.error('Error fetching rejected properties:', error);
      throw error;
    }
  },

  deleteProperty: async (id) => {
    try {
      await api.delete(`/api/properties/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPendingProperties: async () => {
    try {
      const response = await api.get('/api/properties/pending');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getApprovedProperties: async () => {
    try {
      const response = await api.get('/api/properties/approved');
      return response.data;
    } catch (error) {
      console.error('Error fetching approved properties:', error);
      throw handleApiError(error);
    }
  },

  approveProperty: async (id, approvalNote) => {
    try {
      const formData = new FormData();
      formData.append('approvalNote', approvalNote);
      const response = await api.post(`/api/properties/${id}/approve`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  rejectProperty: async (id, rejectionReason) => {
    try {
      const formData = new FormData();
      formData.append('rejectionReason', rejectionReason);
      const response = await api.post(`/api/properties/${id}/reject`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPropertiesByOwner: async (ownerEmail) => {
    try {
      const response = await api.get(`/api/properties/owner/email/${encodeURIComponent(ownerEmail)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching properties by owner:', error);
      throw handleApiError(error);
    }
  }
};

// Admin API methods
export const adminApi = {
  getStats: async () => {
    try {
      console.log('Making API call to /api/admin/stats');
      const response = await api.get('/api/admin/stats');
      console.log('API response:', response);
      if (!response.data) {
        console.error('No data in API response');
        throw new Error('No data in API response');
      }
      return response.data;
    } catch (error) {
      console.error('Error in adminApi.getStats:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      }
      throw handleApiError(error);
    }
  },

  getProviders: async () => {
    try {
      const response = await api.get('/api/admin/providers');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getSeekers: async () => {
    try {
      const response = await api.get('/api/admin/seekers');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Booking API methods
export const bookingApi = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/api/bookings', bookingData);
      return response;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  getSeekerBookings: async (seekerId) => {
    try {
      const response = await api.get(`/api/bookings/seeker/${seekerId}`);
      
      if (!response || !response.data) {
        throw new Error('Invalid response format');
      }

      // Ensure we have an array of bookings
      const bookings = Array.isArray(response.data) 
        ? response.data 
        : [response.data];

      return bookings;
    } catch (error) {
      console.error('Error fetching seeker bookings:', error);
      throw error;
    }
  },

  getPropertyBookings: async (propertyId) => {
    const response = await api.get(`/api/bookings/property/${propertyId}`);
    return response.data;
  },

  getBookingById: async (bookingId) => {
    const response = await api.get(`/api/bookings/${bookingId}`);
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      console.log('Updating booking status:', { bookingId, status });
      const response = await api.put(`/api/bookings/${bookingId}/status?status=${status}`);
      console.log('Booking status update response:', response);
      return response.data;
    } catch (error) {
      console.error('Booking status update failed:', error);
      throw error;
    }
  },

  updatePaymentStatus: async (bookingId, status) => {
    const response = await api.put(`/api/bookings/${bookingId}/payment-status?status=${status}`);
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/api/bookings/payments', paymentData);
    return response.data;
  },

  getBookingPayments: async (bookingId) => {
    const response = await api.get(`/api/bookings/payments/booking/${bookingId}`);
    return response.data;
  },

  getSeekerPayments: async (seekerId) => {
    const response = await api.get(`/api/bookings/payments/seeker/${seekerId}`);
    return response.data;
  },

  updatePaymentStatus: async (paymentId, status) => {
    const response = await api.put(`/api/bookings/payments/${paymentId}/status?status=${status}`);
    return response.data;
  },

  createPayPalPayment: async (paymentData) => {
    try {
      console.log('Creating PayPal payment with data:', paymentData);
      const response = await api.post('/api/bookings/payments/paypal', paymentData);
      console.log('PayPal payment response:', response);
      return response;
    } catch (error) {
      console.error('PayPal payment creation failed:', error);
      throw error;
    }
  },

  executePayPalPayment: async (paymentId, PayerID) => {
    try {
      console.log('Executing PayPal payment:', { paymentId, PayerID });
      const response = await api.get(`/api/bookings/payments/paypal/success`, {
        params: { paymentId, PayerID }
      });
      console.log('PayPal payment execution response:', response);
      return response.data;
    } catch (error) {
      console.error('PayPal payment execution failed:', error);
      throw error;
    }
  },

  getAvailableRooms: async (propertyId, checkInDate, checkOutDate) => {
    try {
      const response = await api.get(`/api/bookings/available-rooms`, {
        params: {
          propertyId,
          checkInDate,
          checkOutDate
        }
      });
      return response;
    } catch (error) {
      console.error('Error getting available rooms:', error);
      throw error;
    }
  }
};

// Seeker API methods
export const seekerApi = {
  getFavorites: async (seekerId) => {
    try {
      const response = await api.get(`/api/seekers/${seekerId}/favorites`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  toggleFavorite: async (seekerId, propertyId) => {
    try {
      const response = await api.put(`/api/seekers/${seekerId}/favorites/${propertyId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Chat API methods
export const chatApi = {
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/api/chat/send', messageData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getHistory: async (seekerId, providerId, propertyId) => {
    try {
      const response = await api.get('/api/chat/history', {
        params: { seekerId, providerId, propertyId }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getInbox: async (userId, role) => {
    try {
      const response = await api.get(`/api/chat/inbox/${userId}`, {
        params: { role }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Review API methods
export const reviewApi = {
  getReviews: async (propertyId) => {
    try {
      const response = await api.get(`/api/properties/${propertyId}/reviews`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createReview: async (propertyId, reviewData) => {
    try {
      const response = await api.post(`/api/properties/${propertyId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Error handling helper
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data?.message || 'An error occurred';
    return new Error(message);
  } else if (error.request) {
    // The request was made but no response was received
    return new Error('No response received from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    return new Error('Error setting up the request');
  }
};