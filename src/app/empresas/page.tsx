'use client';

import React, { useState, useMemo } from 'react';
import { usePlanery } from '../../context/PlaneryContext';
import { PlatformCompany } from '../../types/planery';
import { DetalleEmpresaDrawer } from '../../components/modals/DetalleEmpresaDrawer';
import { FormularioEmpresaModal } from '../../components/forms/FormularioEmpresaModal';

export default function EmpresasPage() {
  const { companies, togglePlatformCompanyStatus, showToast } = usePlanery();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [dateFilter, setDateFilter] = useState('Cualquier fecha');
  const [planFilter, setPlanFilter] = useState('Todos los planes');
  const [sortBy, setSortBy] = useState('Más recientes');
  const [selectedIds, setSelectedIds] = useState<string[]>(['EMP-2026-0042']);

  // Drawer & Modal states
  const [drawerCompanyId, setDrawerCompanyId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<PlatformCompany | null>(
    null
  );

  const drawerCompany = useMemo(
    () => companies.find((c) => c.id === drawerCompanyId) || null,
    [companies, drawerCompanyId]
  );

  const filteredCompanies = useMemo(() => {
    const list = companies.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        c.commercialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ruc.includes(searchQuery) ||
        c.adminName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'Todos los estados' || c.status === statusFilter;
      const matchesPlan =
        planFilter === 'Todos los planes' || c.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });

    if (sortBy === 'Nombre A-Z') {
      return [...list].sort((a, b) =>
        a.commercialName.localeCompare(b.commercialName)
      );
    }
    if (sortBy === 'Más antiguas') {
      return [...list].reverse();
    }
    return list;
  }, [companies, searchQuery, statusFilter, planFilter, sortBy]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCompanies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCompanies.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('Todos los estados');
    setDateFilter('Cualquier fecha');
    setPlanFilter('Todos los planes');
    setSortBy('Más recientes');
  };

  const renderPlanPill = (plan: PlatformCompany['plan']) => {
    if (plan === 'Profesional') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          Profesional
        </span>
      );
    }
    if (plan === 'Enterprise') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
          Enterprise
        </span>
      );
    }
    if (plan === 'Starter') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
          Starter
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-300">
        Sin plan
      </span>
    );
  };

  const renderStatusPill = (status: PlatformCompany['status']) => {
    if (status === 'Activa') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          Activa
        </span>
      );
    }
    if (status === 'Pendiente') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pendiente
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFDAD6] text-[#93000A] border border-rose-300">
        <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A]" />
        Suspendida
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#151C27] tracking-tight">
            Empresas
          </h1>
          <p className="text-sm text-[#575E70] mt-1">
            Administra las organizaciones registradas en Planery Core.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              showToast('Exportando padrón de empresas corporativas (CSV)...')
            }
            className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-[#D0C5AF] bg-white rounded-xl text-xs font-semibold text-[#151C27] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              file_download
            </span>
            <span>Exportar</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCompanyToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F2C94C] text-[#241A00] px-5 py-2.5 rounded-xl font-bold text-xs hover:brightness-95 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[18px]">
              add
            </span>
            <span>+ Nueva empresa</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-[#D0C5AF]/70 p-4 rounded-xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#575E70] font-semibold uppercase tracking-wider">
              Total de empresas
            </span>
            <span className="material-symbols-outlined text-[#575E70]">
              corporate_fare
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#151C27] tabular-nums">
              {137 + companies.length}
            </span>
            <span className="text-[11px] text-[#745B00] font-semibold">
              +6 este mes
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#D0C5AF]/70 p-4 rounded-xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#575E70] font-semibold uppercase tracking-wider">
              Empresas activas
            </span>
            <span className="material-symbols-outlined text-[#575E70]">
              check_circle
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#151C27] tabular-nums">
              {125 + companies.filter((c) => c.status === 'Activa').length}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold tabular-nums">
              90.1%
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#D0C5AF]/70 p-4 rounded-xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#575E70] font-semibold uppercase tracking-wider">
              Pendientes de activación
            </span>
            <span className="material-symbols-outlined text-[#575E70]">
              hourglass_top
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#151C27] tabular-nums">
              {8 + companies.filter((c) => c.status === 'Pendiente').length}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
              Requiere revisión
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-[#D0C5AF]/70 p-4 rounded-xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#575E70] font-semibold uppercase tracking-wider">
              Empresas suspendidas
            </span>
            <span className="material-symbols-outlined text-[#575E70]">
              block
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#151C27] tabular-nums">
              {4 + companies.filter((c) => c.status === 'Suspendida').length}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#FFDAD6] text-[#93000A] border border-rose-300 text-[11px] font-semibold">
              Acceso restringido
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & TOOLBAR BAR */}
      <div className="bg-white border border-[#D0C5AF]/70 p-4 rounded-xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 sm:min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#575E70] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar empresa por nombre o RUC..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20"
            />
          </div>

          {/* Selects & Controls */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg text-xs py-2 pl-3 pr-8 bg-white text-[#151C27] focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Todos los estados</option>
              <option>Activa</option>
              <option>Pendiente</option>
              <option>Suspendida</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-slate-300 rounded-lg text-xs py-2 pl-3 pr-8 bg-white text-[#151C27] focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Cualquier fecha</option>
              <option>Últimos 30 días</option>
              <option>Este año</option>
            </select>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="border border-slate-300 rounded-lg text-xs py-2 pl-3 pr-8 bg-white text-[#151C27] focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Todos los planes</option>
              <option>Starter</option>
              <option>Profesional</option>
              <option>Enterprise</option>
              <option>Sin plan</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-300 rounded-lg text-xs py-2 pl-3 pr-8 bg-white text-[#151C27] focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Más recientes</option>
              <option>Nombre A-Z</option>
              <option>Más antiguas</option>
            </select>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#575E70] hover:text-[#151C27] px-2 py-2 underline transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* ADVANCED TABLE CONTAINER */}
      <div className="bg-white border border-[#D0C5AF]/70 rounded-xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F0F3FF]/70 border-b border-slate-200 text-[#575E70] uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredCompanies.length > 0 &&
                      selectedIds.length === filteredCompanies.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 accent-[#F2C94C] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Empresa</th>
                <th className="hidden md:table-cell py-3 px-4">RUC</th>
                <th className="hidden lg:table-cell py-3 px-4">Administrador</th>
                <th className="hidden md:table-cell py-3 px-4">Usuarios</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Estado</th>
                <th className="hidden md:table-cell py-3 px-4">Fecha de registro</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredCompanies.map((comp) => {
                const isSelected =
                  selectedIds.includes(comp.id) ||
                  drawerCompanyId === comp.id;
                return (
                  <tr
                    key={comp.id}
                    onClick={() => setDrawerCompanyId(comp.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F2C94C]/10 border-l-4 border-l-[#F2C94C] hover:bg-[#F2C94C]/15'
                        : 'hover:bg-[#F0F3FF]/50'
                    }`}
                  >
                    <td
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(comp.id)}
                        onChange={() => toggleSelectOne(comp.id)}
                        className="rounded border-slate-300 accent-[#F2C94C] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#151C27] block">
                        {comp.commercialName}
                      </span>
                      <span className="text-[11px] text-[#575E70]">
                        {comp.categorySubtext}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4 font-mono text-xs text-[#151C27] tabular-nums">
                      {comp.ruc}
                    </td>
                    <td className="hidden lg:table-cell py-3.5 px-4">
                      <span className="text-[#151C27] block font-medium">
                        {comp.adminName}
                      </span>
                      <span className="text-[11px] text-[#575E70]">
                        {comp.adminEmail}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#E2E8F8] text-[#5C6274] font-medium tabular-nums">
                        {comp.usersTotal} usuarios
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{renderPlanPill(comp.plan)}</td>
                    <td className="py-3.5 px-4">
                      {renderStatusPill(comp.status)}
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4 text-[#575E70]">
                      {comp.registeredDate}
                    </td>
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setDrawerCompanyId(comp.id)}
                        className="p-1 rounded hover:bg-slate-100 transition-colors text-[#575E70] hover:text-[#151C27] cursor-pointer"
                        title="Ver detalle de empresa"
                      >
                        <span className="material-symbols-outlined">
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

        {/* Table Pagination Footer */}
        <div className="px-4 py-3 bg-[#F0F3FF]/60 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#575E70]">
          <span>
            Mostrando 1 a {filteredCompanies.length} de {137 + companies.length}{' '}
            organizaciones
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              className="px-2.5 py-1 border border-[#F2C94C] bg-[#F2C94C] text-[#241A00] font-bold rounded"
            >
              1
            </button>
            <button
              type="button"
              className="px-2.5 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="px-2.5 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              3
            </button>
            <span className="px-1">...</span>
            <button
              type="button"
              className="px-2.5 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              29
            </button>
            <button
              type="button"
              className="px-2.5 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* DRAWER & MODAL */}
      <DetalleEmpresaDrawer
        company={drawerCompany}
        onClose={() => setDrawerCompanyId(null)}
        onEdit={(comp) => {
          setDrawerCompanyId(null);
          setCompanyToEdit(comp);
          setIsFormModalOpen(true);
        }}
        onToggleStatus={(comp) => {
          togglePlatformCompanyStatus(
            comp.id,
            comp.status === 'Suspendida' ? 'Activa' : 'Suspendida'
          );
        }}
      />

      <FormularioEmpresaModal
        isOpen={isFormModalOpen}
        companyToEdit={companyToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setCompanyToEdit(null);
        }}
      />
    </div>
  );
}
