import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';

const TEACHERS = [
  { value: '2', label: 'Sara Moussaoui',  subject: '1' },
  { value: '3', label: 'Nadia El Fassi',  subject: '2' },
  { value: '4', label: 'Hassan Kettani',  subject: '4' },
];

const SUBJECTS = [
  { value: '1', label: 'Mathématiques' },
  { value: '2', label: 'Algorithmique' },
  { value: '3', label: 'Physique' },
  { value: '4', label: 'Anglais Technique' },
];

const ROOMS = [
  { value: '1', label: 'Amphi A (200 places)' },
  { value: '2', label: 'Salle Info 1 (30 places)' },
  { value: '3', label: 'Labo 1 (25 places)' },
  { value: '4', label: 'Salle B201 (40 places)' },
];

const EMPTY_FORM = {
  subjectId:  '',
  teacherId:  '',
  roomId:     '',
  isOnline:   false,
};

export default function AddSeanceModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  prefilledDay,
  prefilledSlot,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const e = {};
    if (!form.subjectId)              e.subjectId = 'Matière requise.';
    if (!form.teacherId)              e.teacherId = 'Enseignant requis.';
    if (!form.isOnline && !form.roomId) e.roomId  = 'Salle requise pour une séance en présentiel.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleOnline = () => {
    setForm((prev) => ({ ...prev, isOnline: !prev.isOnline, roomId: '' }));
    setErrors((prev) => ({ ...prev, roomId: '' }));
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
          background:   'rgba(108,99,255,0.1)',
          border:       '1px solid rgba(108,99,255,0.2)',
          borderRadius: 8,
          padding:      '10px 14px',
          marginBottom: 16,
          fontSize:     12,
          color:        'var(--color-accent)',
          display:      'flex',
          alignItems:   'center',
          gap:          8,
        }}>
          📅 <strong>{prefilledDay}</strong> —
          {prefilledSlot.startTime} à {prefilledSlot.endTime}
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
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
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
        >
          <option value="">Sélectionner un enseignant</option>
          {TEACHERS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
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

      {/* Salle — seulement si présentiel */}
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
            {ROOMS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
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