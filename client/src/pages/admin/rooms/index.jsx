import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import RoomFormModal    from './RoomFormModal';
import RoomDeleteDialog from './RoomDeleteDialog';

const ROOM_ICONS = ['🏛️', '🖥️', '🧪', '📖', '🔬', '📐', '🎓', '🏢'];

const MOCK_ROOMS = [
  { id: 1, name: 'Amphi A',      capacity: 200, icon: '🏛️' },
  { id: 2, name: 'Salle Info 1', capacity: 30,  icon: '🖥️' },
  { id: 3, name: 'Labo 1',       capacity: 25,  icon: '🧪' },
  { id: 4, name: 'Salle B201',   capacity: 40,  icon: '📖' },
];

export default function Rooms() {
  const [formOpen,    setFormOpen]    = useState(false);
  const [deleteOpen,  setDeleteOpen]  = useState(false);
  const [editRoom,    setEditRoom]    = useState(null);
  const [deleteRoom,  setDeleteRoom]  = useState(null);
  const [isLoading,   setIsLoading]   = useState(false);

  const openAdd = () => {
    setEditRoom(null);
    setFormOpen(true);
  };

  const openEdit = (room) => {
    setEditRoom(room);
    setFormOpen(true);
  };

  const openDelete = (room) => {
    setDeleteRoom(room);
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
          <Plus size={14} /> Ajouter une salle
        </button>
      </div>

      {/* ── Cards grid ── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap:                 14,
      }}>
        {MOCK_ROOMS.map((room) => (
          <div key={room.id} className="room-card">

            {/* Icon */}
            <div style={{ fontSize: 32, marginBottom: 10 }}>{room.icon}</div>

            {/* Name */}
            <div style={{
              fontSize:     14,
              fontWeight:   700,
              color:        'var(--color-text)',
              marginBottom: 4,
              fontFamily:   'var(--font-display)',
            }}>
              {room.name}
            </div>

            {/* Capacity */}
            <div style={{
              fontSize:     12,
              color:        'var(--color-text2)',
              marginBottom: 16,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              gap:          4,
            }}>
              👥 {room.capacity} places
            </div>

            {/* Actions */}
            <div className="actions" style={{ justifyContent: 'center' }}>
              <button
                className="btn-ghost btn-sm"
                onClick={() => openEdit(room)}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Pencil size={11} /> Modifier
              </button>
              <button
                className="btn-danger btn-sm"
                onClick={() => openDelete(room)}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
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
            background:     'transparent',
            border:         '1px dashed var(--color-border)',
            borderRadius:   12,
            padding:        20,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            minHeight:      160,
            color:          'var(--color-text2)',
            transition:     'all 0.2s',
            gap:            8,
            textAlign:      'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-accent2)';
            e.currentTarget.style.color       = 'var(--color-accent2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color       = 'var(--color-text2)';
          }}
        >
          <Plus size={24} />
          <span style={{ fontSize: 12 }}>Nouvelle salle</span>
        </div>
      </div>

      {/* ── Modals ── */}
      <RoomFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editRoom={editRoom}
        isLoading={isLoading}
      />
      <RoomDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        roomName={deleteRoom?.name || ''}
      />
    </div>
  );
}