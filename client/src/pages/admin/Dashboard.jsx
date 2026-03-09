import { Users, GraduationCap, DoorOpen, CalendarDays } from 'lucide-react';

const STATS = [
  { label: 'Utilisateurs',   value: '124', icon: Users,         color: 'var(--color-accent)',  bg: 'rgba(108,99,255,0.1)'  },
  { label: 'Classes',        value: '12',  icon: GraduationCap, color: 'var(--color-accent2)', bg: 'rgba(0,212,170,0.1)'   },
  { label: 'Salles',         value: '18',  icon: DoorOpen,      color: 'var(--color-accent3)', bg: 'rgba(255,107,107,0.1)' },
  { label: 'Séances / sem.', value: '86',  icon: CalendarDays,  color: 'var(--color-warning)', bg: 'rgba(255,200,100,0.1)' },
];

const TODAY_SESSIONS = [
  { time: '08:00–09:00', subject: 'Mathématiques', room: 'Amphi A',    classe: 'L2 Info'  },
  { time: '09:00–10:00', subject: 'Algorithmique', room: 'Salle B203', classe: 'L1 Info'  },
  { time: '10:00–11:00', subject: 'Anglais',       room: 'En ligne',   classe: 'L3 Info'  },
  { time: '13:00–14:00', subject: 'Physique',      room: 'Labo 1',     classe: 'L2 Phys.' },
];

export default function Dashboard() {
  return (
    <div className="content-area">

      {/* ── Stats ── */}
      <div className="grid-4">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="stat-card"
            onMouseEnter={e => e.currentTarget.style.borderColor = stat.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            {/* Barre colorée top */}
            <div style={{
              position:   'absolute',
              top: 0, left: 0, right: 0,
              height:     3,
              background: stat.color,
            }} />

            {/* Icône */}
            <div
              className="icon-box"
              style={{
                position:   'absolute',
                top:        16,
                right:      16,
                background: stat.bg,
              }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>

            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Bottom ── */}
      <div className="grid-2">

        {/* Séances aujourd'hui */}
        <div className="table-wrap">
          <div className="table-wrap-title">
            <CalendarDays size={15} style={{ color: 'var(--color-accent)' }} />
            Séances aujourd'hui
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="th">Heure</th>
                <th className="th">Matière</th>
                <th className="th">Salle</th>
                <th className="th">Classe</th>
              </tr>
            </thead>
            <tbody>
              {TODAY_SESSIONS.map((s, i) => (
                <tr key={i} className="tr">
                  <td className="td">
                    <span className="text-mono">{s.time}</span>
                  </td>
                  <td className="td" style={{ fontWeight: 500 }}>{s.subject}</td>
                  <td className="td" style={{
                    color: s.room === 'En ligne'
                      ? 'var(--color-accent2)'
                      : 'var(--color-text2)',
                    fontSize: 12,
                  }}>
                    {s.room === 'En ligne' ? '🌐 ' : '🚪 '}{s.room}
                  </td>
                  <td className="td" style={{ color: 'var(--color-text2)', fontSize: 12 }}>
                    {s.classe}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Conflits */}
        <div className="table-wrap">
          <div className="table-wrap-title">
            <span>⚠️</span>
            Conflits détectés
          </div>
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-title" style={{ color: 'var(--color-accent2)' }}>
              Aucun conflit détecté
            </div>
            <div className="empty-state-sub">
              L'emploi du temps est cohérent cette semaine
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}