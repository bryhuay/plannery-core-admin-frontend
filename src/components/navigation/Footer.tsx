'use client';

import React from 'react';
import { usePlanery } from '../../context/PlaneryContext';

export const Footer: React.FC = () => {
  const { showToast } = usePlanery();

  return (
    <footer className="w-full py-4 bg-[#F0F3FF] border-t border-[#E5E7EB] mt-auto shrink-0">
      <div className="flex flex-col sm:flex-row justify-between items-center px-6 lg:px-8 max-w-7xl mx-auto gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800">Planery Core</span>
          <span>© 2024 Planery Core. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => showToast('Política de Privacidad Corporativa Planery Core.')}
            className="hover:text-[#745b00] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => showToast('Términos de Servicio Empresarial Planery Core.')}
            className="hover:text-[#745b00] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => showToast('Mesa de ayuda empresarial: soporte@planerycore.pe')}
            className="hover:text-[#745b00] transition-colors cursor-pointer"
          >
            Support
          </button>
        </div>
      </div>
    </footer>
  );
};
