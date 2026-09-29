'use client';

import React, { useState } from 'react';
import { usePlanery } from '../../context/PlaneryContext';

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = usePlanery();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('Planery2026');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const hasMinLength = newPassword.length >= 8;
  const hasUpperAndLower =
    /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@#$!%*?&._-]/.test(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasMinLength || !hasUpperAndLower) {
      showToast(
        'La nueva contraseña debe cumplir los requisitos mínimos de seguridad.',
        'warning'
      );
      return;
    }
    showToast('✓ Contraseña corporativa actualizada correctamente.');
    setCurrentPassword('');
    setConfirmPassword('');
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
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-xl border border-[#D0C5AF]/40 shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1 min-w-0">
            <h3 className="text-lg font-bold text-[#151C27]">
              Cambiar contraseña
            </h3>
            <p className="text-xs text-[#575E70]">
              Ingresa tu contraseña actual y define una nueva contraseña que cumpla con los estándares de seguridad.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#575E70] hover:text-[#151C27] p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 pt-4"
        >
          {/* Campo 1: Contraseña actual */}
          <div className="w-full space-y-1">
            <label className="text-xs text-[#151C27] font-semibold block">
              Contraseña actual
            </label>
            <div className="relative w-full">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#575E70] hover:text-[#151C27] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showCurrent ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Campo 2: Nueva contraseña */}
          <div className="w-full space-y-1">
            <label className="text-xs text-[#151C27] font-semibold block">
              Nueva contraseña
            </label>
            <div className="relative w-full">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#575E70] hover:text-[#151C27] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showNew ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Requisitos de seguridad visuales */}
          <div className="w-full p-3 bg-[#F0F3FF]/70 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold text-[#575E70] block">
              Requisitos de seguridad:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div
                className={`flex items-center gap-1.5 font-medium ${
                  hasMinLength ? 'text-emerald-700' : 'text-[#575E70]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Mínimo 8 caracteres</span>
              </div>
              <div
                className={`flex items-center gap-1.5 font-medium ${
                  hasUpperAndLower ? 'text-emerald-700' : 'text-[#575E70]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {hasUpperAndLower
                    ? 'check_circle'
                    : 'radio_button_unchecked'}
                </span>
                <span>Mayúscula y minúscula</span>
              </div>
              <div
                className={`flex items-center gap-1.5 font-medium ${
                  hasNumber ? 'text-emerald-700' : 'text-[#575E70]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Al menos un número</span>
              </div>
              <div
                className={`flex items-center gap-1.5 font-medium ${
                  hasSpecial ? 'text-emerald-700' : 'text-[#575E70]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Carácter especial (@, #, $)</span>
              </div>
            </div>
          </div>

          {/* Campo 3: Confirmar nueva contraseña */}
          <div className="w-full space-y-1">
            <label className="text-xs text-[#151C27] font-semibold block">
              Confirmar nueva contraseña
            </label>
            <div className="relative w-full">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#575E70] hover:text-[#151C27] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirm ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 w-full border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#151C27] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#F2C94C] hover:brightness-105 text-[#241A00] text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Actualizar contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
