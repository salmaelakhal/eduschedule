import { useEffect } from 'react';
import { X } from 'lucide-react';
import Spinner from './Spinner';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  isLoading = false,
}) {
  const sizes = {
    sm: 400,
    md: 480,
    lg: 620,
  };

  // Fermer avec Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Bloquer le scroll du body quand modal ouverte
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex:         100,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        16,
        animation:      'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:   'var(--color-surface)',
          border:       '1px solid var(--color-border)',
          borderRadius: 16,
          padding:      28,
          width:        '100%',
          maxWidth:     sizes[size],
          maxHeight:    '90vh',
          overflowY:    'auto',
          boxShadow:    '0 24px 60px rgba(0,0,0,0.5)',
          animation:    'popIn 0.25s ease',
          position:     'relative',
        }}
      >
        {/* Header */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          marginBottom:  20,
          paddingBottom: 16,
          borderBottom:  '1px solid var(--color-border)',
        }}>
          <h2 style={{
            fontSize:    17,
            fontWeight:  700,
            fontFamily:  'var(--font-display)',
            color:       'var(--color-text)',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background:   'transparent',
              border:       'none',
              cursor:       'pointer',
              color:        'var(--color-text2)',
              display:      'flex',
              alignItems:   'center',
              padding:      4,
              borderRadius: 6,
              transition:   'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text2)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ position: 'relative' }}>
          {isLoading && (
            <div style={{
              position:       'absolute',
              inset:          0,
              background:     'rgba(26,29,39,0.7)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              zIndex:         10,
              borderRadius:   8,
            }}>
              <Spinner size="lg" />
            </div>
          )}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            display:       'flex',
            gap:           10,
            justifyContent:'flex-end',
            marginTop:     20,
            paddingTop:    16,
            borderTop:     '1px solid var(--color-border)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}