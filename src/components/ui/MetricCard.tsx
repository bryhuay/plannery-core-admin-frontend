import React from 'react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconBgClass?: string;
  subtext?: string;
  badgeText?: string;
  badgeClass?: string;
  dotColorClass?: string;
  valueClassName?: string;
  variant?: 'default' | 'alert';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  iconBgClass = 'bg-slate-100 text-slate-700',
  subtext,
  badgeText,
  badgeClass = 'bg-amber-100 text-amber-900',
  dotColorClass,
  valueClassName = 'text-slate-900',
  variant = 'default',
}) => {
  return (
    <div
      className={`rounded-xl p-5 border shadow-sm flex flex-col justify-between transition-colors ${
        variant === 'alert'
          ? 'bg-red-50/60 border-red-200'
          : 'bg-white border-[#E5E7EB]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            variant === 'alert' ? 'text-red-600' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBgClass}`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span
          className={`text-2xl font-bold tracking-tight tabular-nums ${valueClassName}`}
        >
          {value}
        </span>
        {badgeText && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${badgeClass}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtext && (
        <div
          className={`mt-1.5 text-xs font-medium flex items-center gap-1.5 ${
            variant === 'alert' ? 'text-red-600' : 'text-slate-600'
          }`}
        >
          {dotColorClass && (
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorClass}`} />
          )}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
};
