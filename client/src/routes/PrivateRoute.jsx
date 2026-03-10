import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

// roles = tableau des rôles autorisés, ex: ['ADMIN']
export default function PrivateRoute({ children, roles }) {
  const { isLoading, isAuth, user } = useAuth();

  // Pendant le checkSession → spinner centré
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
      }}>
        <Spinner size="lg" />
      </div>
    );
  }

  // Pas authentifié ou user pas encore chargé → login
  if (!isAuth || !user) return <Navigate to="/login" replace />;

  // Pas le bon rôle → unauthorized
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}