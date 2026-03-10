import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Spinner from './components/ui/Spinner';

import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

import AdminLayout from './components/layout/AdminLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import StudentLayout from './components/layout/StudentLayout';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/users';
import AdminClasses from './pages/admin/classes';
import AdminClassDetail from './pages/admin/classes/detail';
import AdminRooms from './pages/admin/rooms';
import AdminSubjects from './pages/admin/subjects';
import AdminSchedule from './pages/admin/schedule';

import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';

// Redirection intelligente à la racine selon le rôle
function RootRedirect() {
  const { isLoading, isAuth, user } = useAuth();

  if (isLoading) return (
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

  if (!isAuth || !user) return <Navigate to="/login" replace />; // ← !user ajouté

  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
  if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>

      {/* ── Public ── */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/admin/login" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/teacher/login" element={<Navigate to="/teacher/dashboard" replace />} />
      <Route path="/student/login" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Admin ── */}
      <Route path="/admin" element={
        <PrivateRoute roles={['ADMIN']}>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="classes/:id" element={<AdminClassDetail />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="schedule" element={<AdminSchedule />} />
      </Route>

      {/* ── Teacher ── */}
      <Route path="/teacher" element={
        <PrivateRoute roles={['TEACHER']}>
          <TeacherLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
      </Route>

      {/* ── Student ── */}
      <Route path="/student" element={
        <PrivateRoute roles={['STUDENT']}>
          <StudentLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
      </Route>

      {/* ── Root ── */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}