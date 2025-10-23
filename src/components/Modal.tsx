/// <reference types="react" />
import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-brand-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-brand-primary/30 flex-shrink-0">
          <h2 id="modal-title" className="text-2xl font-display">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="Close modal">
            <CloseIcon />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Modal;
