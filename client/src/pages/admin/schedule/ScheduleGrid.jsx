import { Trash2 } from 'lucide-react';
import { Fragment } from 'react';
const DAYS_ORDER = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
const DAYS_LABEL = { LUNDI: 'Lundi', MARDI: 'Mardi', MERCREDI: 'Mercredi', JEUDI: 'Jeudi', VENDREDI: 'Vendredi', SAMEDI: 'Samedi' };

const EVENT_COLORS = [
  { bg: 'rgba(108,99,255,0.2)',   border: 'var(--color-accent)',  text: 'var(--color-accent)'  },
  { bg: 'rgba(0,212,170,0.15)',   border: 'var(--color-accent2)', text: 'var(--color-accent2)' },
  { bg: 'rgba(255,107,107,0.15)', border: 'var(--color-accent3)', text: 'var(--color-accent3)' },
  { bg: 'rgba(255,200,100,0.15)', border: 'var(--color-warning)', text: 'var(--color-warning)' },
];

function getEventColor(subjectId) {
  return EVENT_COLORS[(subjectId - 1) % EVENT_COLORS.length];
}

export default function ScheduleGrid({ schedules, timeSlots = [], onCellClick, onDeleteSeance }) {
console.log('SEANCE[0]:', JSON.stringify(schedules[0]));
  // Extraire les heures uniques (9 slots) depuis les 54
  const uniqueHours = [];
  const seen = new Set();
  for (const slot of timeSlots) {
    const key = `${slot.startTime}-${slot.endTime}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueHours.push({ startTime: slot.startTime, endTime: slot.endTime });
    }
  }

  // Trouver le slot par jour + heure
  const findSlot = (day, startTime) =>
    timeSlots.find((s) => s.day === day && s.startTime === startTime) || null;

  // Trouver une séance par timeSlotId
  const findSeance = (slotId) =>
  schedules.find((s) => s.timeSlot?.id === slotId) || null;


  return (
    <div className="schedule-grid-wrap">
      <div
        className="schedule-grid"
        style={{ gridTemplateColumns: `90px repeat(${uniqueHours.length}, 1fr)` }}
      >
        {/* Headers heures */}
        <div className="sg-header">Jour / Heure</div>
        {uniqueHours.map((h) => (
          <div key={h.startTime} className="sg-header">
            {h.startTime}–{h.endTime}
          </div>
        ))}

        {/* Rows par jour */}
        {DAYS_ORDER.map((day) => (
          <Fragment key={day}>
            <div className="sg-day">{DAYS_LABEL[day]}</div>
            {uniqueHours.map((h) => {
              const slot   = findSlot(day, h.startTime);
              const seance = slot ? findSeance(slot.id) : null;
const color = seance ? getEventColor(seance.subject?.id) : null;

              return (
                <div
                  key={`${day}-${h.startTime}`}
                  className="sg-cell"
                  onClick={() => !seance && slot && onCellClick(DAYS_LABEL[day], slot)}
                >
                  {seance ? (
                    <div
                      className="sg-event"
                      style={{ background: color.bg, borderLeft: `3px solid ${color.border}` }}
                    >
                      <div className="sg-event-subject" style={{ color: color.text }}>
                        {seance.subject?.name}
                      </div>
                      <div className="sg-event-info">
                        👩‍🏫 {seance.teacher?.fullName?.split(' ')[1] || seance.teacher?.fullName}
                      </div>
                      <div className="sg-event-info">
                        {seance.isOnline ? '🌐 En ligne' : `🚪 ${seance.room?.name}`}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSeance({
                            ...seance,
                            day:       DAYS_LABEL[day],
                            startTime: h.startTime,
                            endTime:   h.endTime,
                            subject:   seance.subject?.name,
                          });
                        }}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          background: 'rgba(255,107,107,0.15)',
                          border: '1px solid rgba(255,107,107,0.3)',
                          borderRadius: 4, padding: '2px 4px',
                          cursor: 'pointer', display: 'none',
                          color: 'var(--color-accent3)',
                        }}
                        className="sg-delete-btn"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="sg-add">＋</div>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>

      {/* Légende */}
      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--color-text2)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <span>💡 Cliquez sur une cellule vide pour ajouter une séance</span>
        {EVENT_COLORS.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              display: 'inline-block', width: 10, height: 10,
              borderRadius: 2, background: c.bg, border: `2px solid ${c.border}`,
            }} />
            Matière {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}