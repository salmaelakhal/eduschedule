import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api';

// ── State initial ──
const initialState = {
  user: null,   // { id, fullName, email, role, subjectId?, classId? }
  isLoading: true,   // true pendant le checkSession au démarrage
  isAuth: false,
};

// ── Reducer ──
function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuth: true, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuth: false, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ── Context ──
const AuthContext = createContext(null);

// ── Provider ──
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier la session au démarrage (cookie encore valide ?)
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data } = await api.get('/auth/me');
      // getMe renvoie { success, data: user } (pas { data: { user } })
      dispatch({ type: 'SET_USER', payload: data.data });
    } catch {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    dispatch({ type: 'SET_USER', payload: data.data.user }); // ← data.data.user
    return data.data.user; // ← idem
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      dispatch({ type: 'LOGOUT' });
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}