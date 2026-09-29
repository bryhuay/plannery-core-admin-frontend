'use client';

import React, { useState } from 'react';
import { Link } from '../../lib/navigation';
import { TabPagosEvento } from '../../components/eventos/TabFinanzas';
import { RegistrarPagoDrawer } from '../../components/modals/RegistrarPagoDrawer';

export default function PagosGlobalPage() {
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-slate-900">
              Inicio
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">
              Tesorería y Pagos Corporativos
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Consolidado financiero y programación de abonos a proveedores.
          </p>
        </div>
        <Link
          href="/eventos/EV-2026-084"
          className="text-xs font-semibold text-[#745b00] hover:underline flex items-center gap-1"
        >
          <span>Ir al expediente EV-2026-084</span>
          <span className="material-symbols-outlined text-[16px]">
            open_in_new
          </span>
        </Link>
      </div>

      <TabPagosEvento onOpenRegistrarPago={() => setIsRegistrarOpen(true)} />

      <RegistrarPagoDrawer
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        eventId="EV-2026-084"
      />
    </main>
  );
}
