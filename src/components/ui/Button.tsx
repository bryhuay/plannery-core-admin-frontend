'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  trailingIcon?: string;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  loading = false,
  loadingText,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F2C94C]/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#F2C94C] hover:bg-[#E5B935] text-slate-900 font-bold shadow-xs border border-[#E5B935]/40',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs border border-slate-900',
    outline:
      'bg-white border border-gray-200 hover:border-slate-900 hover:bg-gray-50 text-slate-800 shadow-2xs',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs border border-rose-700',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
            aria-hidden="true"
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon && (
            <span className="material-symbols-outlined text-[18px] leading-none shrink-0">
              {icon}
            </span>
          )}
          {children}
          {trailingIcon && (
            <span className="material-symbols-outlined text-[16px] leading-none shrink-0">
              {trailingIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
};
