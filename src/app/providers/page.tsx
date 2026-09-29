'use client';

import React, { useState } from 'react';
import { Provider } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';
import { ProviderDetailDrawer } from '../../components/modals/ProviderDetailDrawer';
import { ProviderFormDrawer } from '../../components/forms/ProviderFormDrawer';

export default function ProvidersPage() {
  const { providers, bulkUpdateProvidersStatus, showToast } = usePlanery();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas las categorías');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'PRV-2024-0012',
    'PRV-2024-0013',
  ]);
  const [inspectedProvider, setInspectedProvider] = useState<Provider | null>(
    null
  );
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const filteredProviders = providers.filter((p) => {
    const matchSearch =
      !searchQuery.trim() ||
      p.commercialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ruc.includes(searchQuery) ||
      p.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      categoryFilter === 'Todas las categorías' ||
      p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchStatus =
      statusFilter === 'Todos los estados' || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProviders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProviders.map((p) => p.id));
    }
  };

  return (
    <main className="p-6 lg:p-8 space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-[40px] font-bold text-slate-900 tracking-tight">
            Proveedores
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los proveedores disponibles para los eventos de tu
            empresa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() =>
              showToast('Exportando directorio homologado de proveedores...')
            }
            className="w-full sm:w-auto justify-center bg-white border border-slate-300 hover:border-slate-900 text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              file_download
            </span>
            <span>Exportar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProvider(null);
              setIsFormDrawerOpen(true);
            }}
            className="w-full sm:w-auto justify-center bg-[#F2C94C] hover:bg-[#ebc246] text-[#241a00] text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>+ Nuevo proveedor</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Total proveedores
            </span>
            <div className="text-2xl font-bold text-slate-900">
              {providers.length + 120}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e2e8f8] text-[#745b00] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">
              storefront
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Activos
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">114</span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> 89%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <span className="material-symbols-outlined text-2xl">
              check_circle
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Inactivos
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">14</span>
              <span className="inline-flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                Revisión
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e2e8f8] text-slate-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">
              pause_circle
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Categorías
            </span>
            <div className="text-2xl font-bold text-slate-900">8</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e7eefe] text-[#745b00] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">category</span>
          </div>
        </div>
      </div>

      {/* Barra de Selección Múltiple Contextual */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1E222D] text-white px-4 py-2.5 rounded-xl shadow-md border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#F2C94C]" />
            <span className="text-sm font-semibold">
              {selectedIds.length} proveedores seleccionados
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                bulkUpdateProvidersStatus(selectedIds, 'Activo');
                setSelectedIds([]);
              }}
              className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs transition-colors cursor-pointer"
            >
              Activar
            </button>
            <button
              type="button"
              onClick={() => {
                bulkUpdateProvidersStatus(selectedIds, 'Inactivo');
                setSelectedIds([]);
              }}
              className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs transition-colors cursor-pointer"
            >
              Desactivar
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-300 hover:text-white rounded-lg text-xs ml-2 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Card Principal: Toolbar + Tabla de Proveedores */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar proveedor por nombre, razón social, RUC..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#f0f3ff] border border-slate-200 rounded-xl focus:outline-none focus:border-[#F2C94C] text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm bg-[#f0f3ff] border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Todas las categorías</option>
              <option value="Catering">Catering</option>
              <option value="Fotografía">Fotografía</option>
              <option value="Decoración">Decoración</option>
              <option value="Música">Música y Sonido</option>
              <option value="Venue">Venue / Locación</option>
              <option value="Transporte">Transporte</option>
            </select>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-initial text-sm bg-[#f0f3ff] border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#F2C94C]"
              >
                <option>Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('Todas las categorías');
                  setStatusFilter('Todos los estados');
                }}
                title="Limpiar filtros"
                className="p-2 border border-slate-200 rounded-xl bg-[#f0f3ff] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabla Avanzada */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#f0f3ff]/70 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredProviders.length > 0 &&
                      selectedIds.length === filteredProviders.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-[#745b00] focus:ring-[#F2C94C] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="hidden md:table-cell py-3 px-4">Contacto</th>
                <th className="hidden lg:table-cell py-3 px-4">Eventos</th>
                <th className="py-3 px-4">Estado</th>
                <th className="hidden md:table-cell py-3 px-4">Fecha Registro</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900">
              {filteredProviders.map((prov) => {
                const isSelected = selectedIds.includes(prov.id);
                return (
                  <tr
                    key={prov.id}
                    onClick={() => setInspectedProvider(prov)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#e2e8f8]/40 hover:bg-[#e7eefe]'
                        : 'hover:bg-[#f0f3ff]'
                    }`}
                  >
                    <td
                      className="py-3.5 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectId(prov.id)}
                        className="rounded border-slate-300 text-[#745b00] focus:ring-[#F2C94C] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${prov.avatarColor}`}
                        >
                          {prov.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{prov.commercialName}</span>
                            {prov.viewed && (
                              <span className="text-[10px] bg-[#F2C94C] text-[#241a00] px-1.5 py-0.5 rounded font-bold">
                                Visto
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">
                            {prov.legalName} · RUC {prov.ruc}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-800 border border-orange-200">
                        {prov.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4">
                      <div className="font-medium text-slate-900">
                        {prov.contactName}
                      </div>
                      <div className="text-xs text-slate-500">{prov.email}</div>
                    </td>
                    <td className="hidden lg:table-cell py-3.5 px-4 tabular-nums">
                      <span className="font-semibold text-slate-900">
                        {prov.eventsCount}
                      </span>{' '}
                      <span className="text-slate-500 text-xs">eventos</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          prov.status === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            prov.status === 'Activo'
                              ? 'bg-emerald-600'
                              : 'bg-gray-400'
                          }`}
                        />
                        {prov.status}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4 text-xs text-slate-500">
                      {prov.registeredDate}
                    </td>
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProvider(prov);
                        setIsFormDrawerOpen(true);
                      }}
                    >
                      <button
                        type="button"
                        title="Editar proveedor"
                        className="p-1 rounded hover:bg-[#e2e8f8] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">
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

        {/* Paginación */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white">
          <div>
            Mostrando <span className="font-bold text-slate-900">1</span> a{' '}
            <span className="font-bold text-slate-900">
              {filteredProviders.length}
            </span>{' '}
            de <span className="font-bold text-slate-900">128</span> resultados
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-[#F2C94C] text-[#241a00] font-bold text-xs flex items-center justify-center"
            >
              1
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-900 text-xs flex items-center justify-center"
            >
              2
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-900 text-xs flex items-center justify-center"
            >
              3
            </button>
          </div>
        </div>
      </div>

      {/* DRAWERS */}
      <ProviderDetailDrawer
        provider={inspectedProvider}
        onClose={() => setInspectedProvider(null)}
        onEdit={(prov) => {
          setInspectedProvider(null);
          setEditingProvider(prov);
          setIsFormDrawerOpen(true);
        }}
      />

      <ProviderFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        editingProvider={editingProvider}
      />
    </main>
  );
}
