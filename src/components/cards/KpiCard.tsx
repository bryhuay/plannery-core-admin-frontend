'use client';

import React from 'react';

export interface KpiCardProps {
  title: string;
  amount: string | number;
  subtitle?: string;
  icon: string;
  iconBgClass?: string;
  progressPercent?: number;
  progressColorClass?: string;
  progressLabel?: string;
  badgeText?: string;
  badgeColorClass?: string;
  variant?: 'default' | 'highlight' | 'danger';
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  amount,
  subtitle,
  icon,
  iconBgClass = 'bg-amber-50 text-[#745B00]',
  progressPercent,
  progressColorClass = 'bg-[#F2C94C]',
  progressLabel,
  badgeText,
  badgeColorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200',
  variant = 'default',
  onClick,
  className = '',
}) => {
  const clampedProgress =
    typeof progressPercent === 'number'
      ? Math.max(0, Math.min(100, progressPercent))
      : undefined;

  const containerStyle =
    variant === 'danger'
      ? 'bg-rose-50/50 border-rose-200'
      : variant === 'highlight'
      ? 'bg-slate-900 border-slate-800 text-white'
      : 'bg-white border-gray-200';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 border shadow-2xs flex flex-col justify-between transition-all ${containerStyle} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
    >
      {/* Fila Superior: Título + Icono */}
      <div className="flex items-start justify-between gap-3">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${
            variant === 'highlight'
              ? 'text-slate-400'
              : variant === 'danger'
              ? 'text-rose-700'
              : 'text-gray-500'
          }`}
        >
          {title}
        </span>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>

      {/* Monto Principal + Badge Opcional */}
      <div className="mt-3 flex items-baseline justify-between gap-2 flex-wrap">
        <span
          className={`text-2xl sm:text-[26px] font-extrabold tracking-tight tabular-nums ${
            variant === 'highlight'
              ? 'text-white'
              : variant === 'danger'
              ? 'text-rose-700'
              : 'text-slate-900'
          }`}
        >
          {amount}
        </span>

        {badgeText && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${badgeColorClass}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Barra de Progreso Opcional */}
      {typeof clampedProgress === 'number' && (
        <div className="mt-3.5 space-y-1.5">
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressColorClass}`}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
          {progressLabel && (
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>{progressLabel}</span>
              <span className="font-bold text-slate-700">{clampedProgress}%</span>
            </div>
          )}
        </div>
      )}

      {/* Subtítulo Inferior */}
      {subtitle && (
        <p
          className={`mt-2.5 text-xs font-medium leading-snug ${
            variant === 'highlight'
              ? 'text-slate-300'
              : variant === 'danger'
              ? 'text-rose-600'
              : 'text-gray-500'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
