import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        className={`
          w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden
          transform transition-all scale-100 opacity-100 duration-300
          ${sizeClasses[size] || sizeClasses.md}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          {title && (
            <h3 className="text-lg font-semibold text-slate-100 leading-6">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-5 overflow-y-auto max-h-[70vh] text-sm text-slate-300">
          {children}
        </div>

        {/* Footer */}
        {footer !== null && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-3">
            {footer || (
              <>
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Hủy
                </Button>
                <Button variant="primary" size="sm" onClick={onClose}>
                  Xác nhận
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
