import { useState, useEffect } from 'react';
import { FileDown }       from 'lucide-react';
import Spinner            from '../../../components/ui/Spinner';
import ScheduleGrid       from './ScheduleGrid';
import AddSeanceModal     from './AddSeanceModal';
import DeleteSeanceDialog from './DeleteSeanceDialog';
import { useClasses }     from '../../../hooks/useClasses';
import {
  useScheduleByClass,
  useTimeSlots,
  useCreateSchedule,
  useDeleteSchedule,
} from '../../../hooks/useSchedule';
import { useExportPDF } from '../../../hooks/useExportPDF';
import { useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { useManualReset } from '../../../hooks/useScheduleLogs';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';



export default function Schedule() {
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [addOpen,         setAddOpen]         = useState(false);
  const [deleteOpen,      setDeleteOpen]       = useState(false);
  const [prefilledDay,    setPrefilledDay]     = useState(null);
  const [prefilledSlot,   setPrefilledSlot]    = useState(null);
  const [deleteSeance,    setDeleteSeance]     = useState(null);

  const { data: classes   = [], isLoading: loadingClasses } = useClasses();
  const { data: timeSlots = [] }                            = useTimeSlots();
  const { data: schedules = [], isLoading: loadingSchedule } = useScheduleByClass(
    selectedClassId ?? classes[0]?.id
  );

  const [resetOpen, setResetOpen] = useState(false);
const manualReset = useManualReset();

  const createSchedule = useCreateSchedule();
  const deleteSchedule = useDeleteSchedule();

  // Classe active
  const activeClassId = selectedClassId ?? classes[0]?.id;
  const activeClass   = classes.find((c) => c.id === activeClassId);

  const gridRef = useRef(null); 
const { exportPDF } = useExportPDF();


useEffect(() => {
  if (!selectedClassId && classes.length > 0) {
    setSelectedClassId(classes[0].id);
  }
}, [classes]);



const handleReset = async () => {
  await manualReset.mutateAsync();
  setResetOpen(false);
};


  const handleCellClick = (day, slot) => {
    setPrefilledDay(day);
    setPrefilledSlot(slot);
    setAddOpen(true);
  };

  const handleDeleteClick = (seance) => {
    setDeleteSeance(seance);
    setDeleteOpen(true);
  };

  const handleAddSubmit = async (form) => {
    await createSchedule.mutateAsync(form);
    setAddOpen(false);
  };

  const handleDeleteConfirm = async () => {
    await deleteSchedule.mutateAsync(deleteSeance.id);
    setDeleteOpen(false);
  };

  if (loadingClasses) return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <Spinner size="md" />
    </div>
  );

  console.log('activeClassId:', activeClassId);
console.log('schedules:', schedules);

  return (
    <div className="content-area">

      {/* ── Class selector + export ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClassId(c.id)}
              className={activeClassId === c.id ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}
            >
              {c.name}
            </button>
          ))}
        </div>

<button
  className="btn-ghost"
  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
  onClick={() => exportPDF({
    schedules,
    timeSlots,
    title:    `Emploi du temps — ${activeClass?.name}`,
    subtitle: `Semaine en cours`,
    filename: `emploi-du-temps-${activeClass?.name}.pdf`,
  })}
>
  <FileDown size={14} /> Exporter PDF
</button>

{/*  Reset manuel */}
<button
  className="btn-danger btn-sm"
  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
  onClick={() => setResetOpen(true)}
>
  <RotateCcw size={14} /> Réinitialiser
</button>

<ConfirmDialog
  isOpen={resetOpen}
  onClose={() => setResetOpen(false)}
  onConfirm={handleReset}
  isLoading={manualReset.isPending}
  title="Réinitialiser l'emploi du temps"
  message="Toutes les séances seront archivées et supprimées. Cette action est irréversible."
/>

      </div>

      {/* ── Titre grille ── */}
      <div style={{
        fontSize: 13, fontWeight: 700, color: 'var(--color-text2)',
        marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ color: 'var(--color-accent)' }}>📅</span>
        Emploi du temps —
        <span style={{ color: 'var(--color-text)' }}>{activeClass?.name}</span>
        {loadingSchedule && <Spinner size="sm" />}
      </div>

      {/* ── Grille ── */}
      <ScheduleGrid
      ref={gridRef}
        schedules={schedules}
        timeSlots={timeSlots}
        onCellClick={handleCellClick}
        onDeleteSeance={handleDeleteClick}
      />

      {/* ── Modals ── */}
      <AddSeanceModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={createSchedule.isPending}
        prefilledDay={prefilledDay}
        prefilledSlot={prefilledSlot}
        classId={activeClassId}
      />
      <DeleteSeanceDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteSchedule.isPending}
        seance={deleteSeance}
      />
    </div>
  );
}