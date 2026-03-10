import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';


// user et onLogout → passés en props pour l'instant
// on branchera AuthContext plus tard

// const MOCK_USER = {
//   fullName: 'Super Admin',
//   email:    'admin@eduschedule.com',
//   role:     'ADMIN',
// };

export default function AdminLayout() {

  const { user, logout } = useAuth();


 const handleLogout = () => logout();


  return (
    <div style={{
      display:   'flex',
      minHeight: '100vh',
      background:'var(--color-bg)',
    }}>

      {/* ── Sidebar ── */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* ── Main ── */}
      <div style={{
        flex:      1,
        display:   'flex',
        flexDirection: 'column',
        overflow:  'hidden',
        minWidth:  0,
      }}>
        <Header user={user} />

        {/* ── Page content ── */}
        <main style={{
          flex:       1,
          overflowY:  'auto',
          background: 'var(--color-bg)',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

