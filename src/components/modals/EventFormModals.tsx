'use client';

import React, { useState } from 'react';
import { ClientItem } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface QuickClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: ClientItem) => void;
}

export const QuickClientModal: React.FC<QuickClientModalProps> = ({
  isOpen,
  onClose,
  onClientCreated,
}) => {
  const { addClient } = usePlanery();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const created = addClient(
      name.trim(),
      email.trim() || 'contacto@empresa.com'
    );
    onClientCreated(created);
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-xl border border-slate-200 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSave} className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#745b00] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  person_add
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Creación rápida de cliente
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="w-full space-y-1">
              <label className="block text-xs text-slate-800 font-semibold">
                Nombre o Razón Social <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Corporación Horizonte SAC"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20"
              />
            </div>

            <div className="w-full space-y-1">
              <label className="block text-xs text-slate-800 font-semibold">
                Correo de contacto principal{' '}
                <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contacto@empresa.com"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 w-full border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-[#F2C94C] hover:bg-[#ebc246] text-[#111827] text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Guardar y seleccionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export interface CancelEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
}

export const CancelEventModal: React.FC<CancelEventModalProps> = ({
  isOpen,
  onClose,
  onDiscard,
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
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-xl border border-slate-200 p-6 shadow-2xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            ¿Quieres cancelar la creación?
          </h3>
          <p className="text-sm text-slate-600">
            Los datos ingresados en el formulario no se guardarán y volverás al
            listado de eventos.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 w-full border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Continuar editando
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Salir sin guardar
          </button>
        </div>
      </div>
    </div>
  );
};
