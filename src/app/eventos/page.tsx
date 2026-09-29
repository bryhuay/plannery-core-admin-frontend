'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '../../lib/navigation';
import { usePlanery } from '../../context/PlaneryContext';

export default function EventosPage() {
  const router = useRouter();
  const { events, duplicateEvent, archiveEvent, showToast } = usePlanery();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [plannerFilter, setPlannerFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState('fecha_asc');
  const [openMenuId, setOpenMenuId] = useState<string | null>('EV-2024-082');
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('Todos');
    setTypeFilter('Todos');
    setPlannerFilter('Todos');
    setSortBy('fecha_asc');
    showToast('Filtros de eventos restablecidos.');
  };

  const filteredEvents = events
    .filter((ev) => {
      const matchQuery =
        !searchQuery.trim() ||
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === 'Todos' ||
        ev.status.toLowerCase() === statusFilter.toLowerCase();
      const matchType =
        typeFilter === 'Todos' ||
        ev.type.toLowerCase() === typeFilter.toLowerCase();
      const matchPlanner =
        plannerFilter === 'Todos' ||
        ev.planner.toLowerCase().includes(plannerFilter.toLowerCase());
      return matchQuery && matchStatus && matchType && matchPlanner;
    })
    .sort((a, b) => {
      if (sortBy === 'nombre_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'nombre_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'fecha_desc') return b.date.localeCompare(a.date);
      return a.date.localeCompare(b.date);
    });

  const getStatusBadgeClasses = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'en progreso') {
      return {
        pill: 'bg-amber-100 text-amber-900 border-amber-200',
        dot: 'bg-amber-500',
      };
    }
    if (s === 'confirmado') {
      return {
        pill: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        dot: 'bg-emerald-600',
      };
    }
    if (s === 'planificación') {
      return {
        pill: 'bg-blue-100 text-blue-900 border-blue-200',
        dot: 'bg-blue-600',
      };
    }
    if (s === 'completado') {
      return {
        pill: 'bg-gray-100 text-gray-800 border-gray-200',
        dot: 'bg-gray-500',
      };
    }
    return {
      pill: 'bg-red-100 text-red-900 border-red-200',
      dot: 'bg-red-600',
    };
  };

  return (
    <main
      className="px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      onClick={() => setOpenMenuId(null)}
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-slate-900">
              Inicio
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span className="font-medium text-slate-900">Eventos</span>
          </div>
          <h1 className="text-2xl sm:text-[32px] sm:leading-[40px] text-slate-900 font-bold tracking-tight">
            Eventos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona y supervisa los eventos de tu empresa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link
            href="/eventos/nuevo"
            className="w-full sm:w-auto justify-center bg-[#F2C94C] hover:bg-[#ebc246] text-[#241a00] text-sm font-bold py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>+ Nuevo evento</span>
          </Link>
        </div>
      </div>

      {/* TOOLBAR DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row flex-wrap lg:grid lg:grid-cols-12 gap-3 sm:gap-4 items-stretch sm:items-center">
          {/* Search input (Span 4) */}
          <div className="w-full sm:flex-1 lg:col-span-4 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar eventos..."
              className="w-full bg-[#f9f9ff] border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
            />
          </div>

          {/* Selector Estado (Span 2) */}
          <div className="w-full sm:w-auto lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#f9f9ff] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] cursor-pointer"
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Planificación">Planificación</option>
              <option value="En progreso">En progreso</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          {/* Selector Tipo (Span 2) */}
          <div className="w-full sm:w-auto lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-[#f9f9ff] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] cursor-pointer"
            >
              <option value="Todos">Tipo: Todos</option>
              <option value="Corporativo">Corporativo</option>
              <option value="Matrimonio">Matrimonio</option>
              <option value="Conferencia">Conferencia</option>
              <option value="Cumpleaños">Cumpleaños</option>
              <option value="Bautizo">Bautizo</option>
            </select>
          </div>

          {/* Selector Planner (Span 2) */}
          <div className="w-full sm:w-auto lg:col-span-2">
            <select
              value={plannerFilter}
              onChange={(e) => setPlannerFilter(e.target.value)}
              className="w-full bg-[#f9f9ff] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] cursor-pointer"
            >
              <option value="Todos">Planner: Todos</option>
              <option value="Jerson">Jerson Huayta</option>
              <option value="Sofía">Sofía R.</option>
              <option value="Martín">Martín L.</option>
              <option value="Carlos">Carlos M.</option>
            </select>
          </div>

          {/* Ordenar + Reset Actions (Span 2) */}
          <div className="w-full sm:w-auto lg:col-span-2 flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#f9f9ff] border border-slate-200 rounded-lg px-2 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] cursor-pointer truncate"
            >
              <option value="fecha_asc">Ordenar por: Fecha más próxima</option>
              <option value="fecha_desc">Fecha más lejana</option>
              <option value="nombre_asc">Nombre A-Z</option>
              <option value="nombre_desc">Nombre Z-A</option>
            </select>
            <button
              type="button"
              onClick={resetFilters}
              title="Limpiar filtros"
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                restart_alt
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE DE EVENTOS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-visible">
        <div className="w-full overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9f9ff] border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="hidden sm:table-cell py-4 px-6 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-[#745b00] focus:ring-[#F2C94C]"
                  />
                </th>
                <th className="py-4 px-4">Evento</th>
                <th className="hidden md:table-cell py-4 px-4">Tipo</th>
                <th className="py-4 px-4">Fecha</th>
                <th className="hidden lg:table-cell py-4 px-4">Cliente</th>
                <th className="hidden md:table-cell py-4 px-4">Planner</th>
                <th className="hidden sm:table-cell py-4 px-4">Presupuesto</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-900">
              {filteredEvents.map((ev) => {
                const statusColors = getStatusBadgeClasses(ev.status);
                const isMenuOpen = openMenuId === ev.id;
                return (
                  <tr
                    key={ev.id}
                    onClick={() => router.push(`/eventos/${ev.id}`)}
                    className="hover:bg-[#f0f3ff]/50 transition-colors group cursor-pointer"
                  >
                    <td
                      className="hidden sm:table-cell py-4 px-6 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-[#745b00] focus:ring-[#F2C94C]"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-[#745b00] transition-colors flex items-center gap-2">
                        <span>{ev.name}</span>
                        {ev.id === 'EV-2026-084' && (
                          <span className="text-[10px] font-mono bg-[#F2C94C]/30 text-[#241a00] px-1.5 py-0.5 rounded font-bold">
                            EV-084
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">
                          location_on
                        </span>
                        <span>{ev.location}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#e7eefe] text-slate-600 font-semibold">
                        {ev.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {ev.dateFormatted}
                    </td>
                    <td className="hidden lg:table-cell py-4 px-4 text-slate-600 font-medium">
                      {ev.client}
                    </td>
                    <td className="hidden md:table-cell py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 ${
                            ev.plannerInitials === 'CM'
                              ? 'bg-[#F2C94C] text-[#241a00]'
                              : ev.plannerInitials === 'SR'
                              ? 'bg-[#dce2f7] text-[#141b2b]'
                              : 'bg-[#d9e3f6] text-[#121c2a]'
                          }`}
                        >
                          {ev.plannerInitials}
                        </div>
                        <span className="text-slate-900">{ev.planner}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-4 font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      S/ {ev.budget.toLocaleString('es-PE')}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors.pill}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}
                        />
                        {ev.status}
                      </span>
                    </td>
                    <td
                      className="py-4 px-4 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-block relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(isMenuOpen ? null : ev.id)
                          }
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isMenuOpen
                              ? 'bg-[#e7eefe] text-slate-900'
                              : 'hover:bg-[#e7eefe] text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                router.push(`/eventos/${ev.id}`);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-1.5 text-sm text-slate-900 hover:bg-slate-100 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                visibility
                              </span>{' '}
                              Ver evento
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                router.push(`/eventos/${ev.id}`);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-1.5 text-sm text-slate-900 hover:bg-slate-100 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                edit
                              </span>{' '}
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                duplicateEvent(ev.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-1.5 text-sm text-slate-900 hover:bg-slate-100 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                content_copy
                              </span>{' '}
                              Duplicar
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              type="button"
                              onClick={() => {
                                archiveEvent(ev.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-1.5 text-sm text-rose-600 hover:bg-rose-50 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                archive
                              </span>{' '}
                              Archivar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="px-6 py-4 border-t border-slate-200 bg-[#f9f9ff] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Mostrando{' '}
            <span className="font-semibold text-slate-900">
              {filteredEvents.length > 0 ? 1 : 0}
            </span>{' '}
            a{' '}
            <span className="font-semibold text-slate-900">
              {filteredEvents.length}
            </span>{' '}
            de <span className="font-semibold text-slate-900">24</span>{' '}
            resultados
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                chevron_left
              </span>
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#F2C94C] text-[#241a00] font-semibold shadow-xs'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(4, p + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ESTADOS ADICIONALES DE REFERENCIA DEL UI KIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Estado Vacío (Empty State) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#e7eefe] flex items-center justify-center text-slate-500 mb-2">
            <span className="material-symbols-outlined text-[24px]">
              event_busy
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No se encontraron eventos
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">
            No hay eventos registrados que coincidan con los filtros aplicados
            actualmente.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-900 text-xs font-medium hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              filter_alt_off
            </span>
            Limpiar filtros
          </button>
        </div>

        {/* Estado Skeleton de Carga (Loading UI Kit Preview) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
              Muestra de Carga (Skeleton UI)
            </span>
            <div className="w-16 h-3 bg-[#e7eefe] rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4 p-2 bg-[#f0f3ff]/40 rounded-lg animate-pulse">
              <div className="w-5 h-5 bg-[#e2e8f8] rounded" />
              <div className="flex-1 space-y-1">
                <div className="w-1/3 h-3.5 bg-[#e2e8f8] rounded" />
                <div className="w-1/4 h-2.5 bg-[#e7eefe] rounded" />
              </div>
              <div className="w-16 h-5 bg-[#e2e8f8] rounded-full" />
              <div className="w-12 h-3.5 bg-[#e2e8f8] rounded" />
            </div>
            <div className="flex items-center gap-4 p-2 bg-[#f0f3ff]/40 rounded-lg animate-pulse">
              <div className="w-5 h-5 bg-[#e2e8f8] rounded" />
              <div className="flex-1 space-y-1">
                <div className="w-2/5 h-3.5 bg-[#e2e8f8] rounded" />
                <div className="w-1/5 h-2.5 bg-[#e7eefe] rounded" />
              </div>
              <div className="w-16 h-5 bg-[#e2e8f8] rounded-full" />
              <div className="w-12 h-3.5 bg-[#e2e8f8] rounded" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            Reflejo visual nativo para transiciones de latencia y paginación.
          </div>
        </div>
      </div>
    </main>
  );
}
