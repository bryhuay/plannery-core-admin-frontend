'use client';

import React from 'react';

export interface MetadataItem {
  id?: string;
  label: string;
  value: React.ReactNode;
  subValue?: string;
  icon: string;
  iconColorClass?: string;
}

export interface MetadataGridProps {
  items: MetadataItem[];
  columns?: 2 | 3 | 4;
  variant?: 'clean' | 'boxed';
  className?: string;
}

export const MetadataGrid: React.FC<MetadataGridProps> = ({
  items,
  columns = 4,
  variant = 'boxed',
  className = '',
}) => {
  const gridColClasses: Record<NonNullable<MetadataGridProps['columns']>, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridColClasses[columns]} gap-3 sm:gap-4 ${className}`}>
      {items.map((item, idx) => (
        <div
          key={item.id || `${item.label}-${idx}`}
          className={`flex items-start gap-3 min-w-0 ${
            variant === 'boxed'
              ? 'p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/80'
              : 'py-1'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              item.iconColorClass || 'bg-white border border-gray-200 text-slate-700 shadow-2xs'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {item.label}
            </p>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
              {item.value}
            </div>
            {item.subValue && (
              <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.subValue}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
