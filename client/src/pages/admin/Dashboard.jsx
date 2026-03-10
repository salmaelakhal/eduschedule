import {
  Users, GraduationCap, DoorOpen, CalendarDays,
  BookOpen, UserCheck, School,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import Spinner    from '../../components/ui/Spinner';
import { useStats } from '../../hooks/useStats';

const PIE_COLORS = [
  'var(--color-accent)',
  'var(--color-accent2)',
  'var(--color-accent3)',
  'var(--color-warning)',
  '#a78bfa',
  '#34d399',
];

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  const STATS = [
    { label: 'Utilisateurs',   value: stats?.totalUsers     ?? '—', icon: Users,        color: 'var(--color-accent)',  bg: 'rgba(108,99,255,0.1)'  },
    { label: 'Classes',        value: stats?.totalClasses   ?? '—', icon: GraduationCap, color: 'var(--color-accent2)', bg: 'rgba(0,212,170,0.1)'   },
    { label: 'Salles',         value: stats?.totalRooms     ?? '—', icon: DoorOpen,      color: 'var(--color-accent3)', bg: 'rgba(255,107,107,0.1)' },
    { label: 'Séances / sem.', value: stats?.totalSchedules ?? '—', icon: CalendarDays,  color: 'var(--color-warning)', bg: 'rgba(255,200,100,0.1)' },
    { label: 'Enseignants',    value: stats?.totalTeachers  ?? '—', icon: UserCheck,     color: 'var(--color-accent2)', bg: 'rgba(0,212,170,0.1)'   },
    { label: 'Étudiants',      value: stats?.totalStudents  ?? '—', icon: BookOpen,      color: 'var(--color-accent)',  bg: 'rgba(108,99,255,0.1)'  },
    { label: 'Matières',       value: stats?.totalSubjects  ?? '—', icon: School,        color: 'var(--color-accent3)', bg: 'rgba(255,107,107,0.1)' },
  ];

  return (
    <div className="content-area">

      {/* Stats cards */}
      <div className="grid-4">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="stat-card"
            onMouseEnter={e => e.currentTarget.style.borderColor = stat.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stat.color }} />
            <div className="icon-box" style={{ position: 'absolute', top: 16, right: 16, background: stat.bg }}>
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{isLoading ? <Spinner size="sm" /> : stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginTop: 24 }}>

        {/* Line Chart */}
        <div className="table-wrap">
          <div className="table-wrap-title">
            <CalendarDays size={15} style={{ color: 'var(--color-accent)' }} />
            Séances par jour
          </div>
          {isLoading ? (
            <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}><Spinner size="sm" /></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats?.schedulesByDay || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text2)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text2)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--color-text)' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Séances"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-accent)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="table-wrap">
          <div className="table-wrap-title">
            <BookOpen size={15} style={{ color: 'var(--color-accent2)' }} />
            Séances par matière
          </div>
          {isLoading ? (
            <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}><Spinner size="sm" /></div>
          ) : stats?.schedulesBySubject?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">Aucune donnée</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.schedulesBySubject || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(stats?.schedulesBySubject || []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: 'var(--color-text2)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="grid-2" style={{ marginTop: 24 }}>

        {/* Séances aujourd'hui */}
        <div className="table-wrap">
          <div className="table-wrap-title">
            <CalendarDays size={15} style={{ color: 'var(--color-accent)' }} />
            Séances aujourd'hui
          </div>
          {isLoading ? (
            <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}><Spinner size="sm" /></div>
          ) : stats?.todaySchedules?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">Aucune séance aujourd'hui</div>
            </div>
          ) : (
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
                {stats?.todaySchedules?.map((s, i) => (
                  <tr key={i} className="tr">
                    <td className="td"><span className="text-mono">{s.timeSlot.startTime}–{s.timeSlot.endTime}</span></td>
                    <td className="td" style={{ fontWeight: 500 }}>{s.subject.name}</td>
                    <td className="td" style={{ color: s.isOnline ? 'var(--color-accent2)' : 'var(--color-text2)', fontSize: 12 }}>
                      {s.isOnline ? '🌐 En ligne' : `🚪 ${s.room?.name}`}
                    </td>
                    <td className="td" style={{ color: 'var(--color-text2)', fontSize: 12 }}>{s.class.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Conflits */}
        <div className="table-wrap">
          <div className="table-wrap-title"><span>⚠️</span> Conflits détectés</div>
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-title" style={{ color: 'var(--color-accent2)' }}>Aucun conflit détecté</div>
            <div className="empty-state-sub">L'emploi du temps est cohérent cette semaine</div>
          </div>
        </div>

      </div>
    </div>
  );
}