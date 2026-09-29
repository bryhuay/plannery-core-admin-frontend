'use client';

import React, { useState } from 'react';
import { BudgetCategory, DocumentItem } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';
import { StatusBadge } from '../ui/StatusBadge';

export interface TabPresupuestoProps {
  onSelectCategory: (cat: BudgetCategory) => void;
  onOpenAddCategory: () => void;
}

export const TabPresupuestoEvento: React.FC<TabPresupuestoProps> = ({
  onSelectCategory,
  onOpenAddCategory,
}) => {
  const { budgetCategories, showToast } = usePlanery();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');

  const filtered = budgetCategories.filter((cat) => {
    const matchQuery =
      !searchQuery.trim() ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === 'Todos los estados' || cat.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const totalAllocated = budgetCategories.reduce(
    (s, c) => s + c.allocated,
    0
  );
  const totalCommitted = budgetCategories.reduce(
    (s, c) => s + c.committed,
    0
  );
  const totalPaid = budgetCategories.reduce((s, c) => s + c.paid, 0);
  const totalPending = budgetCategories.reduce((s, c) => s + c.pending, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Presupuesto</h2>
          <p className="text-sm text-slate-500">
            Controla el presupuesto, los gastos y los pagos de este evento.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              showToast('Opciones de exportación y balance presupuestario.')
            }
            className="h-10 px-3.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-slate-900 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">
              tune
            </span>
            <span>Acciones</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              keyboard_arrow_down
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenAddCategory}
            className="h-10 inline-flex items-center gap-2 bg-[#F2C94C] hover:bg-[#ebc246] active:scale-[0.98] text-slate-950 font-bold text-sm px-4 py-2 rounded-lg shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Agregar categoría</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards + Progress Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Presupuesto total
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">
                  account_balance_wallet
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              S/{' '}
              {totalAllocated.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Planificado total</span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Comprometido
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">
                  handshake
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              S/{' '}
              {totalCommitted.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-sky-700 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>71.8% contratado</span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pagado
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">
                  check_circle
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-800">
              S/{' '}
              {totalPaid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>42.4% liquidado</span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pendiente
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">
                  schedule
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              S/{' '}
              {totalPending.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Saldo por pagar</span>
            </div>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs space-y-2.5">
          <div className="flex flex-wrap items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                Ejecución del presupuesto:
              </span>
              <span className="text-slate-600 tabular-nums">
                S/ {totalCommitted.toLocaleString('es-PE')} de S/{' '}
                {totalAllocated.toLocaleString('es-PE')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span>
                  Pagado: <strong>42.4%</strong>
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#f2c94c]" />
                <span>
                  Pendiente de pago: <strong>29.4%</strong>
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-200" />
                <span>
                  Disponible: <strong>28.2%</strong>
                </span>
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: '42.4%' }}
              title="Pagado: 42.4%"
            />
            <div
              className="bg-[#f2c94c] h-full"
              style={{ width: '29.4%' }}
              title="Pendiente: 29.4%"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined text-[19px]">
                search
              </span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar categoría..."
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#F2C94C]"
          >
            <option>Todos los estados</option>
            <option>Dentro del presupuesto</option>
            <option>Cerca del límite</option>
            <option>Sobre presupuesto</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              showToast('Exportando matriz presupuestaria en Excel...')
            }
            className="w-full sm:w-auto h-9 sm:h-8 px-3 rounded-lg border border-[#E5E7EB] bg-white hover:border-slate-900 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">
              download
            </span>
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabla de Categorías Presupuestarias */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Categoría</th>
                <th className="py-3.5 px-4">Presupuesto</th>
                <th className="hidden md:table-cell py-3.5 px-4">Comprometido</th>
                <th className="py-3.5 px-4">Pagado</th>
                <th className="hidden md:table-cell py-3.5 px-4">Pendiente</th>
                <th className="hidden md:table-cell py-3.5 px-4">Variación</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs tabular-nums">
              {filtered.map((cat) => {
                const variation = cat.allocated - cat.committed;
                return (
                  <tr
                    key={cat.id}
                    onClick={() => onSelectCategory(cat)}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold shrink-0 ${cat.iconBg}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {cat.icon}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm group-hover:text-[#745b00] transition-colors">
                            {cat.name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {cat.linkedProvidersCount > 0
                              ? `${cat.linkedProvidersCount} proveedor vinculado`
                              : 'Sin proveedores asignados'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      S/{' '}
                      {cat.allocated.toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="hidden md:table-cell py-4 px-4 font-semibold text-slate-900">
                      S/{' '}
                      {cat.committed.toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 px-4 font-medium text-emerald-700">
                      S/{' '}
                      {cat.paid.toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="hidden md:table-cell py-4 px-4 font-medium text-amber-800">
                      S/{' '}
                      {cat.pending.toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`hidden md:table-cell py-4 px-4 font-bold ${
                        variation < 0
                          ? 'text-rose-600'
                          : variation === 0
                          ? 'text-slate-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {variation < 0
                        ? `-S/ ${Math.abs(variation).toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                          })}`
                        : variation === 0
                        ? 'S/ 0.00'
                        : `+S/ ${variation.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                          })}`}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={cat.status} size="xs" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(cat);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="bg-[#f0f3ff] px-6 py-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-xs text-slate-700 gap-4 tabular-nums">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Total Presupuestado
              </span>
              <span className="font-bold text-slate-950 text-sm">
                S/{' '}
                {totalAllocated.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Total Comprometido
              </span>
              <span className="font-bold text-sky-800 text-sm">
                S/{' '}
                {totalCommitted.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Total Pagado
              </span>
              <span className="font-bold text-emerald-800 text-sm">
                S/{' '}
                {totalPaid.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Total Pendiente
              </span>
              <span className="font-bold text-amber-900 text-sm">
                S/{' '}
                {totalPending.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              Saldo disponible neto:
            </span>
            <span className="font-bold text-emerald-800 text-sm bg-white px-3 py-1 rounded-lg border border-[#E5E7EB] shadow-xs">
              +S/{' '}
              {Math.max(0, totalAllocated - totalCommitted).toLocaleString(
                'es-PE',
                { minimumFractionDigits: 2 }
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Preventive Cost Banner */}
      <div className="bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20 border border-amber-200/50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f2c94c]/20 text-[#6b5400] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">
              monetization_on
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Control preventivo de costos
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              La categoría{' '}
              <strong className="text-slate-900">Catering</strong> presenta un
              sobrecosto de <strong className="text-rose-600">S/ 500.00</strong>{' '}
              respecto al presupuesto estimado. Puedes reasignar fondos desde la
              categoría Transporte o ajustar el menú con el proveedor.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (budgetCategories[0]) onSelectCategory(budgetCategories[0]);
          }}
          className="text-xs font-semibold text-slate-900 hover:text-amber-800 underline underline-offset-4 shrink-0 cursor-pointer"
        >
          Revisar categoría Catering →
        </button>
      </div>
    </div>
  );
};

export interface TabPagosProps {
  onOpenRegistrarPago: () => void;
}

export const TabPagosEvento: React.FC<TabPagosProps> = ({
  onOpenRegistrarPago,
}) => {
  const { payments, showToast } = usePlanery();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');

  const filtered = payments.filter((p) => {
    const matchQuery =
      !searchQuery.trim() ||
      p.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.concept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === 'Todos los estados' || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const totalPaid = payments
    .filter((p) => p.status === 'Pagado')
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Pagos</h2>
          <p className="text-sm text-slate-500">
            Registra y controla los pagos realizados para este evento.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegistrarPago}
          className="h-10 inline-flex items-center justify-center gap-2 bg-[#F2C94C] hover:bg-[#ebc246] active:scale-[0.98] text-slate-950 font-bold text-sm px-4 py-2 rounded-lg shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Registrar pago</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total comprometido
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                handshake
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">S/ 30,500.00</div>
          <div className="text-xs text-sky-700 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>71.8% contratado en servicios</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total pagado
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                check_circle
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-800">
            S/{' '}
            {totalPaid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Liquidado efectivamente</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pendiente
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                schedule
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">S/ 12,500.00</div>
          <div className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Saldo por abonar a proveedores</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Próximo pago
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                event_upcoming
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">S/ 4,500.00</div>
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>15 Nov 2026 · Catering Gourmet</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined text-[19px]">
                search
              </span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar proveedor o concepto..."
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#F2C94C]"
          >
            <option>Todos los estados</option>
            <option>Pagado</option>
            <option>Programado</option>
            <option>Pendiente</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() =>
            showToast('Exportando historial de pagos y comprobantes...')
          }
          className="w-full sm:w-auto h-9 sm:h-8 px-3 rounded-lg border border-[#E5E7EB] bg-white hover:border-slate-900 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px] text-slate-500">
            download
          </span>
          <span>Exportar</span>
        </button>
      </div>

      {/* Tabla de Pagos */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Proveedor</th>
                <th className="hidden md:table-cell py-3.5 px-4">Concepto</th>
                <th className="hidden md:table-cell py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Monto</th>
                <th className="hidden md:table-cell py-3.5 px-4">Fecha de pago</th>
                <th className="hidden md:table-cell py-3.5 px-4">Método</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs tabular-nums">
              {filtered.map((pay) => (
                <tr
                  key={pay.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold shrink-0 ${pay.iconBg}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {pay.icon}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {pay.providerName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          RUC: {pay.providerRuc}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-4 px-4 font-medium text-slate-800">
                    {pay.concept}
                  </td>
                  <td className="hidden md:table-cell py-4 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {pay.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    S/{' '}
                    {pay.amount.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="hidden md:table-cell py-4 px-4 text-slate-700 font-medium">
                    {pay.date}
                  </td>
                  <td className="hidden md:table-cell py-4 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">
                        {pay.methodIcon}
                      </span>
                      <span>{pay.method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={pay.status} size="xs" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        showToast(
                          `Comprobante ${pay.receiptCode || 'REC-2026'} verificado.`
                        )
                      }
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-[#f0f3ff] px-6 py-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-xs text-slate-700 gap-4 tabular-nums">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Total Pagos Mostrados
              </span>
              <span className="font-bold text-slate-950 text-sm">
                {filtered.length} transacciones
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Total Abonado
              </span>
              <span className="font-bold text-emerald-800 text-sm">
                S/{' '}
                {totalPaid.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              Porcentaje de ejecución:
            </span>
            <span className="font-bold text-slate-900 text-sm bg-white px-3 py-1 rounded-lg border border-[#E5E7EB] shadow-xs">
              59.0% del contratado
            </span>
          </div>
        </div>
      </div>

      {/* Reminder Banner */}
      <div className="bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20 border border-amber-200/50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f2c94c]/20 text-[#6b5400] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">
              notification_important
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recordatorio de próximo vencimiento
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              El pago de{' '}
              <strong className="text-slate-900">S/ 4,500.00</strong> a{' '}
              <strong className="text-slate-900">
                Catering Gourmet Del Sur
              </strong>{' '}
              está programado para el{' '}
              <strong className="text-amber-900">15 Nov 2026</strong>.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenRegistrarPago}
          className="text-xs font-semibold text-slate-900 hover:text-amber-800 underline underline-offset-4 shrink-0 cursor-pointer"
        >
          Registrar anticipo ahora →
        </button>
      </div>
    </div>
  );
};

export interface TabDocumentosProps {
  onOpenSubirDocumento: () => void;
  onRequestDeleteDoc: (doc: DocumentItem) => void;
}

export const TabDocumentosEvento: React.FC<TabDocumentosProps> = ({
  onOpenSubirDocumento,
  onRequestDeleteDoc,
}) => {
  const { documents, showToast } = usePlanery();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos los tipos');

  const filtered = documents.filter((doc) => {
    const matchQuery =
      !searchQuery.trim() ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.relatedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType =
      typeFilter === 'Todos los tipos' ||
      doc.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchQuery && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Documentos</h2>
          <p className="text-sm text-slate-500">
            Centraliza los contratos, comprobantes y archivos relacionados con
            este evento.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSubirDocumento}
          className="h-10 inline-flex items-center justify-center gap-2 bg-[#F2C94C] hover:bg-[#ebc246] active:scale-[0.98] text-slate-950 font-bold text-sm px-4 py-2 rounded-lg shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            upload_file
          </span>
          <span>Subir documento</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Documentos
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                folder
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {documents.length} archivos
          </div>
          <div className="text-xs text-sky-700 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>9.74 MB almacenados</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Contratos y Acuerdos
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                draw
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-800">2 firmados</div>
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% de vigencia legal</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Comprobantes
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                receipt_long
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">1 registrado</div>
          <div className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>S/ 10,000.00 respaldados</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Planos y Cotizaciones
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                architecture
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">2 archivos</div>
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Actualizados recientemente</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined text-[19px]">
                search
              </span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar documento..."
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:bg-white"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#F2C94C]"
          >
            <option>Todos los tipos</option>
            <option>Contrato</option>
            <option>Comprobante</option>
            <option>Cotización</option>
            <option>Técnico / Plano</option>
          </select>
        </div>
      </div>

      {/* Tabla de Documentos */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Documento</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="hidden md:table-cell py-3.5 px-4">Relacionado con</th>
                <th className="hidden md:table-cell py-3.5 px-4">Tamaño</th>
                <th className="hidden md:table-cell py-3.5 px-4">Fecha de subida</th>
                <th className="hidden md:table-cell py-3.5 px-4">Subido por</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {filtered.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold shrink-0 ${doc.iconBg}`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          {doc.icon}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{doc.fileName}</span>
                          {doc.verified && (
                            <span
                              className="material-symbols-outlined text-emerald-500 text-[16px]"
                              title="Verificado y firmado"
                            >
                              verified
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {doc.fileFormat} · {doc.fileSize}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge
                      status={doc.type}
                      showDot={false}
                      size="xs"
                    />
                  </td>
                  <td className="hidden md:table-cell py-4 px-4 font-medium text-slate-800">
                    <div>{doc.relatedTo}</div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {doc.relatedSubtext}
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-4 px-4 text-slate-700 font-mono font-medium">
                    {doc.fileSize}
                  </td>
                  <td className="hidden md:table-cell py-4 px-4 text-slate-700 font-medium">
                    {doc.uploadDate}
                  </td>
                  <td className="hidden md:table-cell py-4 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">
                        person
                      </span>
                      <span>{doc.uploadedBy}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`Descargando ${doc.fileName}...`)
                        }
                        title="Descargar archivo"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          download
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestDeleteDoc(doc)}
                        title="Eliminar documento"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Storage Footer */}
        <div className="bg-[#f0f3ff] px-6 py-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-xs text-slate-700 gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Total Documentos
              </span>
              <span className="font-bold text-slate-950 text-sm">
                {documents.length} archivos
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Espacio Utilizado
              </span>
              <span className="font-bold text-emerald-800 text-sm">
                9.74 MB
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                Límite Incluido
              </span>
              <span className="font-bold text-slate-900 text-sm">
                250 MB (Plan Business)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              Uso de almacenamiento:
            </span>
            <span className="font-bold text-slate-900 text-sm bg-white px-3 py-1 rounded-lg border border-[#E5E7EB] shadow-xs">
              3.9% consumido
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
