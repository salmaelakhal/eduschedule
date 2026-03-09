import { Routes, Route, Navigate } from 'react-router-dom';
import Login          from './pages/Login';
import AdminLayout    from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';

const Placeholder = ({ name }) => (
  <div style={{ padding: 28, color: 'var(--color-text2)', fontSize: 13 }}>
    📄 {name} — en cours...
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index              element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"   element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="classes"     element={<Placeholder name="Classes" />} />
        <Route path="classes/:id" element={<Placeholder name="Détail Classe" />} />
        <Route path="rooms"       element={<Placeholder name="Salles" />} />
        <Route path="subjects"    element={<Placeholder name="Matières" />} />
        <Route path="schedule"    element={<Placeholder name="Affectation" />} />
      </Route>

      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}