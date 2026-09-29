'use client';

import React, { useState, useEffect } from 'react';
import { BudgetCategory } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';
import { StatusBadge } from '../ui/StatusBadge';

export interface DetalleCategoriaDrawerProps {
  category: BudgetCategory | null;
  onClose: () => void;
}

export const DetalleCategoriaPresupuestoDrawer: React.FC<
  DetalleCategoriaDrawerProps
> = ({ category, onClose }) => {
  const { updateBudgetCategory } = usePlanery();
  const [isEditing, setIsEditing] = useState(false);
  const [allocatedInput, setAllocatedInput] = useState('');

  useEffect(() => {
    if (category) {
      setAllocatedInput(category.allocated.toString());
      setIsEditing(false);
    }
  }, [category]);

  if (!category) return null;

  const variation = category.allocated - category.committed;
  const variationFormatted =
    variation >= 0
      ? `+S/ ${variation.toLocaleString('es-PE', {
          minimumFractionDigits: 2,
        })}`
      : `-S/ ${Math.abs(variation).toLocaleString('es-PE', {
          minimumFractionDigits: 2,
        })}`;

  const handleSaveEdit = () => {
    const val = parseFloat(allocatedInput.replace(/,/g, ''));
    if (!isNaN(val) && val >= 0) {
      updateBudgetCategory(category.id, val);
    }
    setIsEditing(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed inset-y-0 right-0 w-full max-w-[460px] bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
      >
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-start justify-between bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Detalle de categoría
              </h3>
              <StatusBadge status={category.status} size="xs" />
            </div>
            <p className="text-xs text-slate-500">
              {category.name} — Boda de María y Carlos
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="p-1.5 -mr-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          {/* 4 Metric Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50/70 border border-[#E5E7EB] rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Presupuesto asignado
              </span>
              {isEditing ? (
                <div className="flex items-center gap-1 pt-1">
                  <span className="text-xs font-bold text-slate-500">S/</span>
                  <input
                    type="number"
                    value={allocatedInput}
                    onChange={(e) => setAllocatedInput(e.target.value)}
                    className="w-full px-2 py-1 text-sm font-bold border border-[#F2C94C] rounded bg-white"
                  />
                </div>
              ) : (
                <div className="text-base font-bold text-slate-900 tabular-nums">
                  S/{' '}
                  {category.allocated.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-[#E5E7EB] rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Comprometido
              </span>
              <div className="text-base font-bold text-slate-900 tabular-nums">
                S/{' '}
                {category.committed.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/40 border border-emerald-200/60 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Pagado
              </span>
              <div className="text-base font-bold text-emerald-800 tabular-nums">
                S/{' '}
                {category.paid.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/40 border border-amber-200/60 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
                Pendiente de pago
              </span>
              <div className="text-base font-bold text-slate-900 tabular-nums">
                S/{' '}
                {category.pending.toLocaleString('es-PE', {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* Variación financiera */}
          <div className="p-3.5 border border-[#E5E7EB] rounded-xl bg-white space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                Variación financiera
              </span>
              <span
                className={`font-bold tabular-nums ${
                  variation < 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {variationFormatted}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {variation < 0
                ? `Esta categoría presenta un desfase negativo de S/ ${Math.abs(
                    variation
                  ).toFixed(2)} respecto al plan inicial.`
                : 'La ejecución actual se mantiene saludable dentro del techo presupuestario asignado.'}
            </p>
          </div>

          {/* Proveedores asociados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Proveedores asociados
              </span>
              <span className="text-[11px] text-slate-400">
                {category.linkedProvidersCount} vinculado
              </span>
            </div>

            <div className="border border-[#E5E7EB] rounded-xl p-3.5 space-y-3 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold shrink-0 ${category.iconBg}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {category.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {category.primaryProviderName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {category.primaryProviderService}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  status={category.primaryProviderStatus}
                  size="xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] tabular-nums">
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    Contratado
                  </span>
                  <span className="font-bold text-slate-800">
                    S/ {category.committed.toLocaleString('es-PE')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    Pagado
                  </span>
                  <span className="font-bold text-emerald-700">
                    S/ {category.paid.toLocaleString('es-PE')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    Pendiente
                  </span>
                  <span className="font-bold text-amber-800">
                    S/ {category.pending.toLocaleString('es-PE')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            Cerrar
          </button>
          {isEditing ? (
            <button
              type="button"
              onClick={handleSaveEdit}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-bold bg-[#F2C94C] hover:bg-[#ebc246] text-slate-950 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                check
              </span>
              <span>Guardar tope</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-bold bg-[#F2C94C] hover:bg-[#ebc246] text-slate-950 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                edit
              </span>
              <span>Editar presupuesto</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export interface AgregarCategoriaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export const AgregarCategoriaPresupuestoDrawer: React.FC<
  AgregarCategoriaDrawerProps
> = ({ isOpen, onClose, eventId }) => {
  const { addBudgetCategory } = usePlanery();

  const [name, setName] = useState('Vestuario & Maquillaje');
  const [allocated, setAllocated] = useState('3500.00');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = parseFloat(allocated.replace(/,/g, '')) || 0;
    if (numeric <= 0) return;

    addBudgetCategory({
      eventId,
      name,
      icon: 'redeem',
      iconBg: 'bg-amber-50 text-amber-800 border-amber-200/60',
      linkedProvidersCount: 0,
      primaryProviderName: 'Sin proveedores asignados',
      primaryProviderService: 'Partida recién creada',
      primaryProviderStatus: 'Propuesto',
      allocated: numeric,
      committed: 0,
      paid: 0,
      pending: 0,
      status: 'Dentro del presupuesto',
      notes,
    });

    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed inset-y-0 right-0 w-full max-w-[460px] bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
      >
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-start justify-between bg-white shrink-0">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              Agregar categoría
            </h3>
            <p className="text-xs text-slate-500">
              Asigna una nueva partida presupuestaria para este evento.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="p-1.5 -mr-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5 custom-scroll"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Categoría
            </label>
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Catering">Catering</option>
              <option value="Fotografía & Video">Fotografía & Video</option>
              <option value="Decoración & Flores">Decoración & Flores</option>
              <option value="Música & Sonido">Música & Sonido</option>
              <option value="Venue / Local">Venue / Local</option>
              <option value="Transporte">Transporte</option>
              <option value="Vestuario & Maquillaje">
                Vestuario & Maquillaje
              </option>
              <option value="Papelería & Recuerdos">
                Papelería & Recuerdos
              </option>
              <option value="Otro rubro">Otro rubro</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Presupuesto asignado
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
                S/
              </span>
              <input
                type="text"
                required
                value={allocated}
                onChange={(e) => setAllocated(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 font-semibold tabular-nums focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Monto máximo sugerido que servirá como tope de control para las
              contrataciones.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Notas opcionales
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles sobre partidas presupuestarias o límites acordados con los clientes..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-xs font-bold bg-[#F2C94C] hover:bg-[#ebc246] active:scale-[0.98] text-slate-950 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                check
              </span>
              <span>Agregar categoría</span>
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};
