import axios from 'axios';

console.log('🔍 API URL:', import.meta.env.VITE_API_URL); // ← ajoute


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// ── Intercepteur requête ──
// Contourne la page d'avertissement ngrok en production
api.interceptors.request.use((config) => {
  config.headers['ngrok-skip-browser-warning'] = 'true';
  return config;
});

// ── Intercepteur réponse ──
// Si 401 → redirige vers /login (token expiré ou absent)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthMe = error.config?.url === '/auth/me';

    // Redirige seulement si c'est pas le checkSession
    if (error.response?.status === 401 && !isAuthMe) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
export default api;