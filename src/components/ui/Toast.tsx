'use client';

import React from 'react';
import { usePlanery } from '../../context/PlaneryContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = usePlanery();

  return (
    <div
      className={`fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2.5 transition-all duration-300 z-50 ${
        toast.visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <span
        className={`material-symbols-outlined text-[18px] ${
          toast.type === 'warning'
            ? 'text-amber-400'
            : toast.type === 'error'
            ? 'text-rose-400'
            : 'text-emerald-400'
        }`}
      >
        {toast.type === 'warning'
          ? 'warning'
          : toast.type === 'error'
          ? 'error'
          : 'check_circle'}
      </span>
      <span className="font-medium">{toast.message}</span>
      <button
        type="button"
        onClick={hideToast}
        className="ml-2 text-slate-400 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
