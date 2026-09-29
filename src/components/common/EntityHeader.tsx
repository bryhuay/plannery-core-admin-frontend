'use client';

import React from 'react';
import { Link } from '../../lib/navigation';
import { StatusBadge, StatusBadgeVariant } from '../ui/StatusBadge';

export interface EntityBreadcrumb {
  label: string;
  href?: string;
}

export interface EntityHeaderBadge {
  label: StatusBadgeVariant;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral' | 'auto';
  icon?: string;
}

export interface EntityHeaderProps {
  title: string;
  subtitle?: string;
  projectId?: string;
  icon?: string;
  badges?: EntityHeaderBadge[];
  breadcrumbs?: EntityBreadcrumb[];
  backHref?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title,
  subtitle,
  projectId,
  icon,
  badges = [],
  breadcrumbs = [],
  backHref,
  actions,
  children,
  className = '',
}) => {
  return (
    <header
      className={`bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col gap-4 ${className}`}
    >
      {/* Breadcrumbs o Botón Volver */}
      {(breadcrumbs.length > 0 || backHref) && (
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:text-slate-900 transition-colors mr-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Volver</span>
            </Link>
          )}

          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={`${crumb.label}-${idx}`}>
                {idx > 0 && <span className="text-gray-300">/</span>}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-slate-900 transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'font-semibold text-gray-800' : ''}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Fila Principal: Título + Badges + ID de Proyecto + Slot de Acciones */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {icon && (
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/80 text-[#745B00] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>

              {projectId && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono font-bold text-slate-700">
                  #{projectId}
                </span>
              )}

              {badges.map((badge, index) => (
                <StatusBadge
                  key={`${badge.label}-${index}`}
                  status={badge.label}
                  variant={badge.variant}
                  icon={badge.icon}
                />
              ))}
            </div>

            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Slot para Botones de Acción */}
        {actions && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Slot inferior opcional (ej. MetadataGrid o barra de progreso) */}
      {children && (
        <div className="pt-4 border-t border-gray-100">{children}</div>
      )}
    </header>
  );
};
