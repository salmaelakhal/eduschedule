import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Spinner          from '../../../components/ui/Spinner';
import RoomFormModal    from './RoomFormModal';
import RoomDeleteDialog from './RoomDeleteDialog';
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from '../../../hooks/useRooms';

const ROOM_ICONS = ['🏛️', '🖥️', '🧪', '📖', '🔬', '📐', '🎓', '🏢'];

export default function Rooms() {
  const [formOpen,   setFormOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editRoom,   setEditRoom]   = useState(null);
  const [deleteRoom, setDeleteRoom] = useState(null);

  const { data: rooms = [], isLoading } = useRooms();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom_ = useDeleteRoom();

  const openAdd    = () => { setEditRoom(null); setFormOpen(true); };
  const openEdit   = (room) => { setEditRoom(room); setFormOpen(true); };
  const openDelete = (room) => { setDeleteRoom(room); setDeleteOpen(true); };

  const handleSubmit = async (form) => {
    if (editRoom) {
      await updateRoom.mutateAsync({ id: editRoom.id, ...form });
    } else {
      await createRoom.mutateAsync(form);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    await deleteRoom_.mutateAsync(deleteRoom.id);
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
          <Plus size={14} /> Ajouter une salle
        </button>
      </div>

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap:                 14,
      }}>
        {rooms.map((room, i) => (
          <div key={room.id} className="room-card">
            <div style={{ fontSize: 32, marginBottom: 10 }}>
              {ROOM_ICONS[i % ROOM_ICONS.length]}
            </div>
            <div style={{
              fontSize: 14, fontWeight: 700, color: 'var(--color-text)',
              marginBottom: 4, fontFamily: 'var(--font-display)',
            }}>
              {room.name}
            </div>
            <div style={{
              fontSize: 12, color: 'var(--color-text2)', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              👥 {room.capacity} places
            </div>
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

        <div
          onClick={openAdd}
          style={{
            background: 'transparent', border: '1px dashed var(--color-border)',
            borderRadius: 12, padding: 20, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', minHeight: 160, color: 'var(--color-text2)',
            transition: 'all 0.2s', gap: 8, textAlign: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent2)'; e.currentTarget.style.color = 'var(--color-accent2)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text2)'; }}
        >
          <Plus size={24} />
          <span style={{ fontSize: 12 }}>Nouvelle salle</span>
        </div>
      </div>

      <RoomFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        editRoom={editRoom}
        isLoading={createRoom.isPending || updateRoom.isPending}
      />
      <RoomDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteRoom_.isPending}
        roomName={deleteRoom?.name || ''}
      />
    </div>
  );
}