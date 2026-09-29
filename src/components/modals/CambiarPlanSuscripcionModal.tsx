'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionItem } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface PlanCatalogDetail {
  key: SubscriptionItem['plan'];
  name: string;
  badge: string;
  highlighted?: boolean;
  mensual: number;
  anual: number;
  ahorroAnual: number;
  subtitle: string;
  limits: {
    users: string;
    events: string;
    storage: string;
    support: string;
  };
  features: string[];
}

export const PLAN_CATALOG_LIST: PlanCatalogDetail[] = [
  {
    key: 'Starter',
    name: 'Plan Starter',
    badge: 'Agencias Emergentes',
    mensual: 180,
    anual: 1800,
    ahorroAnual: 360,
    subtitle:
      'Ideal para planners independientes y estudios pequeños que inician su operación digital.',
    limits: {
      users: 'Hasta 3 usuarios',
      events: 'Hasta 10 eventos activos',
      storage: '10 GB en documentos',
      support: 'Soporte estándar (Email)',
    },
    features: [
      'Hasta 3 usuarios con roles básicos',
      'Gestión de hasta 10 eventos simultáneos',
      'Calendario mensual, semanal, diario y agenda',
      'Directorio de clientes y proveedores',
      'Control básico de tareas operativas',
      '10 GB para contratos y cotizaciones PDF',
    ],
  },
  {
    key: 'Profesional',
    name: 'Plan Profesional',
    badge: 'Más Popular',
    highlighted: true,
    mensual: 350,
    anual: 3500,
    ahorroAnual: 700,
    subtitle:
      'Para empresas productoras y agencias en crecimiento que requieren control financiero total.',
    limits: {
      users: 'Hasta 15 usuarios',
      events: 'Eventos ilimitados',
      storage: '100 GB en documentos',
      support: 'Prioritario (WhatsApp + Email)',
    },
    features: [
      'Hasta 15 usuarios y permisos por módulo',
      'Eventos, cotizaciones y clientes ilimitados',
      'Módulo completo de Finanzas y Presupuestos',
      'Control de pagos a proveedores y cronogramas',
      'Reportes ejecutivos y exportación CSV/PDF',
      '100 GB de almacenamiento en la nube',
    ],
  },
  {
    key: 'Enterprise',
    name: 'Plan Enterprise',
    badge: 'Corporativo VIP',
    mensual: 420,
    anual: 4200,
    ahorroAnual: 840,
    subtitle:
      'Operación corporativa multi-sede con auditoría avanzada, API y soporte dedicado 24/7.',
    limits: {
      users: 'Usuarios ilimitados',
      events: 'Eventos y sedes ilimitados',
      storage: '1 TB dedicado',
      support: 'Account Manager 24/7 (SLA 99.9%)',
    },
    features: [
      'Usuarios, roles y sedes corporativas ilimitadas',
      'Multi-moneda (S/ PEN y $ USD) e impuestos',
      'Auditoría completa de actividad y seguridad',
      'Integración vía API, Webhooks y SSO',
      '1 TB de almacenamiento seguro y backups',
      'Gerente de cuenta dedicado y onboarding VIP',
    ],
  },
];

const PLAN_PRICING: Record<
  SubscriptionItem['plan'],
  { mensual: number; anual: number; subtitle: string; features: string[] }
> = {
  Starter: {
    mensual: 180,
    anual: 1800,
    subtitle: 'Para agencias emergentes y planners independientes',
    features: ['Hasta 3 usuarios', '10 eventos activos', 'Soporte estándar'],
  },
  Profesional: {
    mensual: 350,
    anual: 3500,
    subtitle: 'Para empresas de eventos en crecimiento',
    features: [
      'Hasta 15 usuarios',
      'Eventos ilimitados',
      'Auditoría y finanzas avanzadas',
    ],
  },
  Enterprise: {
    mensual: 420,
    anual: 4200,
    subtitle: 'Operación corporativa multi-sede y SLA prioritario',
    features: [
      'Usuarios ilimitados',
      'Multi-moneda & API',
      'Account Manager dedicado',
    ],
  },
};

