import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function ClassDeleteDialog({ isOpen, onClose, onConfirm, isLoading, className }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Supprimer la classe"
      message={`Cette action est irréversible. La classe "${className}" et toutes ses séances seront supprimées.`}
    />
  );
}