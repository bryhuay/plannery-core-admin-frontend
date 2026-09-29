'use client';

import React, { useState } from 'react';
import { SubscriptionItem } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';
import { SubscriptionDetailDrawer } from '../../components/modals/SubscriptionDetailDrawer';
import {
  ChangeSubscriptionPlanModal,
  RegisterSubscriptionPaymentModal,
  PlansCatalogModal,
} from '../../components/modals/SubscriptionPlanModals';

export default function SubscriptionsPage() {
  const { subscriptions, showToast } = usePlanery();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [planFilter, setPlanFilter] = useState('Todos los planes');
  const [cycleFilter, setCycleFilter] = useState('Todas las periodicidades');

  // Store ID instead of static snapshot so live edits reflect immediately
  const [selectedSubId, setSelectedSubId] = useState<string | null>(
    subscriptions[0]?.id || null
  );
  const [subForPlanModalId, setSubForPlanModalId] = useState<string | null>(
    null
  );
  const [preselectedPlan, setPreselectedPlan] = useState<
    SubscriptionItem['plan'] | null
  >(null);
  const [preselectedCycle, setPreselectedCycle] = useState<
    SubscriptionItem['billingCycle'] | null
  >(null);
  const [isPlansCatalogOpen, setIsPlansCatalogOpen] = useState(false);
  const [subForPaymentModalId, setSubForPaymentModalId] = useState<
    string | null
  >(null);

  const selectedSub =
    subscriptions.find((s) => s.id === selectedSubId) || null;
  const subForPlanModal =
    subscriptions.find((s) => s.id === subForPlanModalId) || null;
  const subForPaymentModal =
    subscriptions.find((s) => s.id === subForPaymentModalId) || null;

  const filtered = subscriptions.filter((sub) => {
    const matchSearch =
      !searchQuery.trim() ||
      sub.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.ruc.includes(searchQuery) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === 'Todos los estados' ||
      sub.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchPlan =
      planFilter === 'Todos los planes' || sub.plan === planFilter;
    const matchCycle =
      cycleFilter === 'Todas las periodicidades' ||
      sub.billingCycle === cycleFilter;
    return matchSearch && matchStatus && matchPlan && matchCycle;
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* ENCABEZADO DE PÁGINA Y ACCIONES GLOBALES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#3d4756] text-white text-[10px] font-bold uppercase tracking-wider mb-2">
            Super Admin · Plataforma Global
          </div>
          <h1 className="text-2xl sm:text-[32px] sm:leading-[40px] font-bold text-slate-900 tracking-tight">
            Suscripciones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los planes, membresías, historial de transacciones y
            renovaciones de las empresas que utilizan Planery Core.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPlansCatalogOpen(true)}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-xs font-semibold hover:bg-[#f0f3ff] transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              inventory_2
            </span>
            <span>Ver planes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPreselectedPlan(null);
              setPreselectedCycle(null);
              setSubForPlanModalId(
                selectedSub?.id || subscriptions[0]?.id || null
              );
            }}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-4 py-2 bg-[#F2C94C] hover:bg-[#ebc246] text-[#241A00] rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              swap_horiz
            </span>
            <span>Cambiar / Editar Plan</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS (5 tarjetas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 tabular-nums">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Suscripciones activas
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#e2e8f8]/60 text-slate-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">
                verified
              </span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">86</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">
                arrow_upward
              </span>
              +4 este mes
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              En periodo de prueba
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#e2e8f8]/60 text-slate-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">12</span>
            <span className="px-2 py-0.5 rounded-full bg-[#dce2f7] text-[#141b2b] text-[11px] font-semibold">
              Activas
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Pendientes de pago
            </span>
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">
                pending_actions
              </span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">8</span>
            <span className="px-2 py-0.5 rounded-full bg-[#ffe08b] text-[#584400] text-[11px] font-semibold">
              Atención req.
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Vencidas</span>
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">
                warning
              </span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600">5</span>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-semibold">
              Por suspender
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              MRR Recurrente
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#F2C94C]/30 text-[#745b00] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">
                payments
              </span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">S/ 24,500</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
              +12% vs ant.
            </span>
          </div>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS Y FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row flex-wrap lg:grid lg:grid-cols-12 gap-3 items-stretch sm:items-center">
          <div className="w-full sm:flex-1 lg:col-span-4 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar empresa por nombre, RUC o ID..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C]"
            />
          </div>

          <div className="w-full sm:w-auto lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Todos los estados</option>
              <option value="Activa">Activa</option>
              <option value="Prueba">En prueba</option>
              <option value="Pendiente">Pendiente de pago</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>

          <div className="w-full sm:w-auto lg:col-span-2">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Todos los planes</option>
              <option value="Starter">Starter</option>
              <option value="Profesional">Profesional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          <div className="w-full sm:w-auto lg:col-span-2">
            <select
              value={cycleFilter}
              onChange={(e) => setCycleFilter(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Todas las periodicidades</option>
              <option value="Mensual">Mensual</option>
              <option value="Anual">Anual</option>
            </select>
          </div>

          <div className="w-full sm:w-auto lg:col-span-1 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('Todos los estados');
                setPlanFilter('Todos los planes');
                setCycleFilter('Todas las periodicidades');
              }}
              title="Limpiar filtros"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                filter_alt_off
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* TABLA AVANZADA DE SUSCRIPCIONES */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f3ff] border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-[#745b00]"
                  />
                </th>
                <th className="py-4 px-4">Empresa</th>
                <th className="py-4 px-4">Plan</th>
                <th className="hidden md:table-cell py-4 px-4">Periodicidad</th>
                <th className="py-4 px-4">Importe</th>
                <th className="py-4 px-4">Estado</th>
                <th className="hidden lg:table-cell py-4 px-4">Próximo cobro</th>
                <th className="hidden md:table-cell py-4 px-4">Método / Historial</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-900 tabular-nums">
              {filtered.map((sub) => {
                const isSelected = selectedSubId === sub.id;
                const rejectedInvoicesCount = sub.invoices.filter(
                  (i) => i.status === 'Rechazado'
                ).length;

                return (
                  <tr
                    key={sub.id}
                    onClick={() => setSelectedSubId(sub.id)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#e7eefe]/40 hover:bg-[#e7eefe]/60'
                        : 'hover:bg-[#f0f3ff]'
                    }`}
                  >
                    <td
                      className="py-4 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => setSelectedSubId(sub.id)}
                        className="rounded border-slate-300 text-[#745b00]"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-[#745b00] transition-colors">
                          {sub.companyName}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          RUC {sub.ruc} • {sub.city}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            sub.plan === 'Enterprise'
                              ? 'bg-[#ffe08b] text-[#584400]'
                              : sub.plan === 'Profesional'
                              ? 'bg-[#dce2f7] text-[#141b2b]'
                              : 'bg-[#e2e8f8] text-slate-700'
                          }`}
                        >
                          {sub.plan}
                        </span>
                        <button
                          type="button"
                          title="Cambiar o editar plan de la empresa"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSubForPlanModalId(sub.id);
                          }}
                          className="p-1 rounded hover:bg-slate-200/70 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            edit
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-4 px-4 text-slate-600">
                      {sub.billingCycle}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      S/{' '}
                      {sub.amount.toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      <span className="font-normal text-xs text-slate-500">
                        / {sub.billingCycle === 'Anual' ? 'año' : 'mes'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          sub.status === 'Activa'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : sub.status === 'Pendiente de pago'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : sub.status.includes('Prueba')
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-[#ffdad6] text-[#93000a] border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            sub.status === 'Activa'
                              ? 'bg-emerald-600'
                              : sub.status === 'Pendiente de pago'
                              ? 'bg-amber-600'
                              : sub.status.includes('Prueba')
                              ? 'bg-sky-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        {sub.status}
                      </span>
                    </td>
                    <td
                      className={`hidden lg:table-cell py-4 px-4 font-medium ${
                        sub.status === 'Vencida'
                          ? 'text-rose-600'
                          : sub.status === 'Pendiente de pago'
                          ? 'text-amber-700'
                          : 'text-slate-900'
                      }`}
                    >
                      {sub.nextBillingDate}
                    </td>
                    <td className="hidden md:table-cell py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">
                            {sub.paymentIcon}
                          </span>
                          <span>{sub.paymentMethod}</span>
                        </div>
                        {rejectedInvoicesCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded w-fit">
                            <span className="material-symbols-outlined text-[12px]">
                              error
                            </span>
                            {rejectedInvoicesCount}{' '}
                            {rejectedInvoicesCount === 1
                              ? 'pago rechazado'
                              : 'pagos rechazados'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      className="py-4 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSubForPlanModalId(sub.id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:border-slate-900 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          Cambiar plan
                        </button>
                        <button
                          type="button"
                          title="Ver detalle e historial de pagos"
                          onClick={() => setSelectedSubId(sub.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[19px]">
                            visibility
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="py-3 px-4 border-t border-slate-200 bg-[#f0f3ff] flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando 1 - {filtered.length} de 111 suscripciones activas
          </span>
          <div className="flex items-center gap-1">
            <span className="px-2.5 py-1 font-semibold text-slate-900 bg-[#e7eefe] rounded">
              1
            </span>
            <button
              type="button"
              className="px-2.5 py-1 hover:bg-slate-200 rounded transition-colors"
            >
              2
            </button>
            <button
              type="button"
              className="px-2.5 py-1 hover:bg-slate-200 rounded transition-colors"
            >
              3
            </button>
          </div>
        </div>
      </div>

      {/* DRAWER LATERAL DE DETALLE DE SUSCRIPCIÓN */}
      <SubscriptionDetailDrawer
        subscription={selectedSub}
        onClose={() => setSelectedSubId(null)}
        onOpenCambiarPlan={(sub) => setSubForPlanModalId(sub.id)}
        onOpenRegistrarPago={(sub) => setSubForPaymentModalId(sub.id)}
      />

      {/* MODAL DE CATÁLOGO DE PLANES DISPONIBLES */}
      <PlansCatalogModal
        isOpen={isPlansCatalogOpen}
        onClose={() => setIsPlansCatalogOpen(false)}
        onSelectPlanForCompany={(plan, cycle) => {
          setIsPlansCatalogOpen(false);
          setPreselectedPlan(plan);
          setPreselectedCycle(cycle);
          setSubForPlanModalId(
            selectedSub?.id || subscriptions[0]?.id || null
          );
        }}
        onFilterByPlan={(plan) => {
          setPlanFilter(plan);
          showToast(`Mostrando suscripciones con el Plan ${plan}.`);
        }}
      />

      {/* MODAL PARA CAMBIAR / EDITAR PLAN DE SUSCRIPCIÓN */}
      <ChangeSubscriptionPlanModal
        isOpen={Boolean(subForPlanModal)}
        subscription={subForPlanModal}
        initialPlan={preselectedPlan}
        initialCycle={preselectedCycle}
        onClose={() => {
          setSubForPlanModalId(null);
          setPreselectedPlan(null);
          setPreselectedCycle(null);
        }}
      />

      {/* MODAL PARA REGISTRAR PAGO O INTENTO RECHAZADO */}
      <RegisterSubscriptionPaymentModal
        isOpen={Boolean(subForPaymentModal)}
        subscription={subForPaymentModal}
        onClose={() => setSubForPaymentModalId(null)}
      />
    </main>
  );
}
