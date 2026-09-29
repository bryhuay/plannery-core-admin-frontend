'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  prefixText?: string;
  suffixText?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      onRightIconClick,
      prefixText,
      suffixText,
      required,
      disabled,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
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

          {prefixText && !leftIcon && (
            <span className="text-xs font-bold text-gray-500 absolute left-3.5 pointer-events-none select-none">
              {prefixText}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={`w-full rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 py-2.5 transition-all focus:outline-none ${
              leftIcon
                ? 'pl-9'
                : prefixText
                ? 'pl-9'
                : 'pl-3.5'
            } ${
              rightIcon || suffixText ? 'pr-10' : 'pr-3.5'
            } ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-gray-200 focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/30'
            } ${
              disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            } ${className}`}
            {...props}
          />

          {suffixText && !rightIcon && (
            <span className="text-xs font-semibold text-gray-400 absolute right-3.5 pointer-events-none select-none">
              {suffixText}
            </span>
          )}

          {rightIcon && (
            <button
              type="button"
              tabIndex={onRightIconClick ? 0 : -1}
              onClick={onRightIconClick}
              className={`absolute right-2.5 p-1 rounded-lg text-gray-400 transition-colors ${
                onRightIconClick
                  ? 'hover:text-gray-700 hover:bg-gray-100 cursor-pointer'
                  : 'pointer-events-none'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] leading-none">
                {rightIcon}
              </span>
            </button>
          )}
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

Input.displayName = 'Input';
