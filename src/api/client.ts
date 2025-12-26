import axios from 'axios';

const API_BASE_URL = 'https://compare.akshayy.site';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Attach token to every request
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Global auth failure handling
 * Logs user out on token expiry / invalid token
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    signup: (data: any) => apiClient.post('/auth/signup', data),
    login: (data: any) => apiClient.post('/auth/login', data),
    profile: () => apiClient.get('/auth/profile'),
  },
  searchAll: (page = 1, limit = 20) =>
    apiClient.get(`/search?page=${page}&limit=${limit}`),
  search: (category: string = 'phone', page = 1, limit = 20) =>
    apiClient.get(`/${category}/search?page=${page}&limit=${limit}`),
  compare: (ids: string[]) =>
    apiClient.get(`/phones/compare?ids=${ids.join(',')}`),
  getExpertRatings: (deviceId: string) =>
    apiClient.get(`/company_rate/${deviceId}`),
  updateAffiliate: (id: string, retailer: 'amazon' | 'flipkart', url: string) =>
    apiClient.patch(`/phones/${id}/affiliate/${retailer}`, { url }),
};
