import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Generate code from prompt
 */
export const generateCode = async (prompt, language, userId = null) => {
  try {
    const payload = {
      prompt,
      language
    };
    
    // Only include userId if it's provided
    if (userId !== null && userId !== undefined) {
      payload.userId = userId;
    }
    
    const response = await api.post('/generate', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to generate code' };
  }
};

/**
 * Get generation history with pagination
 */
export const getHistory = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters
    };
    const response = await api.get('/history', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch history' };
  }
};

/**
 * Get supported languages
 */
export const getLanguages = async () => {
  try {
    const response = await api.get('/languages');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch languages' };
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'API is not available' };
  }
};

export default api;
