'use client';

import React from 'react';
import { PlatformUser } from '../../types/planery';
import { useRouter } from '../../lib/navigation';

export interface UserDetailDrawerProps {
  user: PlatformUser | null;
  onClose: () => void;
  onEdit: (user: PlatformUser) => void;
  onChangeRole: (user: PlatformUser) => void;
  onSuspendOrActivate: (user: PlatformUser) => void;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  onClose,
  onEdit,
  onChangeRole,
  onSuspendOrActivate,
}) => {
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E222D]/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E9ECEF] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${user.avatarColor}`}
            >
              {user.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1E222D]">
                  {user.fullName}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    user.status === 'Activo'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : user.status === 'Invitación pendiente'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-[#6C757D]">
                ID: {user.code} • {user.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6C757D] hover:text-[#1E222D] hover:bg-[#F1F3F5] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Section: Información Personal */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6C757D]">
              Información personal
            </h4>
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E9ECEF] space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-[#6C757D] block">
                    Nombres
                  </span>
                  <span className="font-semibold text-[#1E222D] text-xs">
                    {user.firstName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#6C757D] block">
                    Apellidos
                  </span>
                  <span className="font-semibold text-[#1E222D] text-xs">
                    {user.lastName}
                  </span>
                </div>
              </div>
              <div className="h-px bg-[#E9ECEF]" />
              <div>
                <span className="text-[11px] text-[#6C757D] block">
                  Correo electrónico
                </span>
                <span className="font-semibold text-[#1E222D] text-xs">
                  {user.email}
                </span>
              </div>
              <div className="h-px bg-[#E9ECEF]" />
              <div>
                <span className="text-[11px] text-[#6C757D] block">
                  Teléfono corporativo
                </span>
                <span className="font-semibold text-[#1E222D] text-xs">
                  {user.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Empresa Asociada */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6C757D]">
                Empresa asociada
              </h4>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/empresas');
                }}
                className="text-[11px] font-bold text-[#1E222D] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver empresa</span>
                <span className="material-symbols-outlined text-xs">
                  open_in_new
                </span>
              </button>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E9ECEF] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-xs text-[#1E222D]">
                  {user.companyInitials || 'BG'}
                </div>
                <div>
                  <p className="font-bold text-[#1E222D] text-xs">
                    {user.companyName}
                  </p>
                  <p className="text-[11px] text-[#6C757D]">
                    {user.companyRuc
                      ? `RUC: ${user.companyRuc} • Lima, Perú`
                      : user.companySubtext}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Tenant Activo
              </span>
            </div>
          </div>

          {/* Section: Acceso a la Plataforma */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6C757D]">
              Acceso a la plataforma
            </h4>
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E9ECEF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6C757D]">
                  Rol de usuario
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                    user.role === 'Super Admin'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : user.role === 'Company Admin'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : user.role === 'Planner'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {user.role === 'Super Admin'
                      ? 'shield_person'
                      : user.role === 'Company Admin'
                      ? 'admin_panel_settings'
                      : user.role === 'Planner'
                      ? 'event_seat'
                      : 'person'}
                  </span>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6C757D]">
                  Estado de la cuenta
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    user.status === 'Activo'
                      ? 'text-emerald-700'
                      : user.status === 'Invitación pendiente'
                      ? 'text-amber-700'
                      : 'text-rose-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.status === 'Activo'
                        ? 'bg-emerald-500'
                        : user.status === 'Invitación pendiente'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />{' '}
                  {user.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6C757D]">
                  Fecha de registro
                </span>
                <span className="font-semibold text-[#1E222D]">
                  {user.registeredDateLong}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6C757D]">
                  Último acceso registrado
                </span>
                <span className="font-semibold text-[#1E222D]">
                  {user.lastAccess}
                  {user.lastAccessIp && user.lastAccessIp !== '—'
                    ? ` (IP ${user.lastAccessIp})`
                    : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Registro de actividad y accesos */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6C757D]">
              Registro de actividad y accesos
            </h4>
            <div className="border border-[#E9ECEF] rounded-xl divide-y divide-[#E9ECEF] bg-white overflow-hidden">
              {user.accessLogs.map((log) => (
                <div key={log.id} className="p-3 flex items-start gap-3">
                  <span
                    className={`material-symbols-outlined text-base ${log.iconColor} mt-0.5`}
                  >
                    {log.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-[#1E222D]">{log.title}</p>
                    <p className="text-[10px] text-[#6C757D]">{log.subtitle}</p>
                  </div>
                  <span className="text-[10px] text-[#ADB5BD]">
                    {log.timeLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Fixed Footer Actions */}
        <div className="p-5 border-t border-[#E9ECEF] bg-white flex items-center justify-between gap-3 shrink-0">
          {!user.isSystemProtected ? (
            <button
              type="button"
              onClick={() => onSuspendOrActivate(user)}
              className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                user.status === 'Suspendido'
                  ? 'text-emerald-700 hover:bg-emerald-50'
                  : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
              }`}
            >
              {user.status === 'Suspendido'
                ? 'Activar usuario'
                : 'Suspender usuario'}
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              Cuenta protegida de plataforma
            </span>
          )}
          <div className="flex items-center gap-2">
            {!user.isSystemProtected && (
              <button
                type="button"
                onClick={() => onChangeRole(user)}
                className="bg-[#F8F9FA] hover:bg-[#E9ECEF] text-[#1E222D] font-bold text-xs px-3.5 py-2 rounded-lg border border-[#CED4DA] transition-colors cursor-pointer"
              >
                Cambiar rol
              </button>
            )}
            <button
              type="button"
              onClick={() => onEdit(user)}
              className="bg-[#F2C94C] hover:bg-[#e0b83b] text-[#1E222D] font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Editar usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
