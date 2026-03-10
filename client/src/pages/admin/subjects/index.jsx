import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Spinner             from '../../../components/ui/Spinner';
import SubjectFormModal    from './SubjectFormModal';
import SubjectDeleteDialog from './SubjectDeleteDialog';
import {
  useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject
} from '../../../hooks/useSubjects';

const SUBJECT_ICONS = {
  'Mathématiques':     '📐',
  'Algorithmique':     '💻',
  'Physique':          '⚛️',
  'Anglais Technique': '🌐',
};

export default function Subjects() {
  const [formOpen,      setFormOpen]      = useState(false);
  const [deleteOpen,    setDeleteOpen]    = useState(false);
  const [editSubject,   setEditSubject]   = useState(null);
  const [deleteSubject, setDeleteSubject] = useState(null);

  const { data: subjects = [], isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject_ = useDeleteSubject();

  const openAdd    = () => { setEditSubject(null); setFormOpen(true); };
  const openEdit   = (s) => { setEditSubject(s); setFormOpen(true); };
  const openDelete = (s) => { setDeleteSubject(s); setDeleteOpen(true); };

  const handleSubmit = async (form) => {
    if (editSubject) {
      await updateSubject.mutateAsync({ id: editSubject.id, ...form });
    } else {
      await createSubject.mutateAsync(form);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    await deleteSubject_.mutateAsync(deleteSubject.id);
    setDeleteOpen(false);
  };

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
          <Plus size={14} /> Ajouter une matière
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {subjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-title">Aucune matière</div>
            <div className="empty-state-sub">Ajoutez votre première matière</div>
          </div>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id} className="subject-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--color-surface2)', border: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {SUBJECT_ICONS[subject.name] || '📚'}
                </div>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: 'var(--color-text)', fontFamily: 'var(--font-display)',
                  }}>
                    {subject.name}
                  </div>
                  {subject.description && (
                    <div style={{ fontSize: 12, color: 'var(--color-text2)', marginTop: 2 }}>
                      {subject.description}
                    </div>
                  )}
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    {subject.teacher ? (
                      <span style={{ color: 'var(--color-accent2)' }}>
                        👩‍🏫 {subject.teacher.fullName}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-accent3)' }}>
                        ⚠️ Aucun enseignant assigné
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => openEdit(subject)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Pencil size={12} /> Modifier
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => openDelete(subject)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <SubjectFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editSubject={editSubject}
        isLoading={createSubject.isPending || updateSubject.isPending}
      />
      <SubjectDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteSubject_.isPending}
        subjectName={deleteSubject?.name || ''}
      />
    </div>
  );
}