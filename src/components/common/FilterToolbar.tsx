'use client';

import React from 'react';
import { Input } from '../ui/Input';
import { Select, SelectOption } from '../ui/Select';
import { Button } from '../ui/Button';

export interface FilterDropdownConfig {
  id: string;
  label?: string;
  value: string;
  options: SelectOption[];
  icon?: string;
  onChange: (value: string) => void;
}

export interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDropdownConfig[];
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  onExport?: () => void;
  exportLabel?: string;
  extraActions?: React.ReactNode;
  totalCount?: number;
  filteredCount?: number;
  entityPluralLabel?: string;
  className?: string;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Buscar por nombre, código o responsable...',
  filters = [],
  onResetFilters,
  hasActiveFilters,
  onExport,
  exportLabel = 'Exportar CSV',
  extraActions,
  totalCount,
  filteredCount,
  entityPluralLabel = 'registros',
  className = '',
}) => {
  const showReset =
    typeof hasActiveFilters === 'boolean'
      ? hasActiveFilters
      : Boolean(searchQuery.trim()) ||
        filters.some(
          (f) =>
            f.value !== '' &&
            f.value.toLowerCase() !== 'todos' &&
            f.value.toLowerCase() !== 'todas'
        );

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs flex flex-col gap-3.5 ${className}`}
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Buscador Principal */}
        <div className="flex-1 min-w-0">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            leftIcon="search"
            rightIcon={searchQuery ? 'close' : undefined}
            onRightIconClick={searchQuery ? () => onSearchChange('') : undefined}
          />
        </div>

        {/* Controles Desplegables de Filtro y Botones */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
          {filters.map((filter) => (
            <div key={filter.id} className="w-full sm:w-44">
              <Select
                aria-label={filter.label || filter.id}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                options={filter.options}
                leftIcon={filter.icon}
              />
            </div>
          ))}

          {showReset && onResetFilters && (
            <Button
              variant="ghost"
              size="md"
              icon="filter_alt_off"
              onClick={onResetFilters}
              className="text-gray-600 hover:text-rose-600"
            >
              Restablecer filtros
            </Button>
          )}

          {onExport && (
            <Button
              variant="outline"
              size="md"
              icon="download"
              onClick={onExport}
            >
              {exportLabel}
            </Button>
          )}

          {extraActions}
        </div>
      </div>

      {/* Contador opcional de resultados */}
      {typeof totalCount === 'number' && typeof filteredCount === 'number' && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>
            Mostrando <strong className="text-slate-900">{filteredCount}</strong> de{' '}
            <strong className="text-slate-900">{totalCount}</strong> {entityPluralLabel}
          </span>
          {showReset && (
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Filtros activos
            </span>
          )}
        </div>
      )}
    </div>
  );
};
