// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2000/',
  // baseURL: 'https://manorama.adminportal.anganwaditest.co.in/',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Or from Redux
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
