import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function UserDeleteDialog({ isOpen, onClose, onConfirm, isLoading }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Supprimer l'utilisateur"
      message="Cette action est irréversible. L'utilisateur sera définitivement supprimé du système."
    />
  );
}