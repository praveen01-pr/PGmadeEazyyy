import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getCurrentUser: () => api.get('/api/auth/me'),
};

// Property API endpoints
export const propertyApi = {
  createProperty: (propertyData, config = {}) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return api.post('/api/properties', propertyData, config);
  },
  getProperties: () => api.get('/api/properties'),
  getProperty: (id) => api.get(`/api/properties/${id}`),
  updateProperty: (id, propertyData) => api.put(`/api/properties/${id}`, propertyData),
  deleteProperty: (id) => api.delete(`/api/properties/${id}`),
};

// Booking API endpoints
export const bookingApi = {
  createBooking: (bookingData) => api.post('/api/bookings', bookingData),
  getBookings: () => api.get('/api/bookings'),
  getBooking: (id) => api.get(`/api/bookings/${id}`),
  updateBooking: (id, bookingData) => api.put(`/api/bookings/${id}`, bookingData),
  cancelBooking: (id) => api.delete(`/api/bookings/${id}`),
};

// Profile API endpoints
export const profileApi = {
  getProfile: () => api.get('/api/profile'),
  updateProfile: (userData) => api.put('/api/profile', userData),
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Export the base API instance
export default api;
