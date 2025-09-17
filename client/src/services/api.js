import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL+'/api' || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Cars API calls
export const carAPI = {
  // Get all cars with optional query parameters
  getAll: (params = {}) => {
    // Convert array parameters to the format expected by the backend
    const processedParams = { ...params };
    
    // Handle array parameters (e.g., make: ['Toyota', 'Honda'] -> make: 'Toyota,Honda')
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedParams[key] = value.join(',');
      }
    });
    
    return api.get('/cars', { params: processedParams });
  },
  
  // Get a single car by ID
  getById: (id) => api.get(`/cars/${id}`),
  
  // Search cars with keyword
  search: (keyword, params = {}) => 
    api.get('/cars', { params: { keyword, ...params } }),
};

export default api;