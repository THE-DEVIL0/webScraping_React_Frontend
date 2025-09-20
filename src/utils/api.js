import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Health Check
export const checkHealth = () => api.get('/health');

// Scrapers API
export const scrapers = {
  // Amazon
  scrapeAmazon: (url, limit = 5) => 
    api.post('/scrapers/amazon', { url, limit }),

  // eBay
  scrapeEbay: (url, limit = 5) => 
    api.post('/scrapers/ebay', { url, limit }),

  // Shopify
  scrapeShopify: (url, limit = 5) => 
    api.post('/scrapers/shopify', { url, limit }),
};

// Background Removal API
export const background = {
  remove: (formData) => 
    axios.post(
      `${API_BASE_URL}/background/remove`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    ),

  checkStatus: (taskId) => 
    api.get(`/background/status/${taskId}`),

  getResults: (taskId) => 
    api.get(`/background/results/${taskId}`),
};

// Image Generation API
export const generation = {
  generate: (prompt, options = {}) => 
    api.post('/generate', { prompt, ...options }),

  checkStatus: (taskId) => 
    api.get(`/generate/status/${taskId}`),

  getResults: (taskId) => 
    api.get(`/generate/results/${taskId}`),
};

// Image Optimization API
export const optimization = {
  optimize: (formData) => 
    axios.post(
      `${API_BASE_URL}/optimize`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    ),

  checkStatus: (taskId) => 
    api.get(`/optimize/status/${taskId}`),

  getResults: (taskId) => 
    api.get(`/optimize/results/${taskId}`),
};

// Pipeline API
export const pipeline = {
  run: (pipelineConfig) => 
    api.post('/pipeline/run', pipelineConfig),

  checkStatus: (pipelineId) => 
    api.get(`/pipeline/status/${pipelineId}`),

  getResults: (pipelineId) => 
    api.get(`/pipeline/results/${pipelineId}`),
};

// Export all APIs as a single object
export default {
  checkHealth,
  scrapers,
  background,
  generation,
  optimization,
  pipeline,
};
