import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Intercepteur de requête : ajoute automatiquement le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : gère les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expiré, redirection vers la page de session expirée...");
      window.location.href = '/session-expiree'; // Redirige vers la page de session expirée
    }
    return Promise.reject(error);
  }
);

export default api;
