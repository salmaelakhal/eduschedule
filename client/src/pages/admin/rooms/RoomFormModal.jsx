import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';

const EMPTY_FORM = { name: '', capacity: '' };

export default function RoomFormModal({ isOpen, onClose, onSubmit, editRoom, isLoading }) {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editRoom) {
      setForm({ name: editRoom.name, capacity: String(editRoom.capacity) });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editRoom, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                    e.name     = 'Le nom est requis.';
    if (!form.capacity || form.capacity <= 0) e.capacity = 'La capacité doit être supérieure à 0.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editRoom ? '✏️ Modifier la salle' : '🚪 Ajouter une salle'}
      isLoading={isLoading}
      size="sm"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
            {editRoom ? 'Enregistrer' : 'Créer'}
          </button>
        </>
      }
    >
      {/* Nom */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Nom de la salle *</label>
        <input
          name="name"
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="Ex: Amphi A"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p style={{ fontSize: 11, color: 'var(--color-accent3)', marginTop: 4 }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Capacité */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Capacité (places) *</label>
        <input
          name="capacity"
          type="number"
          min="1"
          className={`input ${errors.capacity ? 'input-error' : ''}`}
          placeholder="Ex: 30"
          value={form.capacity}
          onChange={handleChange}
        />
        {errors.capacity && (
          <p style={{ fontSize: 11, color: 'var(--color-accent3)', marginTop: 4 }}>
            {errors.capacity}
          </p>
        )}
      </div>
    </Modal>
  );
}