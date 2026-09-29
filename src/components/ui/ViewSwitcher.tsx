'use client';

import React from 'react';

export interface ViewSwitcherItem<T extends string = string> {
  id: T;
  label: string;
  icon?: string;
  count?: number;
  badgeColorClass?: string;
}

export interface ViewSwitcherProps<T extends string = string> {
  items: ViewSwitcherItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  variant?: 'segmented' | 'underline';
  size?: 'sm' | 'md';
  fullWidthOnMobile?: boolean;
  className?: string;
}

export function ViewSwitcher<T extends string = string>({
  items,
  activeId,
  onChange,
  variant = 'segmented',
  size = 'md',
  fullWidthOnMobile = false,
  className = '',
}: ViewSwitcherProps<T>) {
  if (variant === 'underline') {
    return (
      <div
        className={`border-b border-gray-200 overflow-x-auto no-scrollbar ${className}`}
        role="tablist"
      >
        <nav className="flex items-center gap-1 sm:gap-2 min-w-max">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(item.id)}
                className={`relative inline-flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#F2C94C] text-slate-900 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                {item.icon && (
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isActive ? 'text-[#745B00]' : 'text-gray-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
                {typeof item.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-[#F2C94C]/25 text-slate-900'
                        : item.badgeColorClass || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80 overflow-x-auto max-w-full ${
        fullWidthOnMobile ? 'w-full sm:w-auto' : ''
      } ${className}`}
      role="tablist"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              fullWidthOnMobile ? 'flex-1 sm:flex-initial' : ''
            } ${
              size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-1.5 text-xs sm:text-sm'
            } ${
              isActive
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-gray-200/70'
                : 'text-gray-600 hover:text-slate-900'
            }`}
          >
            {item.icon && (
              <span
                className={`material-symbols-outlined text-[16px] leading-none ${
                  isActive ? 'text-[#745B00]' : 'text-gray-400'
                }`}
              >
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {typeof item.count === 'number' && (
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  isActive
                    ? 'bg-amber-100 text-amber-900'
                    : item.badgeColorClass || 'bg-gray-200/80 text-gray-600'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
