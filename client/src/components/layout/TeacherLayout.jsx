import { Outlet, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, CalendarDays } from 'lucide-react';

const MOCK_USER = {
  fullName: 'Sara Moussaoui',
  email:    'sara.moussaoui@eduschedule.com',
  role:     'TEACHER',
  subject:  'Mathématiques',
};

export default function TeacherLayout() {
  const navigate = useNavigate();

  const initials = MOCK_USER.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    console.log('logout');
  };

  return (
    <div style={{
      minHeight:  '100vh',
      background: 'var(--color-bg)',
      display:    'flex',
      flexDirection: 'column',
    }}>

      {/* ── Header ── */}
      <header style={{
        height:        64,
        background:    'var(--color-surface)',
        borderBottom:  '1px solid var(--color-border)',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
        padding:       '0 28px',
        position:      'sticky',
        top:           0,
        zIndex:        10,
      }}>

        {/* Left — Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width:          34,
            height:         34,
            borderRadius:   10,
            background:     'linear-gradient(135deg, var(--color-accent), var(--color-accent2))',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            boxShadow:      '0 4px 12px rgba(108,99,255,0.3)',
          }}>
            <GraduationCap size={18} color="white" />
          </div>
          <div>
            <div style={{
              fontFamily:    'var(--font-display)',
              fontSize:      14,
              fontWeight:    700,
              color:         'var(--color-accent)',
              letterSpacing: '-0.3px',
            }}>
              EduSchedule
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text2)' }}>
              Espace Enseignant
            </div>
          </div>
        </div>

        {/* Center — Nav */}
        <nav style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => navigate('/teacher/dashboard')}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          6,
              padding:      '7px 14px',
              borderRadius: 8,
              background:   'rgba(108,99,255,0.12)',
              border:       'none',
              color:        'var(--color-accent)',
              fontSize:     13,
              fontWeight:   600,
              cursor:       'pointer',
              fontFamily:   'var(--font-body)',
            }}
          >
            <CalendarDays size={14} />
            Mon emploi du temps
          </button>
        </nav>

        {/* Right — User + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Subject badge */}
          <div style={{
            background:   'rgba(0,212,170,0.1)',
            border:       '1px solid rgba(0,212,170,0.2)',
            borderRadius: 20,
            padding:      '4px 12px',
            fontSize:     11,
            fontWeight:   600,
            color:        'var(--color-accent2)',
          }}>
            📚 {MOCK_USER.subject}
          </div>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width:          34,
              height:         34,
              borderRadius:   '50%',
              background:     'linear-gradient(135deg, var(--color-accent2), #00a884)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       12,
              fontWeight:     700,
              color:          'white',
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>
                {MOCK_USER.fullName}
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text2)' }}>
                Enseignant
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            style={{
              background:   'transparent',
              border:       '1px solid var(--color-border)',
              borderRadius: 8,
              width:        34,
              height:       34,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              cursor:       'pointer',
              color:        'var(--color-text2)',
              transition:   'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-accent3)';
              e.currentTarget.style.color = 'var(--color-accent3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text2)';
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}