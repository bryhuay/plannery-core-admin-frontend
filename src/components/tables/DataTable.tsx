'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
}

export interface DataTableAction<T> {
  id: string;
  label: string;
  icon?: string;
  variant?: 'default' | 'danger';
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  actions?: DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  actions = [],
  onRowClick,
  emptyTitle = 'No se encontraron registros',
  emptyDescription = 'Intenta ajustar los filtros de búsqueda o registra un nuevo elemento.',
  emptyIcon = 'inbox',
  footer,
  className = '',
}: DataTableProps<T>) {
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setOpenMenuRowId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClasses: Record<'left' | 'center' | 'right', string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden ${className}`}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/90 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 sm:px-6 py-3.5 whitespace-nowrap ${
                    alignClasses[col.align || 'left']
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap w-16">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-sm">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="max-w-xs mx-auto flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">
                        {emptyIcon}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{emptyTitle}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {emptyDescription}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const key = rowKey(row, rowIndex);
                const visibleActions = actions.filter(
                  (action) => !action.hidden || !action.hidden(row)
                );
                const isMenuOpen = openMenuRowId === key;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-gray-50/80 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 sm:px-6 py-4 align-middle whitespace-nowrap ${
                          alignClasses[col.align || 'left']
                        } ${col.className || ''}`}
                      >
                        {col.render(row, rowIndex)}
                      </td>
                    ))}

                    {actions.length > 0 && (
                      <td
                        className="px-4 sm:px-6 py-4 align-middle text-right whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {visibleActions.length > 0 && (
                          <div
                            ref={isMenuOpen ? menuContainerRef : undefined}
                            className="inline-block text-left relative"
                          >
                            <button
                              type="button"
                              aria-label="Abrir menú de acciones"
                              onClick={() =>
                                setOpenMenuRowId(isMenuOpen ? null : key)
                              }
                              className="p-1.5 rounded-lg text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[20px] leading-none">
                                more_horiz
                              </span>
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white shadow-xl border border-gray-200 py-1.5 z-30 animate-in fade-in duration-100">
                                {visibleActions.map((action) => (
                                  <button
                                    key={action.id}
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuRowId(null);
                                      action.onClick(row);
                                    }}
                                    className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 text-left transition-colors cursor-pointer ${
                                      action.variant === 'danger'
                                        ? 'text-rose-600 hover:bg-rose-50'
                                        : 'text-slate-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {action.icon && (
                                      <span className="material-symbols-outlined text-[16px]">
                                        {action.icon}
                                      </span>
                                    )}
                                    <span>{action.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {footer && (
        <div className="px-4 sm:px-6 py-3.5 bg-gray-50/70 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}
