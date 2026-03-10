import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function SubjectDeleteDialog({ isOpen, onClose, onConfirm, isLoading, subjectName }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Supprimer la matière"
      message={`Cette action est irréversible. La matière "${subjectName}" sera définitivement supprimée.`}
    />
  );
}