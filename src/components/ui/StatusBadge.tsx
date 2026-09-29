'use client';

import React from 'react';

export type StatusBadgeVariant =
  | 'Confirmado'
  | 'En progreso'
  | 'En evaluación'
  | 'Sobre presupuesto'
  | 'Pendiente'
  | 'Pagado'
  | 'Activa'
  | 'Activo'
  | 'Planificación'
  | 'Cerca del límite'
  | 'Dentro del presupuesto'
  | 'Seleccionado'
  | 'Cancelado'
  | 'Vencida'
  | 'Prueba'
  | string;

export interface StatusBadgeProps {
  status: StatusBadgeVariant;
  variant?:
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'purple'
    | 'neutral'
    | 'auto';
  showDot?: boolean;
  icon?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'auto',
  showDot = true,
  icon,
  size = 'sm',
  className = '',
}) => {
  const normalized = status.toLowerCase();

  let badgeColors = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColors = 'bg-slate-500';

  if (variant !== 'auto') {
    const manualMap: Record<
      Exclude<NonNullable<StatusBadgeProps['variant']>, 'auto'>,
      { badge: string; dot: string }
    > = {
      success: {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
      },
      warning: {
        badge: 'bg-amber-50 text-amber-900 border-amber-200',
        dot: 'bg-amber-500',
      },
      danger: {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      },
      info: {
        badge: 'bg-sky-50 text-sky-800 border-sky-200',
        dot: 'bg-sky-500',
      },
      purple: {
        badge: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
      },
      neutral: {
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-500',
      },
    };
    badgeColors = manualMap[variant].badge;
    dotColors = manualMap[variant].dot;
  } else if (
    normalized.includes('confirmado') ||
    normalized.includes('pagado') ||
    normalized.includes('activo') ||
    normalized.includes('activa') ||
    normalized.includes('dentro del presupuesto') ||
    normalized.includes('completada') ||
    normalized.includes('contrato')
  ) {
    badgeColors = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColors = 'bg-emerald-500';
  } else if (
    normalized.includes('en progreso') ||
    normalized.includes('planificación') ||
    normalized.includes('cerca del límite') ||
    normalized.includes('en evaluación') ||
    normalized.includes('pendiente') ||
    normalized.includes('media') ||
    normalized.includes('comprobante')
  ) {
    badgeColors = 'bg-amber-50 text-amber-900 border-amber-200';
    dotColors = 'bg-amber-500';
  } else if (
    normalized.includes('seleccionado') ||
    normalized.includes('programado') ||
    normalized.includes('prueba') ||
    normalized.includes('cotización')
  ) {
    badgeColors = 'bg-sky-50 text-sky-800 border-sky-200';
    dotColors = 'bg-sky-500';
  } else if (
    normalized.includes('cancelado') ||
    normalized.includes('sobre presupuesto') ||
    normalized.includes('atrasada') ||
    normalized.includes('alta') ||
    normalized.includes('vencida') ||
    normalized.includes('anulado')
  ) {
    badgeColors = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColors = 'bg-rose-500';
  } else if (normalized.includes('técnico') || normalized.includes('plano')) {
    badgeColors = 'bg-purple-50 text-purple-700 border-purple-200';
    dotColors = 'bg-purple-500';
  }

  const sizeClasses: Record<NonNullable<StatusBadgeProps['size']>, string> = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap ${sizeClasses[size]} ${badgeColors} ${className}`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-[14px] leading-none shrink-0">
          {icon}
        </span>
      ) : (
        showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors}`} />
      )}
      <span>{status}</span>
    </span>
  );
};
