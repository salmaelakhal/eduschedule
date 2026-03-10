import { useRef } from 'react';
import { FileDown, BookOpen, Users } from 'lucide-react';

const MOCK_TEACHER = {
  fullName: 'Sara Moussaoui',
  subject:  'Mathématiques',
  class:    'L2 Informatique',
};

const TIME_SLOTS = [
  { id: 1, startTime: '08:00', endTime: '09:00' },
  { id: 2, startTime: '09:00', endTime: '10:00' },
  { id: 3, startTime: '10:00', endTime: '11:00' },
  { id: 4, startTime: '11:00', endTime: '12:00' },
  { id: 5, startTime: '13:00', endTime: '14:00' },
  { id: 6, startTime: '14:00', endTime: '15:00' },
  { id: 7, startTime: '15:00', endTime: '16:00' },
  { id: 8, startTime: '16:00', endTime: '17:00' },
  { id: 9, startTime: '17:00', endTime: '18:00' },
];

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const MOCK_SCHEDULES = [
  { id: 1, day: 'Lundi',   timeSlotId: 1, subject: 'Mathématiques', class: 'L2 Info', room: 'Amphi A',  isOnline: false },
  { id: 2, day: 'Mardi',   timeSlotId: 5, subject: 'Mathématiques', class: 'L2 Info', room: 'B201',     isOnline: false },
  { id: 3, day: 'Jeudi',   timeSlotId: 2, subject: 'Mathématiques', class: 'L1 Info', room: '',         isOnline: true  },
  { id: 4, day: 'Vendredi',timeSlotId: 6, subject: 'Mathématiques', class: 'L3 Info', room: 'Amphi A',  isOnline: false },
];

const STATS = [
  { label: 'Séances / semaine', value: MOCK_SCHEDULES.length, icon: BookOpen, color: 'var(--color-accent2)' },
  { label: 'Classes assignées', value: 3,                     icon: Users,    color: 'var(--color-accent)'  },
];

export default function TeacherDashboard() {
  const gridRef = useRef(null);

  const findSeance = (day, slotId) =>
    MOCK_SCHEDULES.find((s) => s.day === day && s.timeSlotId === slotId) || null;

  const handleExportPDF = async () => {
    // ← on branchera jsPDF plus tard
    alert('Export PDF — coming soon');
  };

  return (
    <div className="content-area">

      {/* ── Stats ── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap:                 16,
        marginBottom:        24,
        maxWidth:            500,
      }}>
        {STATS.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{
              position:   'absolute',
              top: 0, left: 0, right: 0,
              height:     3,
              background: stat.color,
            }} />
            <div className="icon-box" style={{
              position:   'absolute',
              top:        16,
              right:      16,
              background: `${stat.color}20`,
            }}>
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── Header grille ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text2)' }}>
          <span style={{ color: 'var(--color-accent2)' }}>📅</span>
          {' '}Mon emploi du temps —{' '}
          <span style={{ color: 'var(--color-text)' }}>{MOCK_TEACHER.subject}</span>
        </div>
        <button
          className="btn-ghost"
          onClick={handleExportPDF}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FileDown size={14} /> Exporter PDF
        </button>
      </div>

      {/* ── Grille lecture seule ── */}
      <div ref={gridRef} className="schedule-grid-wrap">
        <div className="schedule-grid">

          {/* Headers */}
          <div className="sg-header">Jour / Heure</div>
          {TIME_SLOTS.map((slot) => (
            <div key={slot.id} className="sg-header">
              {slot.startTime}–{slot.endTime}
            </div>
          ))}

          {/* Rows */}
          {DAYS.map((day) => (
            <>
              <div key={`day-${day}`} className="sg-day">{day}</div>
              {TIME_SLOTS.map((slot) => {
                const seance = findSeance(day, slot.id);
                return (
                  <div
                    key={`${day}-${slot.id}`}
                    className="sg-cell"
                    style={{ cursor: 'default' }}
                  >
                    {seance && (
                      <div
                        className="sg-event"
                        style={{
                          background:  'rgba(0,212,170,0.15)',
                          borderLeft:  '3px solid var(--color-accent2)',
                        }}
                      >
                        <div className="sg-event-subject" style={{ color: 'var(--color-accent2)' }}>
                          {seance.subject}
                        </div>
                        <div className="sg-event-info">
                          🏫 {seance.class}
                        </div>
                        <div className="sg-event-info">
                          {seance.isOnline ? '🌐 En ligne' : `🚪 ${seance.room}`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* ── Légende ── */}
      <div style={{
        marginTop:  12,
        fontSize:   11,
        color:      'var(--color-text2)',
        display:    'flex',
        gap:        16,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            display:      'inline-block',
            width:        10, height: 10,
            borderRadius: 2,
            background:   'rgba(0,212,170,0.15)',
            border:       '2px solid var(--color-accent2)',
          }} />
          Séance assignée
        </span>
        <span>🌐 En ligne &nbsp;|&nbsp; 🚪 Présentiel</span>
      </div>
    </div>
  );
}