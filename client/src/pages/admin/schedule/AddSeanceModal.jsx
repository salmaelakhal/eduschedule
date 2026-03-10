import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { useSubjects } from '../../../hooks/useSubjects';
import { useRooms }    from '../../../hooks/useRooms';
import { useUsers }    from '../../../hooks/useUsers';

const EMPTY_FORM = {
  subjectId: '',
  teacherId: '',
  roomId:    '',
  isOnline:  false,
};

export default function AddSeanceModal({
  isOpen, onClose, onSubmit, isLoading,
  prefilledDay, prefilledSlot, classId,
}) {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const { data: subjects = [] } = useSubjects();
  const { data: rooms    = [] } = useRooms();
  const { data: users    = [] } = useUsers();

  // Enseignants filtrés par matière sélectionnée
const teachers = users.filter(
  (u) => u.role === 'TEACHER' &&
  (!form.subjectId || 
    u.subjectId === Number(form.subjectId) ||
    u.subject?.id === Number(form.subjectId)  // ← ajoute ça
  )
);

  useEffect(() => {
    if (isOpen) { setForm(EMPTY_FORM); setErrors({}); }
  }, [isOpen]);

  // Quand on change la matière → reset enseignant
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setForm((prev) => ({
      ...prev,
      [name]:      value,
      ...(name === 'subjectId' ? { teacherId: '' } : {}),
    }));
  };

  const toggleOnline = () => {
    setForm((prev) => ({ ...prev, isOnline: !prev.isOnline, roomId: '' }));
    setErrors((prev) => ({ ...prev, roomId: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.subjectId)                e.subjectId = 'Matière requise.';
    if (!form.teacherId)                e.teacherId = 'Enseignant requis.';
    if (!form.isOnline && !form.roomId) e.roomId    = 'Salle requise.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      classId:    Number(classId),
      subjectId:  Number(form.subjectId),
      teacherId:  Number(form.teacherId),
      roomId:     form.isOnline ? null : Number(form.roomId),
      isOnline:   form.isOnline,
      timeSlotId: prefilledSlot?.id,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📅 Ajouter une séance"
      isLoading={isLoading}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
            Enregistrer
          </button>
        </>
      }
    >
      {/* Créneau préselectionné */}
      {prefilledDay && prefilledSlot && (
        <div style={{
          background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16,
          fontSize: 12, color: 'var(--color-accent)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          📅 <strong>{prefilledDay}</strong> — {prefilledSlot.startTime} à {prefilledSlot.endTime}
        </div>
      )}

      {/* Matière */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Matière *</label>
        <select
          name="subjectId"
          className={`input ${errors.subjectId ? 'input-error' : ''}`}
          value={form.subjectId}
          onChange={handleChange}
          style={{ appearance: 'none' }}
        >
          <option value="">Sélectionner une matière</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.subjectId && (
          <p style={{ fontSize: 11, color: 'var(--color-accent3)', marginTop: 4 }}>
            {errors.subjectId}
          </p>
        )}
      </div>

      {/* Enseignant */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Enseignant *</label>
        <select
          name="teacherId"
          className={`input ${errors.teacherId ? 'input-error' : ''}`}
          value={form.teacherId}
          onChange={handleChange}
          style={{ appearance: 'none' }}
          disabled={!form.subjectId}
        >
          <option value="">
            {!form.subjectId
              ? 'Sélectionnez d\'abord une matière'
              : teachers.length === 0
              ? 'Aucun enseignant pour cette matière'
              : 'Sélectionner un enseignant'}
          </option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.fullName}</option>
          ))}
        </select>
        {errors.teacherId && (
          <p style={{ fontSize: 11, color: 'var(--color-accent3)', marginTop: 4 }}>
            {errors.teacherId}
          </p>
        )}
      </div>

      {/* Toggle online */}
      <div className="toggle-wrap" onClick={toggleOnline}>
        <div className={`toggle ${form.isOnline ? 'on' : ''}`} />
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
          🌐 Séance à distance (en ligne)
        </span>
      </div>

      {/* Salle */}
      {!form.isOnline && (
        <div style={{ marginBottom: 14, animation: 'slideUp 0.2s ease' }}>
          <label className="form-label">Salle *</label>
          <select
            name="roomId"
            className={`input ${errors.roomId ? 'input-error' : ''}`}
            value={form.roomId}
            onChange={handleChange}
            style={{ appearance: 'none' }}
          >
            <option value="">Sélectionner une salle</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.capacity} places)
              </option>
            ))}
          </select>
          {errors.roomId && (
            <p style={{ fontSize: 11, color: 'var(--color-accent3)', marginTop: 4 }}>
              {errors.roomId}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}