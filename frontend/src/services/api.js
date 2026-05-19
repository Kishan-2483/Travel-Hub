import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

// Payments API
export const paymentsAPI = {
  initiate: (data) => api.post('/payments/initiate', data),
  confirm: (data) => api.post('/payments/confirm', data),
};

// Reviews API
export const reviewsAPI = {
  getByListing: (listingId) => api.get(`/reviews/listing/${listingId}`),
  create: (data) => api.post('/reviews', data),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// Chat API
export const chatAPI = {
  getMessages: (roomId) => api.get(`/chat/${roomId}`),
  sendMessage: (data) => api.post('/chat/send', data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  getListings: () => api.get('/admin/listings'),
};

// Fraud API
export const fraudAPI = {
  getReports: (params) => api.get('/fraud/reports', { params }),
  createReport: (data) => api.post('/fraud/reports', data),
  updateReport: (id, data) => api.put(`/fraud/reports/${id}`, data),
  analyze: (userId) => api.post('/fraud/analyze', { user_id: userId }),
};

export default api;
