'use client';

import React from 'react';
import { PlatformCompany } from '../../types/planery';
import { useRouter } from '../../lib/navigation';

export interface CompanyDetailDrawerProps {
  company: PlatformCompany | null;
  onClose: () => void;
  onEdit: (company: PlatformCompany) => void;
  onToggleStatus: (company: PlatformCompany) => void;
}

export const CompanyDetailDrawer: React.FC<CompanyDetailDrawerProps> = ({
  company,
  onClose,
  onEdit,
  onToggleStatus,
}) => {
  const router = useRouter();

  if (!company) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Right Lateral Drawer */}
      <aside className="relative w-full sm:w-[480px] bg-white border-l border-[#D0C5AF] shadow-2xl z-10 flex flex-col justify-between h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#D0C5AF]/60 flex items-center justify-between bg-[#F0F3FF]/60">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#151C27]">
                  Detalle de empresa
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    company.status === 'Activa'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : company.status === 'Pendiente'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      company.status === 'Activa'
                        ? 'bg-emerald-600'
                        : company.status === 'Pendiente'
                        ? 'bg-amber-500'
                        : 'bg-rose-600'
                    }`}
                  />
                  {company.status}
                </span>
              </div>
              <span className="font-mono text-xs text-[#575E70]">
                ID: {company.code}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Cerrar panel"
            className="p-1.5 rounded-lg text-[#575E70] hover:text-[#151C27] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* SECCIÓN 1: Información General */}
          <section className="space-y-3 pb-5 border-b border-slate-200">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#575E70]">
              Información General
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <div className="col-span-2">
                <span className="text-[11px] text-[#575E70] block">
                  Nombre comercial
                </span>
                <span className="font-semibold text-[#151C27] text-sm">
                  {company.commercialName}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[11px] text-[#575E70] block">
                  Razón social
                </span>
                <span className="text-[#151C27]">{company.legalName}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#575E70] block">RUC</span>
                <span className="font-mono text-[#151C27] font-medium">
                  {company.ruc}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#575E70] block">
                  Estado tributario
                </span>
                <span className="text-[#151C27] font-medium">
                  {company.taxStatus}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#575E70] block">
                  Fecha de registro
                </span>
                <span className="text-[#151C27]">
                  {company.registeredDateLong}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#575E70] block">
                  Zona horaria
                </span>
                <span className="text-[#151C27]">{company.timezone}</span>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: Contacto y Ubicación */}
          <section className="space-y-3 pb-5 border-b border-slate-200">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#575E70]">
              Contacto y Ubicación
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#575E70] text-[18px]">
                  mail
                </span>
                <span className="text-[#151C27]">{company.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#575E70] text-[18px]">
                  call
                </span>
                <span className="text-[#151C27]">{company.phone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#575E70] text-[18px] shrink-0 mt-0.5">
                  location_on
                </span>
                <span className="text-[#151C27]">{company.address}</span>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: Administrador Principal */}
          <section className="space-y-3 pb-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#575E70]">
                Administrador Principal
              </h3>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/usuarios');
                }}
                className="text-xs font-bold text-[#745B00] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver usuario</span>
                <span className="material-symbols-outlined text-[14px]">
                  north_east
                </span>
              </button>
            </div>
            <div className="p-3 bg-[#F0F3FF]/80 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F2C94C] text-[#241A00] flex items-center justify-center font-bold text-xs shrink-0">
                  {company.adminInitials}
                </div>
                <div>
                  <p className="font-semibold text-[#151C27] text-xs">
                    {company.adminName}
                  </p>
                  <p className="text-[11px] text-[#575E70]">
                    {company.adminEmail}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 mt-0.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Usuario activo
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: Usuarios y Accesos */}
          <section className="space-y-3 pb-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#575E70]">
                Usuarios y Accesos
              </h3>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/usuarios');
                }}
                className="text-xs font-bold text-[#745B00] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Gestionar usuarios</span>
                <span className="material-symbols-outlined text-[14px]">
                  north_east
                </span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-[#F0F3FF]/70 border border-slate-200">
                <span className="block text-lg font-bold text-[#151C27] tabular-nums">
                  {company.usersTotal}
                </span>
                <span className="text-[11px] text-[#575E70]">Registrados</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                <span className="block text-lg font-bold text-emerald-700 tabular-nums">
                  {company.usersActive}
                </span>
                <span className="text-[11px] text-emerald-800">Activos</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="block text-lg font-bold text-[#575E70] tabular-nums">
                  {company.usersInactive}
                </span>
                <span className="text-[11px] text-[#575E70]">Inactivos</span>
              </div>
            </div>
          </section>

          {/* SECCIÓN 5: Suscripción y Facturación */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#575E70]">
                Suscripción y Facturación
              </h3>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/suscripciones');
                }}
                className="text-xs font-bold text-[#745B00] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver suscripción</span>
                <span className="material-symbols-outlined text-[14px]">
                  north_east
                </span>
              </button>
            </div>
            <div className="p-3.5 bg-[#F0F3FF]/70 border border-slate-200 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#151C27] text-xs">
                  {company.plan === 'Sin plan'
                    ? 'Sin suscripción activa'
                    : `Plan ${company.plan} (${company.billingCycle})`}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    company.status === 'Activa'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {company.status === 'Activa' ? 'Al día' : 'Revisión'}
                </span>
              </div>
              <p className="text-xs text-[#575E70]">
                Tarifa regular:{' '}
                <strong className="text-[#151C27] font-semibold tabular-nums">
                  S/ {company.monthlyFee.toFixed(2)} / mes
                </strong>
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-[#575E70]">
                <span>Próxima renovación:</span>
                <span className="font-medium text-[#151C27]">
                  {company.nextRenewal}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-[#F0F3FF]/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleStatus(company)}
            className={`px-3 py-2 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              company.status === 'Suspendida'
                ? 'text-emerald-700 hover:bg-emerald-50'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {company.status === 'Suspendida' ? 'check_circle' : 'block'}
            </span>
            <span>
              {company.status === 'Suspendida'
                ? 'Reactivar empresa'
                : 'Suspender empresa'}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(company)}
              className="px-4 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-[#151C27] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Editar empresa
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#151C27] text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
