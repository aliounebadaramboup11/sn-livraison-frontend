import axios from 'axios';

const api = axios.create({
  // On utilise l'URL de production de Render
  baseURL: 'https://sn-livraison-backend.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expiré, redirection vers la page de session expirée...");
      window.location.href = '/session-expiree';
    }
    return Promise.reject(error);
  }
);

export default api;
