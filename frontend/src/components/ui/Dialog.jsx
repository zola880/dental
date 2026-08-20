import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Dialog.css';

const Dialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showClose = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && showClose) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, showClose]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={showClose ? onClose : undefined}>
      <div 
        className={`dialog dialog--${size}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {(title || showClose) && (
          <div className="dialog__header">
            {title && <h3 className="dialog__title">{title}</h3>}
            {showClose && (
              <button 
                className="dialog__close" 
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="dialog__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;