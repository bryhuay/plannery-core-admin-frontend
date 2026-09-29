'use client';

import React from 'react';
import { Provider } from '../../types/planery';
import { Link } from '../../lib/navigation';
import { usePlanery } from '../../context/PlaneryContext';

export interface DetalleProveedorDrawerProps {
  provider: Provider | null;
  onClose: () => void;
  onEdit: (provider: Provider) => void;
}

export const DetalleProveedorDrawer: React.FC<DetalleProveedorDrawerProps> = ({
  provider,
  onClose,
  onEdit,
}) => {
  const { toggleProviderStatus } = usePlanery();

  if (!provider) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[440px] bg-white shadow-2xl flex flex-col h-full border-l border-[#E5E7EB]">
        {/* Header Drawer */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#F0F3FF]/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#745b00] text-xl">
              storefront
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Detalle del Proveedor
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Cerrar detalle"
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body Drawer */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scroll">
          {/* Card Identidad Principal */}
          <div className="p-4 rounded-xl bg-[#F0F3FF]/70 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {provider.commercialName}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  ID: {provider.code}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  provider.status === 'Activo'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    provider.status === 'Activo'
                      ? 'bg-emerald-600'
                      : 'bg-gray-400'
                  }`}
                />
                {provider.status}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
                {provider.category}
              </span>
              <span className="text-xs text-slate-500">
                · Proveedor Homologado
              </span>
            </div>
          </div>

          {/* Sección Información Empresarial */}
          <div className="space-y-3">
            <h4 className="uppercase text-slate-500 font-bold tracking-wider text-[11px]">
              Información Empresarial
            </h4>
            <div className="space-y-2.5 bg-white border border-slate-200 rounded-xl p-3.5 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Razón Social:</span>
                <span className="font-semibold text-slate-900 text-right">
                  {provider.legalName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">RUC:</span>
                <span className="font-mono text-xs font-semibold text-slate-900">
                  {provider.ruc}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 text-xs">Registro:</span>
                <span className="font-medium text-slate-900 text-xs">
                  {provider.registeredDate}
                </span>
              </div>
            </div>
          </div>

          {/* Sección Contacto y Ubicación */}
          <div className="space-y-3">
            <h4 className="uppercase text-slate-500 font-bold tracking-wider text-[11px]">
              Contacto y Ubicación
            </h4>
            <div className="space-y-2.5 bg-white border border-slate-200 rounded-xl p-3.5 text-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  person
                </span>
                <div>
                  <div className="text-xs text-slate-500">
                    Persona de contacto
                  </div>
                  <div className="font-semibold text-slate-900">
                    {provider.contactName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  call
                </span>
                <div>
                  <div className="text-xs text-slate-500">Teléfono directo</div>
                  <div className="font-semibold text-slate-900 tabular-nums">
                    {provider.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  mail
                </span>
                <div>
                  <div className="text-xs text-slate-500">
                    Correo electrónico
                  </div>
                  <div className="font-semibold text-slate-900 text-xs">
                    {provider.email}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">
                  location_on
                </span>
                <div>
                  <div className="text-xs text-slate-500">
                    Dirección fiscal / operativa
                  </div>
                  <div className="font-medium text-slate-900 text-xs">
                    {provider.address}, {provider.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección Eventos Asociados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="uppercase text-slate-500 font-bold tracking-wider text-[11px]">
                Eventos asociados ({provider.eventsCount})
              </h4>
              <Link
                href="/eventos"
                onClick={onClose}
                className="text-xs text-[#745b00] hover:underline font-bold"
              >
                Ver todos
              </Link>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-slate-200 bg-[#F0F3FF]/40 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-slate-900">
                    Boda de María y Carlos
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>18 Nov 2026</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">
                      Confirmado
                    </span>
                  </div>
                </div>
                <Link
                  href="/eventos/EV-2026-084"
                  onClick={onClose}
                  className="text-xs text-[#745b00] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span>Ver evento</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_outward
                  </span>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-[#F0F3FF]/40 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-slate-900">
                    Gala Corporativa Anual 2024
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>18 Nov 2024</span>
                    <span>•</span>
                    <span className="text-blue-700 font-medium">
                      En progreso
                    </span>
                  </div>
                </div>
                <Link
                  href="/eventos/EV-2024-081"
                  onClick={onClose}
                  className="text-xs text-[#745b00] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span>Ver evento</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_outward
                  </span>
                </Link>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-[#F0F3FF]/40 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-slate-900">
                    Convención Anual de Finanzas
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>02 Dic 2024</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">
                      Confirmado
                    </span>
                  </div>
                </div>
                <Link
                  href="/eventos/EV-2024-082"
                  onClick={onClose}
                  className="text-xs text-[#745b00] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span>Ver evento</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_outward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-[#F0F3FF]/40 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(provider)}
            className="flex-1 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            <span>Editar proveedor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleProviderStatus(provider.id);
              onClose();
            }}
            className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">block</span>
            <span>
              {provider.status === 'Activo' ? 'Desactivar' : 'Activar'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
