import axios from 'axios';
//https://property-management-server-ln36.onrender.com
//http://localhost:5000/api
const api = axios.create({
  baseURL: 'https://property-management-server-ln36.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
