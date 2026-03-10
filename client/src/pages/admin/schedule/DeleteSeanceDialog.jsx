import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function DeleteSeanceDialog({ isOpen, onClose, onConfirm, isLoading, seance }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Supprimer la séance"
      message={
        seance
          ? `Supprimer "${seance.subject}" le ${seance.day} de ${seance.startTime} à ${seance.endTime} ?`
          : 'Cette séance sera définitivement supprimée.'
      }
    />
  );
}