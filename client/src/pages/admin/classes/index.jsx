import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, CalendarDays } from 'lucide-react';
import Spinner          from '../../../components/ui/Spinner';
import ClassFormModal    from './ClassFormModal';
import ClassDeleteDialog from './ClassDeleteDialog';
import {
  useClasses, useCreateClass, useUpdateClass, useDeleteClass
} from '../../../hooks/useClasses';

export default function Classes() {
  const navigate = useNavigate();

  const [formOpen,    setFormOpen]    = useState(false);
  const [deleteOpen,  setDeleteOpen]  = useState(false);
  const [editClass,   setEditClass]   = useState(null);
  const [deleteClass, setDeleteClass] = useState(null);

  const { data: classes = [], isLoading } = useClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass_ = useDeleteClass();

  const openAdd = () => { setEditClass(null); setFormOpen(true); };
  const openEdit = (e, classe) => {
    e.stopPropagation();
    setEditClass(classe);
    setFormOpen(true);
  };
  const openDelete = (e, classe) => {
    e.stopPropagation();
    setDeleteClass(classe);
    setDeleteOpen(true);
  };

  const handleSubmit = async (form) => {
    if (editClass) {
      await updateClass.mutateAsync({ id: editClass.id, ...form });
    } else {
      await createClass.mutateAsync(form);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    await deleteClass_.mutateAsync(deleteClass.id);
    setDeleteOpen(false);
  };

  const isSubmitting = createClass.isPending || updateClass.isPending;
  const isDeleting   = deleteClass_.isPending;

  if (isLoading) return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <Spinner size="md" />
    </div>
  );

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button
          className="btn-primary"
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={14} /> Ajouter une classe
        </button>
      </div>

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap:                 14,
      }}>
        {classes.map((classe) => (
          <div
            key={classe.id}
            className="class-card"
            onClick={() => navigate(`/admin/classes/${classe.id}`)}
          >
            <div style={{
              fontSize: 15, fontWeight: 700,
              color: 'var(--color-text)', marginBottom: 6,
              fontFamily: 'var(--font-display)',
            }}>
              {classe.name}
            </div>

            {classe.description && (
              <div style={{ fontSize: 12, color: 'var(--color-text2)', marginBottom: 12 }}>
                {classe.description}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text2)' }}>
                <Users size={12} style={{ color: 'var(--color-accent)' }} />
                {classe._count?.enrollments ?? 0} étudiants
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text2)' }}>
                <CalendarDays size={12} style={{ color: 'var(--color-accent2)' }} />
                {classe._count?.schedules ?? 0} séances / sem.
              </div>
            </div>

            <div className="actions" style={{
              marginTop: 14, paddingTop: 12,
              borderTop: '1px solid var(--color-border)',
            }}>
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

        {/* Add card */}
        <div
          onClick={openAdd}
          style={{
            background: 'transparent', border: '1px dashed var(--color-border)',
            borderRadius: 12, padding: 20, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', minHeight: 140, color: 'var(--color-text2)',
            transition: 'all 0.2s', gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text2)'; }}
        >
          <Plus size={24} />
          <span style={{ fontSize: 12 }}>Nouvelle classe</span>
        </div>
      </div>

      <ClassFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editClass={editClass}
        isLoading={isSubmitting}
      />
      <ClassDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        className={deleteClass?.name || ''}
      />
    </div>
  );
}