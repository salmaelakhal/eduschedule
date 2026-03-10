import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import Spinner             from '../../../../components/ui/Spinner';
import AddStudentModal     from './AddStudentModal';
import RemoveStudentDialog from './RemoveStudentDialog';
import {
  useClass,
  useAddStudentToClass,
  useRemoveStudentFromClass,
} from '../../../../hooks/useClasses';
import { useUsers } from '../../../../hooks/useUsers';

export default function ClassDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [addOpen,       setAddOpen]       = useState(false);
  const [removeOpen,    setRemoveOpen]    = useState(false);
  const [removeStudent, setRemoveStudent] = useState(null);

  const { data: classe,   isLoading }  = useClass(id);
  const { data: allUsers = [] }        = useUsers();
  const addStudent    = useAddStudentToClass();
  const removeStudent_ = useRemoveStudentFromClass();

  // Étudiants déjà inscrits dans cette classe
  const enrolled = classe?.enrollments?.map(e => e.student) || [];

  // Étudiants disponibles = STUDENT pas encore dans cette classe
  const enrolledIds = enrolled.map(s => s.id);
  const availableStudents = allUsers.filter(
    u => u.role === 'STUDENT' && !enrolledIds.includes(u.id)
  );

  const openRemove = (student) => {
    setRemoveStudent(student);
    setRemoveOpen(true);
  };

  const handleAdd = async (studentId) => {
    await addStudent.mutateAsync({ classId: id, studentId });
    setAddOpen(false);
  };

  const handleRemove = async () => {
    await removeStudent_.mutateAsync({ classId: id, studentId: removeStudent.id });
    setRemoveOpen(false);
  };

  if (isLoading) return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <Spinner size="md" />
    </div>
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('/admin/classes')}>
          🏫 Classes
        </span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--color-text)' }}>{classe?.name}</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">{classe?.name}</div>
          <div className="page-sub">
            {enrolled.length} étudiant{enrolled.length > 1 ? 's' : ''} inscrit{enrolled.length > 1 ? 's' : ''}
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => setAddOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={14} /> Ajouter un étudiant
        </button>
      </div>

      {/* Table */}
      <div className="content-area">
        <div className="table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="th">Nom complet</th>
                <th className="th">Email</th>
                <th className="th">Inscrit le</th>
                <th className="th" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrolled.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state-icon">👨‍🎓</div>
                      <div className="empty-state-title">Aucun étudiant inscrit</div>
                      <div className="empty-state-sub">Ajoutez des étudiants à cette classe</div>
                    </div>
                  </td>
                </tr>
              ) : (
                enrolled.map((student) => {
                  const enrollment = classe.enrollments.find(e => e.student.id === student.id);
                  return (
                    <tr key={student.id} className="tr">
                      <td className="td">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-accent3), #e05555)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
                          }}>
                            {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500 }}>{student.fullName}</span>
                        </div>
                      </td>
                      <td className="td" style={{ color: 'var(--color-text2)', fontSize: 12 }}>
                        {student.email}
                      </td>
                      <td className="td">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text2)' }}>
                          {new Date(enrollment?.enrolledAt).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td className="td">
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => openRemove(student)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Trash2 size={11} /> Retirer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {enrolled.length > 0 && (
            <div style={{
              padding: '12px 16px', borderTop: '1px solid var(--color-border)',
              fontSize: 12, color: 'var(--color-text2)',
            }}>
              {enrolled.length} étudiant{enrolled.length > 1 ? 's' : ''} inscrit{enrolled.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <AddStudentModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        isLoading={addStudent.isPending}
        availableStudents={availableStudents}
      />
      <RemoveStudentDialog
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
        isLoading={removeStudent_.isPending}
        studentName={removeStudent?.fullName || ''}
      />
    </>
  );
}