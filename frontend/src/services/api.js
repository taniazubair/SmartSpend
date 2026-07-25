import axios from 'axios';

const API = axios.create({
  baseURL: 'https://smartspend-production-2753.up.railway.app', // Adjust if your backend runs on a different port
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add authorization token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;