import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SubjectFormModal    from './SubjectFormModal';
import SubjectDeleteDialog from './SubjectDeleteDialog';

const SUBJECT_ICONS = {
  'Mathématiques':    '📐',
  'Algorithmique':    '💻',
  'Physique':         '⚛️',
  'Anglais Technique':'🌐',
};

const MOCK_SUBJECTS = [
  { id: 1, name: 'Mathématiques',    description: 'Algèbre et analyse',         teacher: 'Sara Moussaoui' },
  { id: 2, name: 'Algorithmique',    description: 'Structures de données',      teacher: 'Nadia El Fassi' },
  { id: 3, name: 'Physique',         description: 'Mécanique et thermodynamique', teacher: null },
  { id: 4, name: 'Anglais Technique','description': 'Communication en anglais', teacher: 'Hassan Kettani' },
];

export default function Subjects() {
  const [formOpen,       setFormOpen]       = useState(false);
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [editSubject,    setEditSubject]    = useState(null);
  const [deleteSubject,  setDeleteSubject]  = useState(null);
  const [isLoading,      setIsLoading]      = useState(false);

  const openAdd = () => {
    setEditSubject(null);
    setFormOpen(true);
  };

  const openEdit = (subject) => {
    setEditSubject(subject);
    setFormOpen(true);
  };

  const openDelete = (subject) => {
    setDeleteSubject(subject);
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button
          className="btn-primary"
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={14} /> Ajouter une matière
        </button>
      </div>

      {/* ── Subject list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MOCK_SUBJECTS.map((subject) => (
          <div key={subject.id} className="subject-item">

            {/* Left — icon + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Icon box */}
              <div style={{
                width:          44,
                height:         44,
                borderRadius:   12,
                background:     'var(--color-surface2)',
                border:         '1px solid var(--color-border)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontSize:       20,
                flexShrink:     0,
              }}>
                {SUBJECT_ICONS[subject.name] || '📚'}
              </div>

              {/* Info */}
              <div>
                <div style={{
                  fontSize:   14,
                  fontWeight: 600,
                  color:      'var(--color-text)',
                  fontFamily: 'var(--font-display)',
                }}>
                  {subject.name}
                </div>
                {subject.description && (
                  <div style={{ fontSize: 12, color: 'var(--color-text2)', marginTop: 2 }}>
                    {subject.description}
                  </div>
                )}
                <div style={{
                  fontSize:   11,
                  marginTop:  4,
                  display:    'flex',
                  alignItems: 'center',
                  gap:        4,
                }}>
                  {subject.teacher ? (
                    <span style={{ color: 'var(--color-accent2)' }}>
                      👩‍🏫 {subject.teacher}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-accent3)' }}>
                      ⚠️ Aucun enseignant assigné
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right — actions */}
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
        ))}

        {/* ── Empty state ── */}
        {MOCK_SUBJECTS.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-title">Aucune matière</div>
            <div className="empty-state-sub">Ajoutez votre première matière</div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <SubjectFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editSubject={editSubject}
        isLoading={isLoading}
      />
      <SubjectDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        subjectName={deleteSubject?.name || ''}
      />
    </div>
  );
}