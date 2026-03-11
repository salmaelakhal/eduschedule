import { useState, Fragment } from 'react';
import { History, ChevronDown, ChevronUp, Calendar, BookOpen } from 'lucide-react';
import Spinner from '../../../components/ui/Spinner';
import { useScheduleLogs, useScheduleLogById } from '../../../hooks/useScheduleLogs';

const DAYS_ORDER = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
const DAYS_LABEL = { LUNDI: 'Lundi', MARDI: 'Mardi', MERCREDI: 'Mercredi', JEUDI: 'Jeudi', VENDREDI: 'Vendredi', SAMEDI: 'Samedi' };

const EVENT_COLORS = [
  { bg: 'rgba(108,99,255,0.2)',   border: 'var(--color-accent)',  text: 'var(--color-accent)'  },
  { bg: 'rgba(0,212,170,0.15)',   border: 'var(--color-accent2)', text: 'var(--color-accent2)' },
  { bg: 'rgba(255,107,107,0.15)', border: 'var(--color-accent3)', text: 'var(--color-accent3)' },
  { bg: 'rgba(255,200,100,0.15)', border: 'var(--color-warning)', text: 'var(--color-warning)' },
];

function getColor(subjectId) {
  return EVENT_COLORS[(subjectId - 1) % EVENT_COLORS.length];
}

function LogDetail({ logId }) {
  const { data: log, isLoading } = useScheduleLogById(logId);
  const [selectedClass, setSelectedClass] = useState(null);

  if (isLoading) return (
    <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
      <Spinner size="sm" />
    </div>
  );
  if (!log) return null;

  const schedules = Array.isArray(log.data) ? log.data : [];

  // Extraire classes uniques
  const classes = [];
  const seenClasses = new Set();
  for (const s of schedules) {
    if (s.class?.id && !seenClasses.has(s.class.id)) {
      seenClasses.add(s.class.id);
      classes.push(s.class);
    }
  }

  const activeClassId   = selectedClass ?? classes[0]?.id;
  const activeClassName = classes.find((c) => c.id === activeClassId)?.name;
  const filtered        = schedules.filter((s) => s.class?.id === activeClassId);

  // Extraire heures uniques
  const uniqueHours = [];
  const seenHours   = new Set();
  for (const s of schedules) {
    const key = `${s.timeSlot?.startTime}-${s.timeSlot?.endTime}`;
    if (!seenHours.has(key)) {
      seenHours.add(key);
      uniqueHours.push({ startTime: s.timeSlot?.startTime, endTime: s.timeSlot?.endTime });
    }
  }
  uniqueHours.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const findSeance = (day, startTime) =>
    filtered.find((s) => s.timeSlot?.day === day && s.timeSlot?.startTime === startTime) || null;

  return (
    <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>

      {/* Sélecteur classe */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {classes.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedClass(c.id)}
            className={activeClassId === c.id ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grille lecture seule */}
      <div className="schedule-grid-wrap">
        <div
          className="schedule-grid"
          style={{ gridTemplateColumns: `90px repeat(${uniqueHours.length}, 1fr)` }}
        >
          <div className="sg-header">Jour / Heure</div>
          {uniqueHours.map((h) => (
            <div key={h.startTime} className="sg-header">
              {h.startTime}–{h.endTime}
            </div>
          ))}

          {DAYS_ORDER.map((day) => (
            <Fragment key={day}>
              <div className="sg-day">{DAYS_LABEL[day]}</div>
              {uniqueHours.map((h) => {
                const seance = findSeance(day, h.startTime);
                const color  = seance ? getColor(seance.subject?.id) : null;
                return (
                  <div key={`${day}-${h.startTime}`} className="sg-cell" style={{ cursor: 'default' }}>
                    {seance && (
                      <div className="sg-event" style={{
                        background:  color.bg,
                        borderLeft:  `3px solid ${color.border}`,
                      }}>
                        <div className="sg-event-subject" style={{ color: color.text }}>
                          {seance.subject?.name}
                        </div>
                        <div className="sg-event-info">
                          👩‍🏫 {seance.teacher?.fullName?.split(' ').slice(-1)[0]}
                        </div>
                        <div className="sg-event-info">
                          {seance.isOnline ? '🌐 En ligne' : `🚪 ${seance.room?.name}`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Historique() {
  const { data: logs = [], isLoading } = useScheduleLogs();
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  if (isLoading) return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <Spinner size="md" />
    </div>
  );

  return (
    <div className="content-area">
      <div className="page-header">
        <div>
          <div className="page-title">
            <History size={20} style={{ color: 'var(--color-accent)' }} />
            Historique
          </div>
          <div className="page-sub">Archives des emplois du temps précédents</div>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">Aucune archive</div>
          <div className="empty-state-sub">Les emplois du temps archivés apparaîtront ici</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {logs.map((log) => (
            <div key={log.id} className="table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div
                onClick={() => toggle(log.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', cursor: 'pointer',
                  background: expandedId === log.id ? 'rgba(108,99,255,0.05)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(108,99,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Calendar size={16} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                      Semaine du {new Date(log.weekStart).toLocaleDateString('fr-FR')} au {new Date(log.weekEnd).toLocaleDateString('fr-FR')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text2)', marginTop: 2 }}>
                      Archivé le {new Date(log.archivedAt).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'rgba(0,212,170,0.1)', borderRadius: 6,
                    padding: '4px 10px', fontSize: 12,
                    color: 'var(--color-accent2)', fontWeight: 600,
                  }}>
                    <BookOpen size={12} />
                    {log.totalCount} séances
                  </div>
                  {expandedId === log.id
                    ? <ChevronUp size={16} style={{ color: 'var(--color-text2)' }} />
                    : <ChevronDown size={16} style={{ color: 'var(--color-text2)' }} />
                  }
                </div>
              </div>

              {/* Detail */}
              {expandedId === log.id && <LogDetail logId={log.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}