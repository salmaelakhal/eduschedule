import { useState } from 'react';
import { FileDown } from 'lucide-react';
import ScheduleGrid      from './ScheduleGrid';
import AddSeanceModal    from './AddSeanceModal';
import DeleteSeanceDialog from './DeleteSeanceDialog';

const CLASSES = [
  { id: 1, name: 'L1 Informatique' },
  { id: 2, name: 'L2 Informatique' },
  { id: 3, name: 'L3 Informatique' },
  { id: 4, name: 'L2 Physique' },
  { id: 5, name: 'M1 IA' },
];

// Données mock
const MOCK_SCHEDULES = [
  { id: 1, day: 'Lundi',  timeSlotId: 1, subjectId: 1, subject: 'Mathématiques', teacher: 'S. Moussaoui', room: 'Amphi A',  isOnline: false },
  { id: 2, day: 'Lundi',  timeSlotId: 3, subjectId: 2, subject: 'Algorithmique', teacher: 'N. El Fassi',  room: 'Info 1',   isOnline: false },
  { id: 3, day: 'Mardi',  timeSlotId: 2, subjectId: 4, subject: 'Anglais Tech.', teacher: 'H. Kettani',   room: '',         isOnline: true  },
  { id: 4, day: 'Mardi',  timeSlotId: 5, subjectId: 1, subject: 'Mathématiques', teacher: 'S. Moussaoui', room: 'B201',     isOnline: false },
  { id: 5, day: 'Mercredi',timeSlotId:3, subjectId: 2, subject: 'Algorithmique', teacher: 'N. El Fassi',  room: 'Info 1',   isOnline: false },
];

export default function Schedule() {
  const [selectedClass,  setSelectedClass]  = useState(CLASSES[1]);
  const [addOpen,        setAddOpen]        = useState(false);
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [prefilledDay,   setPrefilledDay]   = useState(null);
  const [prefilledSlot,  setPrefilledSlot]  = useState(null);
  const [deleteSeance,   setDeleteSeance]   = useState(null);
  const [isLoading,      setIsLoading]      = useState(false);

  // Clic sur cellule vide → ouvrir modal add
  const handleCellClick = (day, slot) => {
    setPrefilledDay(day);
    setPrefilledSlot(slot);
    setAddOpen(true);
  };

  // Clic sur supprimer séance
  const handleDeleteClick = (seance) => {
    setDeleteSeance(seance);
    setDeleteOpen(true);
  };

  const handleAddSubmit = (form) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAddOpen(false);
    }, 1000);
  };

  const handleDeleteConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDeleteOpen(false);
    }, 800);
  };

  return (
    <div className="content-area">

      {/* ── Class selector + export ── */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   20,
        flexWrap:       'wrap',
        gap:            12,
      }}>
        {/* Class pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CLASSES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClass(c)}
              className={selectedClass.id === c.id ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Export PDF */}
        <button
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FileDown size={14} /> Exporter PDF
        </button>
      </div>

      {/* ── Titre grille ── */}
      <div style={{
        fontSize:     13,
        fontWeight:   700,
        color:        'var(--color-text2)',
        marginBottom: 12,
        display:      'flex',
        alignItems:   'center',
        gap:          8,
      }}>
        <span style={{ color: 'var(--color-accent)' }}>📅</span>
        Emploi du temps —
        <span style={{ color: 'var(--color-text)' }}>{selectedClass.name}</span>
      </div>

      {/* ── Grille ── */}
      <ScheduleGrid
        schedules={MOCK_SCHEDULES}
        onCellClick={handleCellClick}
        onDeleteSeance={handleDeleteClick}
      />

      {/* ── Modals ── */}
      <AddSeanceModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={isLoading}
        prefilledDay={prefilledDay}
        prefilledSlot={prefilledSlot}
      />
      <DeleteSeanceDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
        seance={deleteSeance}
      />
    </div>
  );
}