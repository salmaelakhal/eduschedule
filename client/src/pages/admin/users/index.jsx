import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import Badge    from '../../../components/ui/Badge';
import Spinner  from '../../../components/ui/Spinner';
import UserFormModal    from './UserFormModal';
import UserDeleteDialog from './UserDeleteDialog';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../../hooks/useUsers';

const ROLES = [
  { value: '',        label: 'Tous les rôles' },
  { value: 'ADMIN',   label: 'Admin' },
  { value: 'TEACHER', label: 'Enseignant' },
  { value: 'STUDENT', label: 'Étudiant' },
];

export default function Users() {
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [formOpen,   setFormOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editUser,   setEditUser]   = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);

  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const filtered = users.filter((u) => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAdd  = () => { setEditUser(null); setFormOpen(true); };
  const openEdit = (user) => { setEditUser(user); setFormOpen(true); };
  const openDelete = (id) => { setDeleteId(id); setDeleteOpen(true); };

  const handleSubmit = async (form) => {
    // Filtrer password vide en mode edit
    const body = { ...form };
    if (editUser && !body.password) delete body.password;

    if (editUser) {
      await updateUser.mutateAsync({ id: editUser.id, ...body });
    } else {
      await createUser.mutateAsync(body);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    await deleteUser.mutateAsync(deleteId);
    setDeleteOpen(false);
  };

  const isSubmitting = createUser.isPending || updateUser.isPending;
  const isDeleting   = deleteUser.isPending;

  // Extra info display
  const getExtra = (user) => {
    if (user.role === 'TEACHER') return user.subject?.name || '—';
    if (user.role === 'STUDENT') return user.enrollments?.[0]?.class?.name || '—';
    return '—';
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
            {isLoading ? (
              <tr>
                <td colSpan={5}>
                  <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
                    <Spinner size="md" />
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
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
                        width:          32, height: 32,
                        borderRadius:   '50%',
                        background:
                          user.role === 'ADMIN'   ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))' :
                          user.role === 'TEACHER' ? 'linear-gradient(135deg, var(--color-accent2), #00a884)' :
                                                    'linear-gradient(135deg, var(--color-accent3), #e05555)',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        fontSize:       11, fontWeight: 700, color: 'white', flexShrink: 0,
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
                    {getExtra(user)}
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

        {filtered.length > 0 && !isLoading && (
          <div style={{
            padding:   '12px 16px',
            borderTop: '1px solid var(--color-border)',
            fontSize:  12, color: 'var(--color-text2)',
          }}>
            {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <UserFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editUser={editUser}
        isLoading={isSubmitting}
      />
      <UserDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}