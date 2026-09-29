'use client';

import React, { useEffect } from 'react';

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: string;
  iconClassName?: string;
  widthClass?: 'sm:max-w-md' | 'sm:max-w-lg' | 'sm:max-w-xl' | 'sm:max-w-2xl';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  icon,
  iconClassName = 'bg-amber-50 text-[#745B00]',
  widthClass = 'sm:max-w-md',
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
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="side-drawer-title"
    >
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div
          className={`w-screen max-w-full ${widthClass} bg-white shadow-2xl border-l border-gray-200 flex flex-col h-full`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabecera Fija del SideDrawer */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4 bg-white shrink-0">
            <div className="flex items-start gap-3 min-w-0">
              {icon && (
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClassName}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {icon}
                  </span>
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    id="side-drawer-title"
                    className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
                  >
                    {title}
                  </h2>
                  {badge}
                </div>
                {subtitle && (
                  <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel lateral"
              className="text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-lg p-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Cuerpo Desplazable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">{children}</div>

          {/* Footer Fijo de Acciones */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
