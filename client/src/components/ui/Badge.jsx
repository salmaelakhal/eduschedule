export default function Badge({ role }) {
  const config = {
    ADMIN:   { label: 'Admin',      className: 'badge-admin' },
    TEACHER: { label: 'Enseignant', className: 'badge-teacher' },
    STUDENT: { label: 'Étudiant',   className: 'badge-student' },
    ONLINE:  { label: 'En ligne',   className: 'badge-online' },
    OFFLINE: { label: 'Présentiel', className: 'badge-offline' },
  };

  const item = config[role] || { label: role, className: 'badge-admin' };

  return (
    <span className={`badge ${item.className}`}>
      {item.label}
    </span>
  );
}