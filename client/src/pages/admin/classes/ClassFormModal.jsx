import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';

const EMPTY_FORM = { name: '', description: '' };

export default function ClassFormModal({ isOpen, onClose, onSubmit, editClass, isLoading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editClass) {
      setForm({ name: editClass.name, description: editClass.description || '' });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editClass, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Le nom est requis.';
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
      title={editClass ? '✏️ Modifier la classe' : '🏫 Ajouter une classe'}
      isLoading={isLoading}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
            {editClass ? 'Enregistrer' : 'Créer'}
          </button>
        </>
      }
    >
      {/* Nom */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Nom de la classe *</label>
        <input
          name="name"
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="Ex: L2 Informatique"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p style={{ fontSize: 11, color: 'var(--color-accent3)', marginTop: 4 }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Description */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Description (optionnel)</label>
        <input
          name="description"
          className="input"
          placeholder="Ex: Licence 2ème année Informatique"
          value={form.description}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
}