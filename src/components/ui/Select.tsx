'use client';

import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  leftIcon?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder,
      helperText,
      error,
      leftIcon,
      required,
      disabled,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-gray-700 tracking-tight"
          >
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="material-symbols-outlined text-gray-400 text-[18px] absolute left-3 pointer-events-none select-none">
              {leftIcon}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={`w-full appearance-none rounded-xl border bg-white text-sm text-gray-900 py-2.5 pr-9 transition-all cursor-pointer focus:outline-none ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-gray-200 focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/30'
            } ${
              disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="material-symbols-outlined text-gray-400 text-[18px] absolute right-3 pointer-events-none select-none">
            expand_more
          </span>
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-gray-500 leading-relaxed">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
