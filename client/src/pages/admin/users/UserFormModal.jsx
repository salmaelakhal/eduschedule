import { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';

const EMPTY_FORM = {
  fullName:  '',
  email:     '',
  password:  '',
  role:      '',
  subjectId: '',
  classId:   '',
};

// Données statiques — on branchera l'API plus tard
const SUBJECTS = [
  { value: '1', label: 'Mathématiques' },
  { value: '2', label: 'Algorithmique' },
  { value: '3', label: 'Anglais Technique' },
];

const CLASSES = [
  { value: '1', label: 'L1 Informatique' },
  { value: '2', label: 'L2 Informatique' },
  { value: '3', label: 'L3 Informatique' },
];

export default function UserFormModal({ isOpen, onClose, onSubmit, editUser, isLoading }) {
  const [form, setForm] = useState(EMPTY_FORM);

  // Remplir le form si edit
  useEffect(() => {
    if (editUser) {
      setForm({
        fullName:  editUser.fullName,
        email:     editUser.email,
        password:  '',
        role:      editUser.role,
        subjectId: editUser.subjectId || '',
        classId:   editUser.classId   || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editUser, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.fullName || !form.email || (!editUser && !form.password) || !form.role) return;
    onSubmit(form);
  };

  const isEdit = Boolean(editUser);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? '✏️ Modifier l\'utilisateur' : '👤 Ajouter un utilisateur'}
      isLoading={isLoading}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
            {isEdit ? 'Enregistrer' : 'Créer'}
          </button>
        </>
      }
    >
      {/* Nom */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Nom complet *</label>
        <input
          name="fullName"
          className="input"
          placeholder="Ex: Ahmed Tazi"
          value={form.fullName}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Email *</label>
        <input
          name="email"
          type="email"
          className="input"
          placeholder="ahmed@eduschedule.com"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">
          Mot de passe {isEdit ? '(laisser vide pour ne pas changer)' : '*'}
        </label>
        <input
          name="password"
          type="password"
          className="input"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      {/* Role */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label">Rôle *</label>
        <select
          name="role"
          className="input"
          value={form.role}
          onChange={handleChange}
          style={{ appearance: 'none' }}
        >
          <option value="">Sélectionner un rôle</option>
          <option value="ADMIN">Admin</option>
          <option value="TEACHER">Enseignant</option>
          <option value="STUDENT">Étudiant</option>
        </select>
      </div>

      {/* Matière si TEACHER */}
      {form.role === 'TEACHER' && (
        <div style={{ marginBottom: 14, animation: 'slideUp 0.2s ease' }}>
          <label className="form-label">Matière assignée</label>
          <select
            name="subjectId"
            className="input"
            value={form.subjectId}
            onChange={handleChange}
            style={{ appearance: 'none' }}
          >
            <option value="">Sélectionner une matière</option>
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Classe si STUDENT */}
      {form.role === 'STUDENT' && (
        <div style={{ marginBottom: 14, animation: 'slideUp 0.2s ease' }}>
          <label className="form-label">Classe assignée</label>
          <select
            name="classId"
            className="input"
            value={form.classId}
            onChange={handleChange}
            style={{ appearance: 'none' }}
          >
            <option value="">Sélectionner une classe</option>
            {CLASSES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      )}
    </Modal>
  );
}