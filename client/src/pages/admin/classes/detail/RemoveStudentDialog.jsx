import ConfirmDialog from '../../../../components/ui/ConfirmDialog';

export default function RemoveStudentDialog({ isOpen, onClose, onConfirm, isLoading, studentName }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Retirer l'étudiant"
      message={`Voulez-vous retirer "${studentName}" de cette classe ?`}
    />
  );
}