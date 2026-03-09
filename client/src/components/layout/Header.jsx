import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Badge from '../ui/Badge';

const PAGE_TITLES = {
  '/admin/dashboard': { title: 'Dashboard',    sub: 'Vue d\'ensemble du système' },
  '/admin/users':     { title: 'Utilisateurs', sub: 'Gestion de tous les comptes' },
  '/admin/classes':   { title: 'Classes',      sub: 'Gestion des groupes d\'étudiants' },
  '/admin/rooms':     { title: 'Salles',       sub: 'Gestion des espaces disponibles' },
  '/admin/subjects':  { title: 'Matières',     sub: 'Liste des matières enseignées' },
  '/admin/schedule':  { title: 'Affectation',  sub: 'Gestion de l\'emploi du temps' },
};

export default function Header({ user }) {
  const { pathname } = useLocation();

  // Gérer aussi /admin/classes/:id
  const key = pathname.startsWith('/admin/classes/')
    ? '/admin/classes'
    : pathname;

  const page = PAGE_TITLES[key] || { title: 'EduSchedule', sub: '' };

  return (
    <header style={{
      height:        60,
      background:    'var(--color-surface)',
      borderBottom:  '1px solid var(--color-border)',
      display:       'flex',
      alignItems:    'center',
      justifyContent:'space-between',
      padding:       '0 28px',
      flexShrink:    0,
      position:      'sticky',
      top:           0,
      zIndex:        10,
    }}>

      {/* ── Titre page ── */}
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize:   16,
          fontWeight: 700,
          color:      'var(--color-text)',
        }}>
          {page.title}
        </h1>
        {page.sub && (
          <p style={{ fontSize: 11, color: 'var(--color-text2)', marginTop: 1 }}>
            {page.sub}
          </p>
        )}
      </div>

      {/* ── Right side ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Notif bell — placeholder */}
        <button style={{
          background:   'transparent',
          border:       '1px solid var(--color-border)',
          borderRadius: 8,
          width:        34,
          height:       34,
          display:      'flex',
          alignItems:   'center',
          justifyContent:'center',
          cursor:       'pointer',
          color:        'var(--color-text2)',
          transition:   'all 0.2s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
            e.currentTarget.style.color = 'var(--color-accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text2)';
          }}
        >
          <Bell size={15} />
        </button>

        {/* Role badge */}
        {user?.role && <Badge role={user.role} />}
      </div>
    </header>
  );
}