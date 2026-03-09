import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

// ── Données statiques (on branchera l'API plus tard) ──
const MOCK_USERS = [
  { id: 1, fullName: 'Super Admin',     email: 'admin@eduschedule.com',          role: 'ADMIN',   extra: '—' },
  { id: 2, fullName: 'Sara Moussaoui',  email: 'sara.moussaoui@eduschedule.com', role: 'TEACHER', extra: 'Mathématiques' },
  { id: 3, fullName: 'Nadia El Fassi',  email: 'nadia.elfassi@eduschedule.com',  role: 'TEACHER', extra: 'Algorithmique' },
  { id: 4, fullName: 'Ahmed Tazi',      email: 'ahmed.tazi@eduschedule.com',     role: 'STUDENT', extra: 'L2 Informatique' },
  { id: 5, fullName: 'Youssef Chami',   email: 'y.chami@eduschedule.com',        role: 'STUDENT', extra: 'L1 Informatique' },
];

const ROLES = [
  { value: '',        label: 'Tous les rôles' },
  { value: 'ADMIN',   label: 'Admin' },
  { value: 'TEACHER', label: 'Enseignant' },
  { value: 'STUDENT', label: 'Étudiant' },
];

const EMPTY_FORM = {
  fullName:  '',
  email:     '',
  password:  '',
  role:      '',
  subjectId: '',
  classId:   '',
};

export default function Users() {
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editUser,    setEditUser]    = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [isLoading,   setIsLoading]   = useState(false);

  // ── Filtrage ──
  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Ouvrir modal Add ──
  const openAdd = () => {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  // ── Ouvrir modal Edit ──
  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      fullName:  user.fullName,
      email:     user.email,
      password:  '',
      role:      user.role,
      subjectId: '',
      classId:   '',
    });
    setModalOpen(true);
  };

  // ── Ouvrir confirm delete ──
  const openDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // ── Submit form ──
  const handleSubmit = () => {
    if (!form.fullName || !form.email || (!editUser && !form.password) || !form.role) return;
    setIsLoading(true);
    // ← on branchera l'API plus tard
    setTimeout(() => {
      setIsLoading(false);
      setModalOpen(false);
    }, 1000);
  };

  // ── Confirm delete ──
  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setConfirmOpen(false);
    }, 800);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="content-area">
      <div className="table-wrap">

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={14}
              style={{
                position:  'absolute',
                left:      10,
                top:       '50%',
                transform: 'translateY(-50%)',
                color:     'var(--color-text3)',
              }}
            />
            <input
              className="search-input"
              style={{ paddingLeft: 32 }}
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Role filter */}
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
            <ChevronDown
              size={12}
              style={{
                position:  'absolute',
                right:     10,
                top:       '50%',
                transform: 'translateY(-50%)',
                color:     'var(--color-text2)',
                pointerEvents: 'none',
              }}
            />
          </div>

          <button className="btn-primary" onClick={openAdd}
            style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
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
                    <div className="empty-state-sub">Modifiez votre recherche ou ajoutez un utilisateur</div>
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
                        background:     user.role === 'ADMIN'
                          ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))'
                          : user.role === 'TEACHER'
                          ? 'linear-gradient(135deg, var(--color-accent2), #00a884)'
                          : 'linear-gradient(135deg, var(--color-accent3), #e05555)',
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
                  <td className="td">
                    <Badge role={user.role} />
                  </td>
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

        {/* ── Footer count ── */}
        {filtered.length > 0 && (
          <div style={{
            padding:    '12px 16px',
            borderTop:  '1px solid var(--color-border)',
            fontSize:   12,
            color:      'var(--color-text2)',
          }}>
            {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* ── Modal Add / Edit ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editUser ? '✏️ Modifier l\'utilisateur' : '👤 Ajouter un utilisateur'}
        isLoading={isLoading}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {editUser ? 'Enregistrer' : 'Créer'}
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
            Mot de passe {editUser ? '(laisser vide pour ne pas changer)' : '*'}
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

        {/* Champ conditionnel — Matière si TEACHER */}
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
              <option value="1">Mathématiques</option>
              <option value="2">Algorithmique</option>
              <option value="3">Anglais Technique</option>
            </select>
          </div>
        )}

        {/* Champ conditionnel — Classe si STUDENT */}
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
              <option value="1">L1 Informatique</option>
              <option value="2">L2 Informatique</option>
              <option value="3">L3 Informatique</option>
            </select>
          </div>
        )}
      </Modal>

      {/* ── Confirm Delete ── */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title="Supprimer l'utilisateur"
        message="Cette action est irréversible. L'utilisateur sera définitivement supprimé du système."
      />
    </div>
  );
}