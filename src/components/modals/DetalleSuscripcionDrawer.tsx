'use client';

import React, { useState } from 'react';
import { SubscriptionItem } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface DetalleSuscripcionDrawerProps {
  subscription: SubscriptionItem | null;
  onClose: () => void;
  onOpenCambiarPlan: (sub: SubscriptionItem) => void;
  onOpenRegistrarPago: (sub: SubscriptionItem) => void;
}

export const DetalleSuscripcionDrawer: React.FC<
  DetalleSuscripcionDrawerProps
> = ({
  subscription,
  onClose,
  onOpenCambiarPlan,
  onOpenRegistrarPago,
}) => {
  const {
    updateSubscriptionStatus,
    retryRejectedSubscriptionInvoice,
    showToast,
  } = usePlanery();

  const [invoiceFilter, setInvoiceFilter] = useState<
    'all' | 'Pagado' | 'Rechazado' | 'Pendiente'
  >('all');

  if (!subscription) return null;

  const subtotal = subscription.amount / 1.18;
  const igv = subscription.amount - subtotal;

  const rejectedCount = subscription.invoices.filter(
    (i) => i.status === 'Rechazado'
  ).length;
  const paidCount = subscription.invoices.filter(
    (i) => i.status === 'Pagado'
  ).length;
  const pendingCount = subscription.invoices.filter(
    (i) => i.status === 'Pendiente'
  ).length;

  const filteredInvoices = subscription.invoices.filter((inv) =>
    invoiceFilter === 'all' ? true : inv.status === invoiceFilter
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-[#1E222D]/40 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 bottom-0 w-[540px] max-w-full bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
        {/* Header del Drawer */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-[#F0F3FF]">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Detalle de suscripción
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  subscription.status === 'Activa'
                    ? 'bg-emerald-100 text-emerald-800'
                    : subscription.status === 'Vencida' ||
                      subscription.status === 'Suspendida'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {subscription.status}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-1 font-mono">
              {subscription.code} • {subscription.companyName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-slate-200 custom-scroll">
          {/* 1. Datos de la Empresa */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Empresa Asociada
              </span>
              <button
                type="button"
                onClick={() =>
                  showToast(`Ficha corporativa de ${subscription.companyName}`)
                }
                className="inline-flex items-center gap-1 text-xs text-[#745b00] hover:underline font-semibold cursor-pointer"
              >
                <span>Ver empresa</span>
                <span className="material-symbols-outlined text-[14px]">
                  open_in_new
                </span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between">
              <div>
                <div className="text-base font-bold text-slate-900">
                  {subscription.companyName}
                </div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">
                  RUC: {subscription.ruc} · {subscription.city}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Cuenta corporativa verificada
                </div>
              </div>
              <span className="w-10 h-10 rounded-lg bg-[#E7EEFE] text-slate-700 flex items-center justify-center font-bold text-sm">
                {subscription.initials}
              </span>
            </div>
          </div>

          {/* 2. Plan y Estado Actual */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Plan y Membresía
              </span>
              <button
                type="button"
                onClick={() => onOpenCambiarPlan(subscription)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#745b00] hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  edit
                </span>
                <span>Editar plan</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#F0F3FF] border border-slate-200">
                <span className="text-xs text-slate-500 block">
                  Plan Actual
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {subscription.plan}
                </span>
                <span className="text-xs text-slate-500">
                  Periodicidad {subscription.billingCycle}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#F0F3FF] border border-slate-200">
                <span className="text-xs text-slate-500 block">
                  Precio Facturado
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block tabular-nums">
                  S/{' '}
                  {subscription.amount.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xs text-slate-500">
                  Incluye impuestos ({subscription.billingCycle})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="flex flex-col">
                <span className="text-slate-500">Fecha de inicio:</span>
                <span className="font-medium text-slate-900">
                  {subscription.startDate}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500">Próxima renovación:</span>
                <span className="font-semibold text-emerald-700">
                  {subscription.nextBillingDate}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Resumen de facturación */}
          <div className="pt-6 space-y-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">
              Resumen de Facturación
            </span>
            <div className="p-4 rounded-xl border border-slate-200 bg-[#F0F3FF]/50 space-y-2 text-sm tabular-nums">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Subtotal de membresía ({subscription.plan})</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs">
                <span>I.G.V. (18%)</span>
                <span>S/ {igv.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total por ciclo ({subscription.billingCycle})</span>
                <span className="text-[#745b00]">
                  S/ {subscription.amount.toFixed(2)} PEN
                </span>
              </div>
            </div>
          </div>

          {/* 4. Método de pago */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Método de Pago Actual
              </span>
              <button
                type="button"
                onClick={() => onOpenCambiarPlan(subscription)}
                className="text-xs text-[#745b00] hover:underline font-semibold cursor-pointer"
              >
                Actualizar método
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-7 rounded border border-slate-200 bg-slate-50 flex items-center justify-center font-bold text-[11px] text-blue-900 tracking-tight">
                  {subscription.paymentMethod.toLowerCase().includes('master')
                    ? 'MC'
                    : subscription.paymentMethod.toLowerCase().includes('visa')
                    ? 'VISA'
                    : 'B2B'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {subscription.cardEnding
                      ? `Tarjeta que termina en ${subscription.cardEnding}`
                      : subscription.paymentMethod}
                  </div>
                  <div className="text-xs text-slate-500">
                    {subscription.cardExpiry
                      ? `Expira ${subscription.cardExpiry} • Débito automático activo`
                      : 'Facturación corporativa verificada'}
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                check_circle
              </span>
            </div>
          </div>

          {/* 5. Historial Detallado de Pagos (con ID único, Fecha/Hora, Plan pagado y Rechazados) */}
          <div className="pt-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">
                  Historial Detallado de Pagos
                </span>
                <span className="text-[11px] text-slate-400">
                  Registro de transacciones con ID único, fecha/hora, plan y rechazos
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenRegistrarPago(subscription)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#F2C94C] text-slate-800 hover:text-[#241A00] text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  add
                </span>
                <span>Nuevo cobro</span>
              </button>
            </div>

            {/* Filtros rápidos de estado de transacción */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setInvoiceFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  invoiceFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos ({subscription.invoices.length})
              </button>
              <button
                type="button"
                onClick={() => setInvoiceFilter('Pagado')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  invoiceFilter === 'Pagado'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Pagados ({paidCount})
              </button>
              <button
                type="button"
                onClick={() => setInvoiceFilter('Rechazado')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  invoiceFilter === 'Rechazado'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Rechazados ({rejectedCount})
              </button>
              {pendingCount > 0 && (
                <button
                  type="button"
                  onClick={() => setInvoiceFilter('Pendiente')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    invoiceFilter === 'Pendiente'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Pendientes ({pendingCount})
                </button>
              )}
            </div>

            {/* Lista de transacciones */}
            <div className="space-y-2.5">
              {filteredInvoices.length === 0 ? (
                <div className="p-4 rounded-xl border border-slate-200 text-xs text-slate-500 text-center bg-slate-50/50">
                  No hay transacciones registradas en este filtro.
                </div>
              ) : (
                filteredInvoices.map((inv) => {
                  const isRejected = inv.status === 'Rechazado';
                  const isPending = inv.status === 'Pendiente';
                  const planPaid = inv.planName || subscription.plan;

                  return (
                    <div
                      key={inv.id}
                      className={`p-3.5 rounded-xl border transition-colors space-y-2 ${
                        isRejected
                          ? 'bg-rose-50/40 border-rose-200 hover:bg-rose-50/70'
                          : isPending
                          ? 'bg-amber-50/30 border-amber-200 hover:bg-amber-50/60'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {/* Top row: ID Único + Recibo + Monto + Estado */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isRejected
                                ? 'bg-rose-100 text-rose-600'
                                : isPending
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isRejected
                                ? 'error'
                                : isPending
                                ? 'schedule'
                                : 'receipt_long'}
                            </span>
                          </div>

                          <div className="min-w-0">
                            {/* Unique ID + Receipt Code */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded"
                                title="ID único de transacción"
                              >
                                ID: {inv.id}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                • #{inv.code}
                              </span>
                            </div>

                            {/* Plan de Suscripción Pagado */}
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  planPaid === 'Enterprise'
                                    ? 'bg-[#ffe08b] text-[#584400]'
                                    : planPaid === 'Profesional'
                                    ? 'bg-[#dce2f7] text-[#141b2b]'
                                    : 'bg-slate-200 text-slate-800'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[12px]">
                                  workspace_premium
                                </span>
                                Plan {planPaid}
                              </span>
                              <span className="text-[11px] text-slate-600 font-medium">
                                {inv.billingPeriod ||
                                  `Ciclo ${subscription.billingCycle}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Amount & Status Badge */}
                        <div className="text-right tabular-nums shrink-0">
                          <div
                            className={`text-sm font-extrabold ${
                              isRejected
                                ? 'text-rose-700 line-through'
                                : 'text-slate-900'
                            }`}
                          >
                            S/ {inv.amount.toFixed(2)}
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${
                              inv.status === 'Pagado'
                                ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                                : inv.status === 'Rechazado'
                                ? 'text-rose-800 bg-rose-100 border-rose-300'
                                : 'text-amber-800 bg-amber-50 border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                inv.status === 'Pagado'
                                  ? 'bg-emerald-600'
                                  : inv.status === 'Rechazado'
                                  ? 'bg-rose-600'
                                  : 'bg-amber-600'
                              }`}
                            />
                            {inv.status}
                          </span>
                        </div>
                      </div>

                      {/* Metadata: Date, Exact Time & Payment Method */}
                      <div className="pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">
                            calendar_clock
                          </span>
                          {inv.date} · {inv.time || '09:15:00 AM'}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">
                            credit_card
                          </span>
                          {inv.method}
                        </span>
                      </div>

                      {/* Rejection Alert + Retry Action if Rechazado */}
                      {isRejected && (
                        <div className="p-2.5 rounded-lg bg-rose-100/70 border border-rose-200/90 flex items-center justify-between gap-2 text-[11px] text-rose-900">
                          <div className="flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-rose-600 shrink-0 mt-0.5">
                              warning
                            </span>
                            <span>
                              <strong>Motivo de rechazo:</strong>{' '}
                              {inv.rejectionReason ||
                                'Transacción denegada por el banco emisor.'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              retryRejectedSubscriptionInvoice(
                                subscription.id,
                                inv.id
                              )
                            }
                            className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-800 text-white font-bold text-[10px] shrink-0 transition-colors cursor-pointer"
                          >
                            Reintentar cobro
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer fijo del Drawer */}
        <div className="p-4 px-6 border-t border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              updateSubscriptionStatus(subscription.id, 'Suspendida');
            }}
            className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Suspender suscripción
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenCambiarPlan(subscription)}
              className="px-3.5 py-2 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                swap_horiz
              </span>
              <span>Cambiar plan</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenRegistrarPago(subscription)}
              className="px-4 py-2 bg-[#F2C94C] hover:bg-[#ebc246] text-[#241a00] rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Registrar pago
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
