import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PublicRoute redirects authenticated users to their dashboard based on role.
// If not authenticated, it renders the children (e.g., the Login page).
export default function PublicRoute({ children }) {
  const { isLoading, isAuth, user } = useAuth();

  if (isLoading) {
    // while checking session we can simply render nothing or a spinner –
    // the Login component already handles a loading state, so return null.
    return null;
  }

  if (isAuth && user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    // fallback
    return <Navigate to="/login" replace />;
  }

  return children;
}
