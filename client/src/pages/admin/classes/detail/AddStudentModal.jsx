import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';

export default function AddStudentModal({
  isOpen, onClose, onSubmit, isLoading, availableStudents = []
}) {
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    if (isOpen) setStudentId('');
  }, [isOpen]);

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
            onClick={() => onSubmit(studentId)}
            disabled={isLoading || !studentId}
          >
            Ajouter
          </button>
        </>
      }
    >
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Sélectionner un étudiant</label>
        {availableStudents.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--color-text2)', padding: '10px 0' }}>
            Aucun étudiant disponible à ajouter.
          </div>
        ) : (
          <select
            className="input"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ appearance: 'none' }}
          >
            <option value="">Choisir un étudiant...</option>
            {availableStudents.map((s) => (
              <option key={s.id} value={s.id}>{s.fullName}</option>
            ))}
          </select>
        )}
      </div>
    </Modal>
  );
}