import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import AddStudentModal    from './AddStudentModal';
import RemoveStudentDialog from './RemoveStudentDialog';

const MOCK_CLASS = {
  id:          2,
  name:        'L2 Informatique',
  description: 'Licence 2ème année Informatique',
};

const MOCK_STUDENTS = [
  { id: 1, fullName: 'Ahmed Tazi',           email: 'ahmed.tazi@eduschedule.com',     enrolledAt: '01/09/2024' },
  { id: 2, fullName: 'Fatima Zahra Idrissi', email: 'f.idrissi@eduschedule.com',       enrolledAt: '01/09/2024' },
  { id: 3, fullName: 'Omar Belhaj',          email: 'o.belhaj@eduschedule.com',        enrolledAt: '03/09/2024' },
];

export default function ClassDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();

  const [addOpen,    setAddOpen]    = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeStudent, setRemoveStudent] = useState(null);
  const [isLoading,  setIsLoading]  = useState(false);

  const openRemove = (student) => {
    setRemoveStudent(student);
    setRemoveOpen(true);
  };

  const handleAdd = (studentId) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAddOpen(false);
    }, 800);
  };

  const handleRemove = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRemoveOpen(false);
    }, 800);
  };

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="breadcrumb">
        <span
          className="breadcrumb-link"
          onClick={() => navigate('/admin/classes')}
        >
          🏫 Classes
        </span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--color-text)' }}>{MOCK_CLASS.name}</span>
      </div>

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <div className="page-title">{MOCK_CLASS.name}</div>
          <div className="page-sub">
            {MOCK_STUDENTS.length} étudiant{MOCK_STUDENTS.length > 1 ? 's' : ''} inscrit{MOCK_STUDENTS.length > 1 ? 's' : ''}
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

      {/* ── Table ── */}
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
              {MOCK_STUDENTS.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state-icon">👨‍🎓</div>
                      <div className="empty-state-title">Aucun étudiant inscrit</div>
                      <div className="empty-state-sub">
                        Ajoutez des étudiants à cette classe
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                MOCK_STUDENTS.map((student) => (
                  <tr key={student.id} className="tr">
                    <td className="td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width:          32,
                          height:         32,
                          borderRadius:   '50%',
                          background:     'linear-gradient(135deg, var(--color-accent3), #e05555)',
                          display:        'flex',
                          alignItems:     'center',
                          justifyContent: 'center',
                          fontSize:       11,
                          fontWeight:     700,
                          color:          'white',
                          flexShrink:     0,
                        }}>
                          {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{student.fullName}</span>
                      </div>
                    </td>
                    <td className="td" style={{ color: 'var(--color-text2)', fontSize: 12 }}>
                      {student.email}
                    </td>
                    <td className="td" style={{ color: 'var(--color-text2)', fontSize: 12 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                        {student.enrolledAt}
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
                ))
              )}
            </tbody>
          </table>

          {MOCK_STUDENTS.length > 0 && (
            <div style={{
              padding:   '12px 16px',
              borderTop: '1px solid var(--color-border)',
              fontSize:  12,
              color:     'var(--color-text2)',
            }}>
              {MOCK_STUDENTS.length} étudiant{MOCK_STUDENTS.length > 1 ? 's' : ''} inscrit{MOCK_STUDENTS.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <AddStudentModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        isLoading={isLoading}
      />
      <RemoveStudentDialog
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
        isLoading={isLoading}
        studentName={removeStudent?.fullName || ''}
      />
    </>
  );
}