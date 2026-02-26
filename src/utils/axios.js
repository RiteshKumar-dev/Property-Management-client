import axios from 'axios';
const PRODUCTION_API_BASE_URL = `https://property-management-server-ln36.onrender.com/API`;
const DEVELOPEMENT_API_BASE_URL = `http://localhost:5000/api`;

const api = axios.create({
  baseURL: PRODUCTION_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
