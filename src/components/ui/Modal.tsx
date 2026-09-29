'use client';

import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  iconClassName?: string;
  maxWidthClass?: 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl' | 'max-w-4xl';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconClassName = 'bg-amber-50 text-[#745B00]',
  maxWidthClass = 'max-w-lg',
  footer,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`relative w-full max-w-lg ${
          maxWidthClass !== 'max-w-lg' ? `sm:${maxWidthClass}` : 'sm:max-w-xl'
        } mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4 bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClassName}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {icon}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h3
                id="modal-title"
                className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
              >
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Cuerpo con Scroll Interno */}
        <div className="p-6 overflow-y-auto w-full flex-1">{children}</div>

        {/* Pie Opcional de Acciones */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
