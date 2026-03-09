import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Spinner from './Spinner';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message = 'Cette action est irréversible.',
  isLoading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {isLoading ? <Spinner size="sm" color="white" /> : null}
            Confirmer
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          flexShrink:   0,
          width:        40,
          height:       40,
          borderRadius: '50%',
          background:   'rgba(255,107,107,0.1)',
          border:       '1px solid rgba(255,107,107,0.3)',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
        }}>
          <AlertTriangle size={18} style={{ color: 'var(--color-accent3)' }} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text2)', lineHeight: 1.6, paddingTop: 8 }}>
          {message}
        </p>
      </div>
    </Modal>
  );
}