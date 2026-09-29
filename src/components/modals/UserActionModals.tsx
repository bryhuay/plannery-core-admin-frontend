'use client';

import React, { useState, useEffect } from 'react';
import { PlatformUser, PlatformUserRole } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

/* ==============================================================
   1. MODAL: EDITAR USUARIO
============================================================== */
export interface EditUserModalProps {
  user: PlatformUser | null;
  onClose: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onClose,
}) => {
  const { companies, updatePlatformUser } = usePlanery();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [role, setRole] = useState<PlatformUserRole>('Company Admin');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
      setCompanyId(user.companyId);
      setRole(user.role);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find((c) => c.id === companyId);
    updatePlatformUser(user.id, {
      firstName,
      lastName,
      email,
      phone,
      companyId,
      companyName: comp ? comp.commercialName : user.companyName,
      companyRuc: comp ? comp.ruc : user.companyRuc,
      role,
    });
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
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-[#E9ECEF] overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E9ECEF] flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">edit</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#1E222D]">
                Editar usuario
              </h3>
              <p className="text-xs text-[#6C757D] truncate">
                Actualiza la información de acceso de{' '}
                <span className="font-bold text-[#1E222D]">
                  {user.fullName}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#6C757D] hover:text-[#1E222D] hover:bg-[#F1F3F5] shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 w-full flex flex-col gap-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="w-full">
              <label className="block font-semibold text-[#1E222D] mb-1">
                Nombres *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white border border-[#CED4DA] rounded-lg px-3 py-2 text-xs text-[#1E222D] focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div className="w-full">
              <label className="block font-semibold text-[#1E222D] mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-white border border-[#CED4DA] rounded-lg px-3 py-2 text-xs text-[#1E222D] focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block font-semibold text-[#1E222D] mb-1">
              Correo electrónico *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#CED4DA] rounded-lg px-3 py-2 text-xs text-[#1E222D] focus:outline-none focus:border-[#F2C94C]"
            />
          </div>

          <div className="w-full">
            <label className="block font-semibold text-[#1E222D] mb-1">
              Teléfono corporativo
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-[#CED4DA] rounded-lg px-3 py-2 text-xs text-[#1E222D] focus:outline-none focus:border-[#F2C94C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="w-full">
              <label className="block font-semibold text-[#1E222D] mb-1">
                Empresa asignada
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full bg-white border border-[#CED4DA] rounded-lg px-3 py-2 text-xs text-[#1E222D] focus:outline-none focus:border-[#F2C94C]"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.commercialName}
                  </option>
                ))}
                {user.companyId === 'plataforma' && (
                  <option value="plataforma">Plataforma</option>
                )}
              </select>
            </div>
            <div className="w-full">
              <label className="block font-semibold text-[#1E222D] mb-1">
                Rol
              </label>
              <select
                value={role}
                disabled={user.isSystemProtected}
                onChange={(e) =>
                  setRole(e.target.value as PlatformUserRole)
                }
                className="w-full bg-white border border-[#CED4DA] rounded-lg px-3 py-2 text-xs text-[#1E222D] focus:outline-none focus:border-[#F2C94C] disabled:bg-slate-100"
              >
                {user.isSystemProtected && (
                  <option value="Super Admin">Super Admin</option>
                )}
                <option value="Company Admin">Company Admin</option>
                <option value="Planner">Planner</option>
                <option value="Client">Client</option>
              </select>
            </div>
          </div>

          <div className="w-full p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
            <span className="material-symbols-outlined text-sm text-amber-700 mt-0.5 shrink-0">
              info
            </span>
            <div>
              El cambio de empresa o rol modifica los permisos de acceso y el aislamiento de datos del usuario en la plataforma.
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 w-full border-t border-[#E9ECEF]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-[#6C757D] hover:text-[#1E222D] hover:bg-[#E9ECEF] rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-[#F2C94C] hover:bg-[#e0b83b] text-[#1E222D] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==============================================================
   2. MODAL: CAMBIAR ROL
============================================================== */
export interface ChangeUserRoleModalProps {
  user: PlatformUser | null;
  onClose: () => void;
}

export const ChangeUserRoleModal: React.FC<ChangeUserRoleModalProps> = ({
  user,
  onClose,
}) => {
  const { changePlatformUserRole } = usePlanery();
  const [newRole, setNewRole] = useState<PlatformUserRole>('Planner');

  useEffect(() => {
    if (user) {
      setNewRole(user.role);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changePlatformUserRole(user.id, newRole);
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
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-[#E9ECEF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E9ECEF] flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">
                swap_horiz
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#1E222D]">
                Cambiar rol de usuario
              </h3>
              <p className="text-xs text-[#6C757D]">
                Ajusta los privilegios RBAC asignados.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#6C757D] hover:text-[#1E222D] hover:bg-[#F1F3F5] shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 w-full flex flex-col gap-4 text-xs"
        >
          <div className="w-full bg-[#F8F9FA] p-3 rounded-xl border border-[#E9ECEF] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#6C757D]">Usuario:</span>
              <span className="font-bold text-[#1E222D]">{user.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C757D]">Empresa:</span>
              <span className="font-semibold text-[#1E222D]">
                {user.companyName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C757D]">Rol actual:</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {user.role}
              </span>
            </div>
          </div>

          <div className="w-full">
            <label className="block font-semibold text-[#1E222D] mb-1.5">
              Nuevo rol asignado *
            </label>
            <select
              value={newRole}
              onChange={(e) =>
                setNewRole(e.target.value as PlatformUserRole)
              }
              className="w-full bg-white border border-[#CED4DA] rounded-lg px-3 py-2 text-xs text-[#1E222D] focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Company Admin">
                Company Admin (Acceso gerencial de empresa)
              </option>
              <option value="Planner">
                Planner (Coordinador de eventos asignados)
              </option>
              <option value="Client">Client (Portal del cliente final)</option>
            </select>
          </div>

          <div className="w-full p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
            <span className="material-symbols-outlined text-sm text-amber-700 mt-0.5 shrink-0">
              warning
            </span>
            <div>
              Cambiar el rol modifica inmediatamente los permisos, vistas y el acceso del usuario en la plataforma. El rol Super Admin está protegido y no es seleccionable.
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 w-full border-t border-[#E9ECEF]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-[#6C757D] hover:text-[#1E222D] hover:bg-[#E9ECEF] rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-[#F2C94C] hover:bg-[#e0b83b] text-[#1E222D] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Guardar rol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==============================================================
   3. MODAL: REENVIAR INVITACIÓN
============================================================== */
export interface ResendInvitationModalProps {
  user: PlatformUser | null;
  onClose: () => void;
}

export const ResendInvitationModal: React.FC<
  ResendInvitationModalProps
> = ({ user, onClose }) => {
  const { resendPlatformUserInvitation } = usePlanery();

  if (!user) return null;

  const handleConfirm = () => {
    resendPlatformUserInvitation(user.id);
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
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-[#E9ECEF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">
              forward_to_inbox
            </span>
          </div>
          <h3 className="text-base font-bold text-[#1E222D]">
            ¿Reenviar invitación?
          </h3>
          <p className="text-xs text-[#6C757D] leading-relaxed">
            Se enviará nuevamente el correo de acceso con un nuevo token seguro de activación para{' '}
            <span className="font-bold text-[#1E222D]">{user.email}</span>. El enlace anterior será invalidado.
          </p>
        </div>
        <div className="px-6 py-4 bg-[#F8F9FA] border-t border-[#E9ECEF] flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-[#6C757D] hover:text-[#1E222D] rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-[#F2C94C] hover:bg-[#e0b83b] text-[#1E222D] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Reenviar invitación
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==============================================================
   4. MODAL: SUSPENDER / ACTIVAR USUARIO
============================================================== */
export interface SuspendUserModalProps {
  user: PlatformUser | null;
  onClose: () => void;
}

export const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
  user,
  onClose,
}) => {
  const { togglePlatformUserStatus } = usePlanery();
  const [reason, setReason] = useState('');

  if (!user) return null;

  const isSuspended = user.status === 'Suspendido';

  const handleConfirm = () => {
    togglePlatformUserStatus(
      user.id,
      isSuspended ? 'Activo' : 'Suspendido',
      reason.trim() || undefined
    );
    setReason('');
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
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-[#E9ECEF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 w-full flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isSuspended
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {isSuspended ? 'check_circle' : 'block'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E222D]">
                {isSuspended ? '¿Activar usuario?' : '¿Suspender usuario?'}
              </h3>
              <p className="text-xs text-[#6C757D]">
                {isSuspended
                  ? 'Se restaurarán las credenciales de acceso.'
                  : 'El usuario perderá el acceso a Planery Core.'}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#6C757D] leading-relaxed">
            {isSuspended ? (
              <>
                El usuario{' '}
                <span className="font-bold text-[#1E222D]">
                  {user.fullName}
                </span>{' '}
                recuperará inmediatamente su acceso y permisos asociados a{' '}
                <span className="font-semibold text-[#1E222D]">
                  {user.companyName}
                </span>
                .
              </>
            ) : (
              <>
                El usuario{' '}
                <span className="font-bold text-[#1E222D]">
                  {user.fullName}
                </span>{' '}
                perderá inmediatamente el acceso a Planery Core según las políticas de la plataforma. Su historial, tareas y registros se conservarán intactos.
              </>
            )}
          </p>

          {!isSuspended && (
            <div className="w-full">
              <label className="block text-xs font-semibold text-[#1E222D] mb-1">
                Motivo de suspensión (opcional)
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej. Solicitud de baja laboral por parte de la empresa..."
                className="w-full bg-[#F8F9FA] border border-[#CED4DA] rounded-lg px-3 py-2 text-xs text-[#1E222D] focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 w-full border-t border-[#E9ECEF]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-[#6C757D] hover:text-[#1E222D] rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full sm:w-auto px-4 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-colors cursor-pointer ${
                isSuspended
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isSuspended ? 'Activar usuario' : 'Suspender usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
