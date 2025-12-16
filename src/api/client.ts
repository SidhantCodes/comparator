import axios from 'axios';

const API_BASE_URL = 'https://compare.akshayy.site';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to set auth token if you implement login later
export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const endpoints = {
  search: (page = 1, limit = 20) => 
    apiClient.get(`/phones/search?page=${page}&limit=${limit}`),
  
  compare: (ids: string[]) => 
    apiClient.get(`/phones/compare?ids=${ids.join(',')}`),
    
  getExpertRatings: (deviceId: string) => 
    apiClient.get(`/company_rate/${deviceId}`), // Requires Auth
};