import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';

const AVAILABLE_STUDENTS = [
  { value: '6', label: 'Leila Ouali' },
  { value: '7', label: 'Mehdi Benhaddou' },
  { value: '8', label: 'Zineb Alami' },
];

export default function AddStudentModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    if (isOpen) setStudentId('');
  }, [isOpen]);

  const handleSubmit = () => {
    if (!studentId) return;
    onSubmit(studentId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="👨‍🎓 Ajouter un étudiant"
      isLoading={isLoading}
      size="sm"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isLoading || !studentId}
          >
            Ajouter
          </button>
        </>
      }
    >
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Sélectionner un étudiant</label>
        <select
          className="input"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{ appearance: 'none' }}
        >
          <option value="">Choisir un étudiant...</option>
          {AVAILABLE_STUDENTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </Modal>
  );
}