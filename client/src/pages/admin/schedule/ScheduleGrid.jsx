import { Trash2 } from 'lucide-react';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const TIME_SLOTS = [
  { id: 1,  startTime: '08:00', endTime: '09:00' },
  { id: 2,  startTime: '09:00', endTime: '10:00' },
  { id: 3,  startTime: '10:00', endTime: '11:00' },
  { id: 4,  startTime: '11:00', endTime: '12:00' },
  { id: 5,  startTime: '13:00', endTime: '14:00' },
  { id: 6,  startTime: '14:00', endTime: '15:00' },
  { id: 7,  startTime: '15:00', endTime: '16:00' },
  { id: 8,  startTime: '16:00', endTime: '17:00' },
  { id: 9,  startTime: '17:00', endTime: '18:00' },
];

// Couleur par index de matière
const EVENT_COLORS = [
  { bg: 'rgba(108,99,255,0.2)',  border: 'var(--color-accent)',  text: 'var(--color-accent)'  },
  { bg: 'rgba(0,212,170,0.15)',  border: 'var(--color-accent2)', text: 'var(--color-accent2)' },
  { bg: 'rgba(255,107,107,0.15)',border: 'var(--color-accent3)', text: 'var(--color-accent3)' },
  { bg: 'rgba(255,200,100,0.15)',border: 'var(--color-warning)', text: 'var(--color-warning)' },
];

function getEventColor(subjectId) {
  return EVENT_COLORS[(subjectId - 1) % EVENT_COLORS.length];
}

export default function ScheduleGrid({ schedules, onCellClick, onDeleteSeance }) {
  // Trouver une séance pour un jour + créneau donné
  const findSeance = (day, slotId) =>
    schedules.find((s) => s.day === day && s.timeSlotId === slotId) || null;

  return (
    <div className="schedule-grid-wrap">
      <div className="schedule-grid">

        {/* ── Headers heure ── */}
        <div className="sg-header">Jour / Heure</div>
        {TIME_SLOTS.map((slot) => (
          <div key={slot.id} className="sg-header">
            {slot.startTime}–{slot.endTime}
          </div>
        ))}

        {/* ── Rows par jour ── */}
        {DAYS.map((day) => (
          <>
            {/* Colonne jour */}
            <div key={`day-${day}`} className="sg-day">{day}</div>

            {/* Cellules */}
            {TIME_SLOTS.map((slot) => {
              const seance = findSeance(day, slot.id);
              const color  = seance ? getEventColor(seance.subjectId) : null;

              return (
                <div
                  key={`${day}-${slot.id}`}
                  className="sg-cell"
                  onClick={() => !seance && onCellClick(day, slot)}
                >
                  {seance ? (
                    // ── Séance existante ──
                    <div
                      className="sg-event"
                      style={{ background: color.bg, borderLeft: `3px solid ${color.border}` }}
                    >
                      <div className="sg-event-subject" style={{ color: color.text }}>
                        {seance.subject}
                      </div>
                      <div className="sg-event-info">
                        👩‍🏫 {seance.teacher}
                      </div>
                      <div className="sg-event-info">
                        {seance.isOnline ? '🌐 En ligne' : `🚪 ${seance.room}`}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSeance({ ...seance, day, startTime: slot.startTime, endTime: slot.endTime });
                        }}
                        style={{
                          position:   'absolute',
                          top:        4,
                          right:      4,
                          background: 'rgba(255,107,107,0.15)',
                          border:     '1px solid rgba(255,107,107,0.3)',
                          borderRadius: 4,
                          padding:    '2px 4px',
                          cursor:     'pointer',
                          display:    'none',
                          color:      'var(--color-accent3)',
                        }}
                        className="sg-delete-btn"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ) : (
                    // ── Cellule vide ──
                    <div className="sg-add">＋</div>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>

      {/* ── Légende ── */}
      <div style={{
        marginTop:  12,
        fontSize:   11,
        color:      'var(--color-text2)',
        display:    'flex',
        gap:        16,
        flexWrap:   'wrap',
      }}>
        <span>💡 Cliquez sur une cellule vide pour ajouter une séance</span>
        {EVENT_COLORS.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              display:      'inline-block',
              width:        10,
              height:       10,
              borderRadius: 2,
              background:   c.bg,
              border:       `2px solid ${c.border}`,
            }} />
            Matière {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}