import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição: anexa JWT token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gestao_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de Resposta: tratamento de 401 Unauthorized limpo
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('gestao_token');
    localStorage.removeItem('gestao_usuario');
  }
  return Promise.reject(error);
});

export default api;
