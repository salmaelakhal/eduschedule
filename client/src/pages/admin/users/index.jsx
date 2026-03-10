import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import UserFormModal   from './UserFormModal';
import UserDeleteDialog from './UserDeleteDialog';

const MOCK_USERS = [
  { id: 1, fullName: 'Super Admin',    email: 'admin@eduschedule.com',          role: 'ADMIN',   extra: '—' },
  { id: 2, fullName: 'Sara Moussaoui', email: 'sara.moussaoui@eduschedule.com', role: 'TEACHER', extra: 'Mathématiques' },
  { id: 3, fullName: 'Nadia El Fassi', email: 'nadia.elfassi@eduschedule.com',  role: 'TEACHER', extra: 'Algorithmique' },
  { id: 4, fullName: 'Ahmed Tazi',     email: 'ahmed.tazi@eduschedule.com',     role: 'STUDENT', extra: 'L2 Informatique' },
  { id: 5, fullName: 'Youssef Chami',  email: 'y.chami@eduschedule.com',        role: 'STUDENT', extra: 'L1 Informatique' },
];

const ROLES = [
  { value: '',        label: 'Tous les rôles' },
  { value: 'ADMIN',   label: 'Admin' },
  { value: 'TEACHER', label: 'Enseignant' },
  { value: 'STUDENT', label: 'Étudiant' },
];

export default function Users() {
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('');
  const [formOpen,    setFormOpen]    = useState(false);
  const [deleteOpen,  setDeleteOpen]  = useState(false);
  const [editUser,    setEditUser]    = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);
  const [isLoading,   setIsLoading]   = useState(false);

  // ── Filtrage ──
  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAdd = () => {
    setEditUser(null);
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSubmit = (form) => {
    setIsLoading(true);
    // ← API plus tard
    setTimeout(() => {
      setIsLoading(false);
      setFormOpen(false);
    }, 1000);
  };

  const handleDelete = () => {
    setIsLoading(true);
    // ← API plus tard
    setTimeout(() => {
      setIsLoading(false);
      setDeleteOpen(false);
    }, 800);
  };

  return (
    <div className="content-area">
      <div className="table-wrap">

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{
              position: 'absolute', left: 10,
              top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text3)',
            }} />
            <input
              className="search-input"
              style={{ paddingLeft: 32 }}
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select
              className="input"
              style={{ width: 150, paddingRight: 32, appearance: 'none' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <ChevronDown size={12} style={{
              position: 'absolute', right: 10,
              top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text2)', pointerEvents: 'none',
            }} />
          </div>

          <button
            className="btn-primary"
            onClick={openAdd}
            style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>

        {/* ── Table ── */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th className="th">Nom complet</th>
              <th className="th">Email</th>
              <th className="th">Rôle</th>
              <th className="th">Classe / Matière</th>
              <th className="th" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <div className="empty-state-icon">👤</div>
                    <div className="empty-state-title">Aucun utilisateur trouvé</div>
                    <div className="empty-state-sub">
                      Modifiez votre recherche ou ajoutez un utilisateur
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="tr">
                  <td className="td">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width:          32,
                        height:         32,
                        borderRadius:   '50%',
                        background:
                          user.role === 'ADMIN'   ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))' :
                          user.role === 'TEACHER' ? 'linear-gradient(135deg, var(--color-accent2), #00a884)' :
                                                    'linear-gradient(135deg, var(--color-accent3), #e05555)',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        fontSize:       11,
                        fontWeight:     700,
                        color:          'white',
                        flexShrink:     0,
                      }}>
                        {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{user.fullName}</span>
                    </div>
                  </td>
                  <td className="td" style={{ color: 'var(--color-text2)', fontSize: 12 }}>
                    {user.email}
                  </td>
                  <td className="td"><Badge role={user.role} /></td>
                  <td className="td" style={{ color: 'var(--color-text2)', fontSize: 12 }}>
                    {user.extra}
                  </td>
                  <td className="td">
                    <div className="actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn-ghost btn-sm"
                        onClick={() => openEdit(user)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Pencil size={12} /> Modifier
                      </button>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => openDelete(user.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div style={{
            padding:   '12px 16px',
            borderTop: '1px solid var(--color-border)',
            fontSize:  12,
            color:     'var(--color-text2)',
          }}>
            {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <UserFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editUser={editUser}
        isLoading={isLoading}
      />
      <UserDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}