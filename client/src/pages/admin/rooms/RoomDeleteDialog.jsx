import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function RoomDeleteDialog({ isOpen, onClose, onConfirm, isLoading, roomName }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Supprimer la salle"
      message={`Cette action est irréversible. La salle "${roomName}" sera définitivement supprimée.`}
    />
  );
}