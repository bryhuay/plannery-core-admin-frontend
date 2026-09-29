'use client';

import React, { useState, useEffect } from 'react';
import { GlobalCatalogItem } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface CatalogCategoryModalProps {
  isOpen: boolean;
  module: 'presupuesto' | 'proveedores' | 'tipos_evento';
  suggestedOrder: number;
  itemToEdit?: GlobalCatalogItem | null;
  onClose: () => void;
}

export const CatalogCategoryModal: React.FC<CatalogCategoryModalProps> = ({
  isOpen,
  module,
  suggestedOrder,
  itemToEdit,
  onClose,
}) => {
  const { addGlobalCatalogItem, updateGlobalCatalogItem } = usePlanery();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(suggestedOrder);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setDescription(itemToEdit.description);
      setDisplayOrder(itemToEdit.displayOrder);
      setIsActive(itemToEdit.status === 'Activa');
    } else {
      setName('');
      setDescription('');
      setDisplayOrder(suggestedOrder);
      setIsActive(true);
    }
  }, [itemToEdit, suggestedOrder, isOpen]);

  if (!isOpen) return null;

  const moduleLabels: Record<
    'presupuesto' | 'proveedores' | 'tipos_evento',
    { title: string; subtitle: string; placeholder: string }
  > = {
    presupuesto: {
      title: itemToEdit
        ? 'Editar categoría de presupuesto'
        : 'Nueva categoría de presupuesto',
      subtitle:
        'Crea una categoría para el catálogo compartido entre todas las empresas.',
      placeholder: 'ej. Sonido e iluminación',
    },
    proveedores: {
      title: itemToEdit
        ? 'Editar categoría de proveedor'
        : 'Nueva categoría de proveedor',
      subtitle:
        'Define un rubro oficial para el directorio global de proveedores.',
      placeholder: 'ej. Coctelería Molecular',
    },
    tipos_evento: {
      title: itemToEdit ? 'Editar tipo de evento' : 'Nuevo tipo de evento',
      subtitle:
        'Habilita una nueva clasificación de eventos para todas las organizaciones.',
      placeholder: 'ej. Lanzamiento de Marca',
    },
  };

  const currentLabel = moduleLabels[module];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (itemToEdit) {
      updateGlobalCatalogItem(itemToEdit.id, {
        name: name.trim(),
        description: description.trim() || 'Categoría global configurada',
        displayOrder: Number(displayOrder) || 1,
        status: isActive ? 'Activa' : 'Inactiva',
      });
    } else {
      addGlobalCatalogItem({
        module,
        name: name.trim(),
        description: description.trim() || 'Categoría global configurada',
        displayOrder: Number(displayOrder) || suggestedOrder,
        status: isActive ? 'Activa' : 'Inactiva',
      });
    }
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
        className="relative w-full max-w-lg sm:max-w-xl mx-4 sm:mx-auto bg-white rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-[#151C27]">
              {currentLabel.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {currentLabel.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1 transition-colors shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form
          onSubmit={handleSubmit}
          className="p-6 w-full flex flex-col gap-4"
        >
          {/* Nombre de la Categoría */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nombre de la categoría <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={currentLabel.placeholder}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
            />
          </div>

          {/* Descripción */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Descripción{' '}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ej. Equipos técnicos y luminotecnia profesional"
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
            />
          </div>

          {/* Orden de Visualización */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Orden de visualización <span className="text-rose-600">*</span>
            </label>
            <div className="relative w-full sm:w-44">
              <input
                type="number"
                min={1}
                required
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-3.5 pr-8 py-2 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all tabular-nums"
              />
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">
                unfold_more
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Sugerido automáticamente: siguiente disponible ({suggestedOrder}).
            </p>
          </div>

          {/* Estado Inicial */}
          <div className="w-full pt-2 border-t border-[#F3F4F6]">
            <span className="block text-xs font-semibold text-gray-700 mb-2">
              Estado inicial
            </span>
            <label className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded accent-[#745B00] border-gray-300 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[13px] font-semibold text-gray-800 block">
                  Activa (Recomendado)
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Estará disponible de inmediato en la creación de presupuestos.
                </span>
              </div>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 w-full border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-[#E5E7EB] hover:border-gray-400 text-gray-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-[#F2C94C] hover:bg-[#ebc246] text-[#111827] font-bold rounded-lg text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Guardar categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
