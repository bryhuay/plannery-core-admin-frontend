'use client';

import React from 'react';

export interface EliminarDocumentoModalProps {
  isOpen: boolean;
  fileName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const EliminarDocumentoModal: React.FC<EliminarDocumentoModalProps> = ({
  isOpen,
  fileName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">warning</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            ¿Eliminar este documento?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            El documento{' '}
            <strong className="text-slate-900">{fileName}</strong> dejará de
            estar disponible en este evento. Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 w-full border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto justify-center px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              delete
            </span>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
