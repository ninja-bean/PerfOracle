import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  maxWidth = 'max-w-2xl' 
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Frosted Backdrop with Ambient Vignette */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Level 4 Glass Modal Dialog */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidth} rounded-3xl glass-surface-l4 p-6 sm:p-7 text-white z-10 animate-in zoom-in-95 duration-200`}
      >
        {/* Crisp Inset Specular Top Line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4 mb-5">
          <div className="pr-4">
            <h3 id="modal-title" className="text-lg font-bold tracking-tight text-white font-display">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