/* ============================================================================
 * MODAL DE CATÁLOGO DE PLANES DISPONIBLES ("VER PLANES")
 * ========================================================================== */
export interface CatalogoPlanesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanForCompany: (
    plan: SubscriptionItem['plan'],
    cycle: SubscriptionItem['billingCycle']
  ) => void;
  onFilterByPlan?: (plan: SubscriptionItem['plan']) => void;
}

export const CatalogoPlanesModal: React.FC<CatalogoPlanesModalProps> = ({
  isOpen,
  onClose,
  onSelectPlanForCompany,
  onFilterByPlan,
}) => {
  const { subscriptions } = usePlanery();
  const [billingCycle, setBillingCycle] =
    useState<SubscriptionItem['billingCycle']>('Mensual');
  const [showComparison, setShowComparison] = useState<boolean>(true);

  if (!isOpen) return null;

  const getCompanyCountByPlan = (plan: SubscriptionItem['plan']) =>
    subscriptions.filter((s) => s.plan === plan).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl lg:max-w-5xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E222D] text-[#F2C94C] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">
                inventory_2
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Planes Disponibles en Planery Core
                </h3>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FEF9E7] text-[#745B00] border border-[#F2C94C]/50">
                  Catálogo Oficial 2026
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Consulta precios, límites operativos y asigna planes a las
                empresas registradas.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Toggle Mensual / Anual */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/80">
              {(['Mensual', 'Anual'] as const).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === cycle
                      ? 'bg-[#1E222D] text-[#F2C94C] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{cycle}</span>
                  {cycle === 'Anual' && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                      -17%
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Body scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Tarjetas de los 3 Planes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {PLAN_CATALOG_LIST.map((plan) => {
              const price =
                billingCycle === 'Anual' ? plan.anual : plan.mensual;
              const activeCount = getCompanyCountByPlan(plan.key);

              return (
                <div
                  key={plan.key}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-[#FEFBF0] to-white border-[#F2C94C] ring-2 ring-[#F2C94C]/40 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Badge & Empresas Activas */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          plan.highlighted
                            ? 'bg-[#F2C94C] text-[#241A00]'
                            : plan.key === 'Enterprise'
                            ? 'bg-[#1E222D] text-[#F2C94C]'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {plan.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        <span className="material-symbols-outlined text-[13px] text-slate-400">
                          domain
                        </span>
                        {activeCount}{' '}
                        {activeCount === 1 ? 'empresa' : 'empresas'}
                      </span>
                    </div>

                    {/* Nombre y descripción */}
                    <h4 className="text-lg font-extrabold text-slate-900">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {plan.subtitle}
                    </p>

                    {/* Precio */}
                    <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-baseline gap-1.5 tabular-nums">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        S/ {price.toLocaleString('es-PE')}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        / {billingCycle === 'Anual' ? 'año' : 'mes'}
                      </span>
                    </div>
                    {billingCycle === 'Anual' ? (
                      <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          savings
                        </span>
                        Ahorras S/ {plan.ahorroAnual} al año (2 meses gratis)
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">
                        O S/ {plan.anual.toLocaleString('es-PE')} en facturación
                        anual
                      </p>
                    )}

                    {/* Resumen de Límites */}
                    <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 text-[11px]">
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Usuarios
                        </span>
                        <span className="font-bold text-slate-800">
                          {plan.limits.users}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Eventos
                        </span>
                        <span className="font-bold text-slate-800">
                          {plan.limits.events}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Almacenamiento
                        </span>
                        <span className="font-bold text-slate-800">
                          {plan.limits.storage}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Nivel SLA
                        </span>
                        <span className="font-bold text-slate-800">
                          {plan.limits.support}
                        </span>
                      </div>
                    </div>

                    {/* Lista de beneficios */}
                    <div className="mt-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Incluye en el plan:
                      </span>
                      <ul className="space-y-2">
                        {plan.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-700"
                          >
                            <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Acciones de la tarjeta */}
                  <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPlanForCompany(plan.key, billingCycle);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        plan.highlighted
                          ? 'bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00]'
                          : 'bg-[#1E222D] hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        swap_horiz
                      </span>
                      <span>Asignar {plan.name} a empresa</span>
                    </button>

                    {onFilterByPlan && (
                      <button
                        type="button"
                        onClick={() => {
                          onFilterByPlan(plan.key);
                          onClose();
                        }}
                        className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Ver las {activeCount} empresas en {plan.key}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabla Comparativa Detallada */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="w-full px-4 py-3 flex items-center justify-between text-left bg-white hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#745B00]">
                  table_chart
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Comparativa detallada de módulos y capacidades
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-500">
                {showComparison ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showComparison && (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f0f3ff] border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-3 px-4">Capacidad / Módulo</th>
                      <th className="py-3 px-4 text-center">Starter</th>
                      <th className="py-3 px-4 text-center bg-[#FEF9E7]/60 text-[#584400]">
                        Profesional
                      </th>
                      <th className="py-3 px-4 text-center">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        Usuarios incluidos
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-600">
                        Hasta 3
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900 bg-[#FEF9E7]/30">
                        Hasta 15
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900">
                        Ilimitados
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        Eventos activos simultáneos
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-600">
                        10 eventos
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900 bg-[#FEF9E7]/30">
                        Ilimitados
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900">
                        Ilimitados + Multi-sede
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        Finanzas, Presupuestos y Pagos a Proveedores
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-400">
                        Básico
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-700 bg-[#FEF9E7]/30">
                        Completo
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-700">
                        Completo + Multi-moneda
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        Auditoría de Actividad y Roles Personalizados
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-400">
                        —
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-700 bg-[#FEF9E7]/30">
                        Incluido
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-700">
                        Avanzado + SSO / API
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cerrar catálogo
          </button>
          <button
            type="button"
            onClick={() => onSelectPlanForCompany('Profesional', billingCycle)}
            className="w-full sm:w-auto justify-center px-5 py-2 rounded-lg bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              swap_horiz
            </span>
            <span>Cambiar plan de una empresa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * MODAL PARA CAMBIAR / EDITAR PLAN DE UNA EMPRESA
 * ========================================================================== */
export interface CambiarPlanSuscripcionModalProps {
  isOpen: boolean;
  subscription: SubscriptionItem | null;
  initialPlan?: SubscriptionItem['plan'] | null;
  initialCycle?: SubscriptionItem['billingCycle'] | null;
  onClose: () => void;
}

export const CambiarPlanSuscripcionModal: React.FC<
  CambiarPlanSuscripcionModalProps
> = ({ isOpen, subscription, initialPlan, initialCycle, onClose }) => {
  const { subscriptions, updateSubscriptionPlan } = usePlanery();

  const [targetSubId, setTargetSubId] = useState<string>('');
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionItem['plan']>('Profesional');
  const [billingCycle, setBillingCycle] =
    useState<SubscriptionItem['billingCycle']>('Mensual');
  const [amount, setAmount] = useState<string>('350');
  const [status, setStatus] = useState<SubscriptionItem['status']>('Activa');
  const [nextBillingDate, setNextBillingDate] =
    useState<string>('15 Oct 2026');
  const [paymentMethod, setPaymentMethod] =
    useState<string>('Visa •••• 4242');
  const [recordInvoice, setRecordInvoice] = useState<boolean>(true);

  const activeSub =
    subscriptions.find((s) => s.id === targetSubId) || subscription;

  useEffect(() => {
    if (isOpen && subscription) {
      setTargetSubId(subscription.id);
      const planToUse = initialPlan || subscription.plan;
      const cycleToUse = initialCycle || subscription.billingCycle;
      setSelectedPlan(planToUse);
      setBillingCycle(cycleToUse);
      if (initialPlan || initialCycle) {
        const suggested =
          cycleToUse === 'Anual'
            ? PLAN_PRICING[planToUse].anual
            : PLAN_PRICING[planToUse].mensual;
        setAmount(String(suggested));
      } else {
        setAmount(String(subscription.amount));
      }
      setStatus(subscription.status);
      setNextBillingDate(subscription.nextBillingDate);
      setPaymentMethod(subscription.paymentMethod);
      setRecordInvoice(true);
    }
  }, [isOpen, subscription, initialPlan, initialCycle]);

  if (!isOpen || !activeSub) return null;

  const handleCompanyChange = (newSubId: string) => {
    setTargetSubId(newSubId);
    const found = subscriptions.find((s) => s.id === newSubId);
    if (found) {
      setStatus(found.status);
      setNextBillingDate(found.nextBillingDate);
      setPaymentMethod(found.paymentMethod);
      if (!initialPlan) {
        setSelectedPlan(found.plan);
        setBillingCycle(found.billingCycle);
        setAmount(String(found.amount));
      }
    }
  };

  const handleSelectPlan = (plan: SubscriptionItem['plan']) => {
    setSelectedPlan(plan);
    const suggested =
      billingCycle === 'Anual'
        ? PLAN_PRICING[plan].anual
        : PLAN_PRICING[plan].mensual;
    setAmount(String(suggested));
  };

  const handleSelectCycle = (cycle: SubscriptionItem['billingCycle']) => {
    setBillingCycle(cycle);
    const suggested =
      cycle === 'Anual'
        ? PLAN_PRICING[selectedPlan].anual
        : PLAN_PRICING[selectedPlan].mensual;
    setAmount(String(suggested));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Math.max(0, Number(amount) || 0);
    updateSubscriptionPlan(
      activeSub.id,
      selectedPlan,
      numericAmount,
      billingCycle,
      status,
      nextBillingDate.trim() || activeSub.nextBillingDate,
      paymentMethod.trim() || activeSub.paymentMethod,
      recordInvoice
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C94C]/25 border border-[#F2C94C] flex items-center justify-center text-[#745B00] shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                workspace_premium
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Editar Plan y Suscripción de Empresa
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {activeSub.code} · {activeSub.companyName} (RUC {activeSub.ruc})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto w-full flex flex-col gap-5"
        >
          {/* Selector de Empresa */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Empresa suscrita
            </label>
            <select
              value={activeSub.id}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
            >
              {subscriptions.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.companyName} — RUC {sub.ruc} (Plan actual: {sub.plan})
                </option>
              ))}
            </select>
          </div>

          {/* 1. Selección de Plan con Tarjetas */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Seleccionar Plan Corporativo
              </label>
              {/* Selector de Periodicidad */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                {(['Mensual', 'Anual'] as const).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => handleSelectCycle(cycle)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === cycle
                        ? 'bg-[#1E222D] text-[#F2C94C] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['Starter', 'Profesional', 'Enterprise'] as const).map(
                (planKey) => {
                  const info = PLAN_PRICING[planKey];
                  const isSelected = selectedPlan === planKey;
                  const price =
                    billingCycle === 'Anual' ? info.anual : info.mensual;
                  return (
                    <button
                      key={planKey}
                      type="button"
                      onClick={() => handleSelectPlan(planKey)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#FEFBF0] border-[#F2C94C] ring-2 ring-[#F2C94C]/50 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">
                            {planKey}
                          </span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[18px] text-[#745B00]">
                              check_circle
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 flex items-baseline gap-1 tabular-nums">
                          <span className="text-lg font-extrabold text-slate-900">
                            S/ {price.toLocaleString('es-PE')}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            /{billingCycle === 'Anual' ? 'año' : 'mes'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {info.subtitle}
                        </p>
                      </div>

                      <ul className="mt-3 pt-2.5 border-t border-slate-200/70 space-y-1">
                        {info.features.map((feat, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-slate-600 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px] text-emerald-600">
                              check
                            </span>
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* 2. Parámetros Financieros y Estado */}
          <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Importe facturado (S/ PEN){' '}
                <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Puedes ajustar una tarifa corporativa personalizada.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Estado de la suscripción
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as SubscriptionItem['status'])
                }
                className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
              >
                <option value="Activa">Activa</option>
                <option value="Prueba (6 días rest.)">
                  Prueba (6 días rest.)
                </option>
                <option value="Pendiente de pago">Pendiente de pago</option>
                <option value="Vencida">Vencida</option>
                <option value="Suspendida">Suspendida</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Próxima fecha de cobro
              </label>
              <input
                type="text"
                value={nextBillingDate}
                onChange={(e) => setNextBillingDate(e.target.value)}
                placeholder="Ej. 15 Oct 2026"
                className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Método de pago asociado
              </label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Ej. Visa •••• 4242 o Transferencia BCP"
                className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
              />
            </div>
          </div>

          {/* Checkbox: Generar recibo en historial */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={recordInvoice}
              onChange={(e) => setRecordInvoice(e.target.checked)}
              className="rounded border-slate-300 text-[#745B00] focus:ring-[#F2C94C]"
            />
            <span className="text-xs text-slate-700 font-medium">
              Registrar automáticamente la transacción del cambio de plan en el{' '}
              <strong className="text-slate-900">Historial de Pagos</strong> con
              ID único y fecha/hora actual.
            </span>
          </label>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100 w-full shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto justify-center px-5 py-2 rounded-lg bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                save
              </span>
              <span>Guardar nuevo plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================================
 * MODAL PARA REGISTRAR UN PAGO O INTENTO RECHAZADO EN LA SUSCRIPCIÓN
 * ========================================================================== */
export interface RegistrarPagoSuscripcionModalProps {
  isOpen: boolean;
  subscription: SubscriptionItem | null;
  onClose: () => void;
}

export const RegistrarPagoSuscripcionModal: React.FC<
  RegistrarPagoSuscripcionModalProps
> = ({ isOpen, subscription, onClose }) => {
  const { registerSubscriptionInvoice } = usePlanery();

  const [planName, setPlanName] =
    useState<SubscriptionItem['plan']>('Profesional');
  const [billingPeriod, setBillingPeriod] = useState(
    'Mensual (Oct 2026 - Nov 2026)'
  );
  const [amount, setAmount] = useState('350');
  const [method, setMethod] = useState('Visa •••• 4242');
  const [status, setStatus] = useState<'Pagado' | 'Pendiente' | 'Rechazado'>(
    'Pagado'
  );
  const [rejectionReason, setRejectionReason] = useState(
    'Fondos insuficientes en tarjeta corporativa (Código 51)'
  );

  useEffect(() => {
    if (isOpen && subscription) {
      setPlanName(subscription.plan);
      setBillingPeriod(`${subscription.billingCycle} (Ciclo actual 2026)`);
      setAmount(String(subscription.amount));
      setMethod(subscription.paymentMethod);
      setStatus('Pagado');
    }
  }, [isOpen, subscription]);

  if (!isOpen || !subscription) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nowTime = new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    registerSubscriptionInvoice(subscription.id, {
      date: '28 Sep 2026',
      time: nowTime,
      planName,
      billingPeriod: billingPeriod.trim(),
      method: method.trim(),
      amount: Math.max(0, Number(amount) || subscription.amount),
      status,
      rejectionReason:
        status === 'Rechazado' ? rejectionReason.trim() : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[20px]">
                receipt_long
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Registrar Transacción de Suscripción
              </h3>
              <p className="text-xs text-slate-500">
                {subscription.companyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Plan que se está pagando
              </label>
              <select
                value={planName}
                onChange={(e) =>
                  setPlanName(e.target.value as SubscriptionItem['plan'])
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
              >
                <option value="Starter">Plan Starter</option>
                <option value="Profesional">Plan Profesional</option>
                <option value="Enterprise">Plan Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Importe (S/)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Periodo de facturación
              </label>
              <input
                type="text"
                required
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Método de pago
              </label>
              <input
                type="text"
                required
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Resultado / Estado
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as 'Pagado' | 'Pendiente' | 'Rechazado'
                  )
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
              >
                <option value="Pagado">Pagado (Aprobado)</option>
                <option value="Pendiente">Pendiente de abono</option>
                <option value="Rechazado">Rechazado (Fallido)</option>
              </select>
            </div>

            {status === 'Rechazado' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-rose-700 mb-1">
                  Motivo de rechazo bancario / pasarela
                </label>
                <input
                  type="text"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ej. Fondos insuficientes (Código 51)"
                  className="w-full h-10 px-3 rounded-lg border border-rose-300 bg-rose-50/40 text-sm text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] text-xs font-bold shadow-xs cursor-pointer"
            >
              Guardar transacción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
