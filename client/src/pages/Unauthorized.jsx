import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../context/AuthContext';
import { ShieldOff }   from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (!user) return navigate('/login');
    if (user.role === 'ADMIN')   return navigate('/admin/dashboard');
    if (user.role === 'TEACHER') return navigate('/teacher/dashboard');
    if (user.role === 'STUDENT') return navigate('/student/dashboard');
  };

  return (
    <div style={{
      minHeight:       '100vh',
      background:      'var(--color-bg)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      flexDirection:   'column',
      gap:             16,
    }}>
      {/* Icon */}
      <div style={{
        width:          72,
        height:         72,
        borderRadius:   20,
        background:     'rgba(255,107,107,0.1)',
        border:         '1px solid rgba(255,107,107,0.2)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <ShieldOff size={32} style={{ color: 'var(--color-accent3)' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize:   24,
          fontWeight: 700,
          color:      'var(--color-text)',
          marginBottom: 8,
        }}>
          Accès refusé
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text2)' }}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </div>
      </div>

      <button className="btn-primary" onClick={handleBack}>
        Retourner à mon espace
      </button>
    </div>
  );
}