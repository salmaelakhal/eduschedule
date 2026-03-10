import axios from 'axios';

const api = axios.create({
  baseURL:         '/api',
  withCredentials: true, // ← envoie les cookies HttpOnly automatiquement
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