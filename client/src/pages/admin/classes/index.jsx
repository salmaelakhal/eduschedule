import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, CalendarDays } from 'lucide-react';
import ClassFormModal    from './ClassFormModal';
import ClassDeleteDialog from './ClassDeleteDialog';

const MOCK_CLASSES = [
  { id: 1, name: 'L1 Informatique', description: 'Licence 1ère année', students: 28, sessions: 12 },
  { id: 2, name: 'L2 Informatique', description: 'Licence 2ème année', students: 24, sessions: 14 },
  { id: 3, name: 'L3 Informatique', description: 'Licence 3ème année', students: 20, sessions: 10 },
  { id: 4, name: 'L2 Physique',     description: 'Licence 2 Physique', students: 22, sessions: 11 },
  { id: 5, name: 'M1 IA',           description: 'Master 1 IA',        students: 15, sessions: 16 },
];

export default function Classes() {
  const navigate = useNavigate();

  const [formOpen,    setFormOpen]    = useState(false);
  const [deleteOpen,  setDeleteOpen]  = useState(false);
  const [editClass,   setEditClass]   = useState(null);
  const [deleteClass, setDeleteClass] = useState(null);
  const [isLoading,   setIsLoading]   = useState(false);

  const openAdd = () => {
    setEditClass(null);
    setFormOpen(true);
  };

  const openEdit = (e, classe) => {
    e.stopPropagation(); // ← empêche la navigation vers le detail
    setEditClass(classe);
    setFormOpen(true);
  };

  const openDelete = (e, classe) => {
    e.stopPropagation();
    setDeleteClass(classe);
    setDeleteOpen(true);
  };

  const handleSubmit = (form) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFormOpen(false);
    }, 1000);
  };

  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDeleteOpen(false);
    }, 800);
  };

  return (
    <div className="content-area">

      {/* ── Header action ── */}
      <div style={{
        display:        'flex',
        justifyContent: 'flex-end',
        marginBottom:   20,
      }}>
        <button
          className="btn-primary"
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={14} /> Ajouter une classe
        </button>
      </div>

      {/* ── Cards grid ── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap:                 14,
      }}>
        {MOCK_CLASSES.map((classe) => (
          <div
            key={classe.id}
            className="class-card"
            onClick={() => navigate(`/admin/classes/${classe.id}`)}
          >
            {/* Nom */}
            <div style={{
              fontSize:     15,
              fontWeight:   700,
              color:        'var(--color-text)',
              marginBottom: 6,
              fontFamily:   'var(--font-display)',
            }}>
              {classe.name}
            </div>

            {/* Description */}
            {classe.description && (
              <div style={{
                fontSize:     12,
                color:        'var(--color-text2)',
                marginBottom: 12,
              }}>
                {classe.description}
              </div>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text2)' }}>
                <Users size={12} style={{ color: 'var(--color-accent)' }} />
                {classe.students} étudiants
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text2)' }}>
                <CalendarDays size={12} style={{ color: 'var(--color-accent2)' }} />
                {classe.sessions} séances / sem.
              </div>
            </div>

            {/* Actions */}
            <div
              className="actions"
              style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}
            >
              <button
                className="btn-ghost btn-sm"
                onClick={(e) => openEdit(e, classe)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}
              >
                <Pencil size={11} /> Modifier
              </button>
              <button
                className="btn-danger btn-sm"
                onClick={(e) => openDelete(e, classe)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}
              >
                <Trash2 size={11} /> Supprimer
              </button>
            </div>
          </div>
        ))}

        {/* ── Add card ── */}
        <div
          onClick={openAdd}
          style={{
            background:      'transparent',
            border:          '1px dashed var(--color-border)',
            borderRadius:    12,
            padding:         20,
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            cursor:          'pointer',
            minHeight:       140,
            color:           'var(--color-text2)',
            transition:      'all 0.2s',
            gap:             8,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-accent)';
            e.currentTarget.style.color = 'var(--color-accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text2)';
          }}
        >
          <Plus size={24} />
          <span style={{ fontSize: 12 }}>Nouvelle classe</span>
        </div>
      </div>

      {/* ── Modals ── */}
      <ClassFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editClass={editClass}
        isLoading={isLoading}
      />
      <ClassDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        className={deleteClass?.name || ''}
      />
    </div>
  );
}