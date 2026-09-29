'use client';

import React from 'react';
import { Button } from '../ui/Button';

export type AuditCategory = 'Finanzas' | 'Proveedores' | 'Tareas' | 'Accesos' | 'Configuración' | string;

export interface AuditTimelineItemProps {
  id: string;
  timestamp: string;
  userName: string;
  userRole?: string;
  userInitials?: string;
  actionTitle: string;
  description: string;
  category?: AuditCategory;
  metadataTag?: string;
  ipAddress?: string;
  isLast?: boolean;
  onInspect?: (id: string) => void;
  inspectLabel?: string;
}

export const AuditTimelineItem: React.FC<AuditTimelineItemProps> = ({
  id,
  timestamp,
  userName,
  userRole,
  userInitials,
  actionTitle,
  description,
  category = 'Configuración',
  metadataTag,
  ipAddress,
  isLast = false,
  onInspect,
  inspectLabel = 'Inspeccionar',
}) => {
  const categoryConfig: Record<string, { icon: string; colorClass: string }> = {
    Finanzas: {
      icon: 'payments',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    Proveedores: {
      icon: 'storefront',
      colorClass: 'bg-amber-50 text-[#745B00] border-amber-200',
    },
    Tareas: {
      icon: 'task_alt',
      colorClass: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    Accesos: {
      icon: 'shield_person',
      colorClass: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    Configuración: {
      icon: 'settings',
      colorClass: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  };

  const currentCategory = categoryConfig[category] || categoryConfig['Configuración'];

  const computedInitials =
    userInitials ||
    userName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="relative flex items-start gap-3.5 sm:gap-4 group">
      {/* Línea Conectora Vertical */}
      {!isLast && (
        <div
          className="absolute left-4.5 top-10 bottom-0 w-px bg-gray-200"
          aria-hidden="true"
        />
      )}

      {/* Nodo Iconográfico */}
      <div
        className={`relative z-10 w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${currentCategory.colorClass}`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {currentCategory.icon}
        </span>
      </div>

      {/* Tarjeta de Contenido del Evento de Auditoría */}
      <div className="flex-1 min-w-0 pb-5">
        <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 shadow-2xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {actionTitle}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentCategory.colorClass}`}
              >
                {category}
              </span>
              {metadataTag && (
                <span className="text-[11px] font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                  {metadataTag}
                </span>
              )}
            </div>

            <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap">
              {timestamp}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
            {description}
          </p>

          {/* Pie con Usuario Autor y Botón de Inspección */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-[#F2C94C] text-[10px] font-bold flex items-center justify-center shrink-0">
                {computedInitials}
              </span>
              <span className="font-semibold text-slate-800">{userName}</span>
              {userRole && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{userRole}</span>
                </>
              )}
              {ipAddress && (
                <>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <span className="font-mono text-[11px] text-gray-400 hidden sm:inline">
                    IP {ipAddress}
                  </span>
                </>
              )}
            </div>

            {onInspect && (
              <Button
                variant="outline"
                size="sm"
                icon="visibility"
                onClick={() => onInspect(id)}
              >
                {inspectLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
