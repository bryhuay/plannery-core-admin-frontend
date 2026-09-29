'use client';

import React, { useState, useMemo } from 'react';
import { usePlanery } from '../../context/PlaneryContext';
import { PlatformUser } from '../../types/planery';
import { CrearUsuarioModal } from '../../components/forms/CrearUsuarioModal';
import { DetalleUsuarioDrawer } from '../../components/modals/DetalleUsuarioDrawer';
import {
  EditarUsuarioModal,
  CambiarRolModal,
  ReenviarInvitacionModal,
  SuspenderUsuarioModal,
} from '../../components/modals/AccionesUsuarioModals';

export default function UsuariosPage() {
  const { platformUsers, companies } = usePlanery();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('recientes');
  const [selectedIds, setSelectedIds] = useState<string[]>(['USR-2026-0819']);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modals & Drawer states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<PlatformUser | null>(null);
  const [roleUser, setRoleUser] = useState<PlatformUser | null>(null);
  const [resendUser, setResendUser] = useState<PlatformUser | null>(null);
  const [suspendUser, setSuspendUser] = useState<PlatformUser | null>(null);

  const drawerUser = useMemo(
    () => platformUsers.find((u) => u.id === drawerUserId) || null,
    [platformUsers, drawerUserId]
  );

  const filteredUsers = useMemo(() => {
    const list = platformUsers.filter((u) => {
      const matchesSearch =
        !searchQuery.trim() ||
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompany =
        !companyFilter ||
        u.companyId === companyFilter ||
        u.companyName.toLowerCase().includes(companyFilter.toLowerCase());
      const matchesRole = !roleFilter || u.role === roleFilter;
      const matchesStatus = !statusFilter || u.status === statusFilter;
      return matchesSearch && matchesCompany && matchesRole && matchesStatus;
    });

    if (sortBy === 'az') {
      return [...list].sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
    if (sortBy === 'empresa') {
      return [...list].sort((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
    }
    if (sortBy === 'rol') {
      return [...list].sort((a, b) => a.role.localeCompare(b.role));
    }
    return list;
  }, [
    platformUsers,
    searchQuery,
    companyFilter,
    roleFilter,
    statusFilter,
    sortBy,
  ]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCompanyFilter('');
    setRoleFilter('');
    setStatusFilter('');
    setSortBy('recientes');
  };

  const renderRoleBadge = (role: PlatformUser['role']) => {
    if (role === 'Super Admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <span className="material-symbols-outlined text-[13px]">
            shield_person
          </span>
          Super Admin
        </span>
      );
    }
    if (role === 'Company Admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span className="material-symbols-outlined text-[13px]">
            admin_panel_settings
          </span>
          Company Admin
        </span>
      );
    }
    if (role === 'Planner') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <span className="material-symbols-outlined text-[13px]">
            event_seat
          </span>
          Planner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
        <span className="material-symbols-outlined text-[13px]">person</span>
        Client
      </span>
    );
  };

  const renderStatusBadge = (status: PlatformUser['status']) => {
    if (status === 'Activo') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Activo
        </span>
      );
    }
    if (status === 'Invitación pendiente') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Invitación pendiente
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Suspendido
      </span>
    );
  };

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6"
      onClick={() => setOpenMenuId(null)}
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E222D] tracking-tight">
            Usuarios
          </h1>
          <p className="text-sm text-[#6C757D] mt-1">
            Administra los usuarios, sus roles y el acceso a las empresas de Planery Core.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto justify-center bg-[#F2C94C] hover:bg-[#e0b83b] text-[#1E222D] font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg font-bold">
              person_add
            </span>
            <span>+ Nuevo usuario</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-[#E9ECEF] rounded-xl p-5 shadow-xs hover:border-[#D0D5DD] transition-all">
          <div className="flex items-center justify-between text-[#6C757D] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
              Total de usuarios
            </span>
            <span className="material-symbols-outlined text-[#ADB5BD]">
              group
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1E222D] tabular-nums">
              {378 + platformUsers.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>{' '}
              +18 este mes
            </span>
          </div>
          <p className="text-xs text-[#ADB5BD] mt-2">
            Registrados en toda la plataforma
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-[#E9ECEF] rounded-xl p-5 shadow-xs hover:border-[#D0D5DD] transition-all">
          <div className="flex items-center justify-between text-[#6C757D] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
              Usuarios activos
            </span>
            <span className="material-symbols-outlined text-emerald-600">
              check_circle
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1E222D] tabular-nums">
              {338 +
                platformUsers.filter((u) => u.status === 'Activo').length}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md tabular-nums">
              89.1%
            </span>
          </div>
          <p className="text-xs text-[#ADB5BD] mt-2">
            Con actividad en los últimos 30 días
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-[#E9ECEF] rounded-xl p-5 shadow-xs hover:border-[#D0D5DD] transition-all">
          <div className="flex items-center justify-between text-[#6C757D] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
              Invitaciones pendientes
            </span>
            <span className="material-symbols-outlined text-amber-500">
              mail
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1E222D] tabular-nums">
              {28 +
                platformUsers.filter(
                  (u) => u.status === 'Invitación pendiente'
                ).length}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Por confirmar
            </span>
          </div>
          <p className="text-xs text-[#ADB5BD] mt-2">
            Enlace de acceso enviado por correo
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-[#E9ECEF] rounded-xl p-5 shadow-xs hover:border-[#D0D5DD] transition-all">
          <div className="flex items-center justify-between text-[#6C757D] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6C757D]">
              Usuarios suspendidos
            </span>
            <span className="material-symbols-outlined text-rose-500">
              block
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1E222D] tabular-nums">
              {12 +
                platformUsers.filter((u) => u.status === 'Suspendido').length}
            </span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              Acceso revocado
            </span>
          </div>
          <p className="text-xs text-[#ADB5BD] mt-2">
            Conservan historial íntegro
          </p>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white border border-[#E9ECEF] rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#ADB5BD]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg pl-10 pr-4 py-2 text-sm text-[#1E222D] placeholder-[#ADB5BD] focus:outline-none focus:border-[#F2C94C] focus:bg-white transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
            {/* Empresa Select */}
            <div className="relative">
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full appearance-none bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#1E222D] hover:bg-white focus:outline-none focus:border-[#F2C94C] cursor-pointer"
              >
                <option value="">Todas las empresas</option>
                <option value="plataforma">Plataforma (Super Admin)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.commercialName}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#6C757D] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Rol Select */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#1E222D] hover:bg-white focus:outline-none focus:border-[#F2C94C] cursor-pointer"
              >
                <option value="">Todos los roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Company Admin">Company Admin</option>
                <option value="Planner">Planner</option>
                <option value="Client">Client</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#6C757D] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Estado Select */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#1E222D] hover:bg-white focus:outline-none focus:border-[#F2C94C] cursor-pointer"
              >
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Invitación pendiente">
                  Invitación pendiente
                </option>
                <option value="Suspendido">Suspendido</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#6C757D] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Ordenamiento Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-[#1E222D] hover:bg-white focus:outline-none focus:border-[#F2C94C] cursor-pointer"
              >
                <option value="recientes">Más recientes</option>
                <option value="az">Nombre A-Z</option>
                <option value="empresa">Empresa</option>
                <option value="rol">Rol</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#6C757D] pointer-events-none">
                sort
              </span>
            </div>

            {/* Limpiar Filtros */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="justify-center text-xs font-semibold text-[#6C757D] hover:text-[#1E222D] px-2.5 py-2 hover:bg-[#F1F3F5] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                restart_alt
              </span>
              <span>Limpiar filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* USERS DATA TABLE */}
      <div className="bg-white border border-[#E9ECEF] rounded-xl shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E9ECEF] text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredUsers.length > 0 &&
                      selectedIds.length === filteredUsers.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-[#CED4DA] accent-[#F2C94C] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Usuario</th>
                <th className="hidden sm:table-cell py-3 px-4">Empresa</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Estado</th>
                <th className="hidden md:table-cell py-3 px-4">Último acceso</th>
                <th className="hidden md:table-cell py-3 px-4">Fecha registro</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF] text-xs">
              {filteredUsers.map((u) => {
                const isSelected = selectedIds.includes(u.id);
                return (
                  <tr
                    key={u.id}
                    className={`hover:bg-[#F8F9FA] transition-colors group ${
                      isSelected ? 'bg-[#FEFBF0]/40' : ''
                    } ${u.status === 'Suspendido' ? 'opacity-85' : ''}`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(u.id)}
                        className="rounded border-[#CED4DA] accent-[#F2C94C] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 ${u.avatarColor}`}
                        >
                          {u.initials}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => setDrawerUserId(u.id)}
                            className="font-bold text-[#1E222D] hover:underline flex items-center gap-1 cursor-pointer text-left"
                          >
                            <span>{u.fullName}</span>
                            {u.verifiedBadge && (
                              <span className="material-symbols-outlined text-amber-500 text-xs">
                                verified
                              </span>
                            )}
                          </button>
                          <p className="text-[11px] text-[#6C757D]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-3.5 px-4">
                      {u.companyId === 'plataforma' ? (
                        <>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                            <span className="material-symbols-outlined text-xs">
                              corporate_fare
                            </span>
                            Plataforma
                          </span>
                          <div className="text-[10px] text-[#6C757D]">
                            {u.companySubtext}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-medium text-[#1E222D]">
                            {u.companyName}
                          </div>
                          <div className="text-[10px] text-[#6C757D] font-mono">
                            {u.companySubtext}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{renderRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(u.status)}
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4 text-[#1E222D]">
                      {u.lastAccess === 'Sin acceso' ? (
                        <span className="italic text-[11px] text-[#6C757D]">
                          Sin acceso
                        </span>
                      ) : (
                        <>
                          <div>{u.lastAccess}</div>
                          <div
                            className={`text-[10px] ${
                              u.status === 'Suspendido'
                                ? 'text-rose-600'
                                : 'text-[#6C757D] font-mono'
                            }`}
                          >
                            {u.status === 'Suspendido'
                              ? 'Acceso inhabilitado'
                              : `IP: ${u.lastAccessIp}`}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4 text-[#6C757D]">
                      {u.registeredDate}
                    </td>
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(openMenuId === u.id ? null : u.id)
                          }
                          className="p-1.5 rounded-lg text-[#6C757D] hover:text-[#1E222D] hover:bg-[#E9ECEF] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">
                            more_vert
                          </span>
                        </button>

                        {openMenuId === u.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#E9ECEF] py-1.5 z-20 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                setDrawerUserId(u.id);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#1E222D] hover:bg-[#F8F9FA] flex items-center gap-2 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm text-[#6C757D]">
                                visibility
                              </span>
                              Ver detalle
                            </button>

                            {u.status === 'Invitación pendiente' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setResendUser(u);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-amber-800 hover:bg-amber-50 font-medium flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm text-amber-600">
                                  forward_to_inbox
                                </span>
                                Reenviar invitación
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                setEditUser(u);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#1E222D] hover:bg-[#F8F9FA] flex items-center gap-2 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm text-[#6C757D]">
                                edit
                              </span>
                              Editar usuario
                            </button>

                            {u.isSystemProtected ? (
                              <div className="px-3 py-1 text-[10px] text-[#6C757D] italic">
                                Rol protegido por sistema
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setRoleUser(u);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-[#1E222D] hover:bg-[#F8F9FA] flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-sm text-[#6C757D]">
                                    swap_horiz
                                  </span>
                                  Cambiar rol
                                </button>
                                <div className="h-px bg-[#E9ECEF] my-1" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setSuspendUser(u);
                                  }}
                                  className={`w-full px-3 py-1.5 text-xs flex items-center gap-2 cursor-pointer ${
                                    u.status === 'Suspendido'
                                      ? 'text-emerald-700 hover:bg-emerald-50 font-medium'
                                      : 'text-rose-600 hover:bg-rose-50'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {u.status === 'Suspendido'
                                      ? 'check_circle'
                                      : 'block'}
                                  </span>
                                  {u.status === 'Suspendido'
                                    ? 'Activar usuario'
                                    : 'Suspender'}
                                </button>
                              </>
                            )}
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

        {/* Table Pagination Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-[#E9ECEF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6C757D]">
          <div className="flex items-center gap-2">
            <span>
              Mostrando{' '}
              <span className="font-bold text-[#1E222D]">
                1 a {filteredUsers.length}
              </span>{' '}
              de{' '}
              <span className="font-bold text-[#1E222D]">
                {378 + platformUsers.length}
              </span>{' '}
              usuarios
            </span>
            <span className="text-[#ADB5BD]">|</span>
            <select className="bg-[#F8F9FA] border border-[#E9ECEF] rounded px-2 py-0.5 text-xs text-[#1E222D] focus:outline-none">
              <option>10 por página</option>
              <option>25 por página</option>
              <option>50 por página</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="p-1 rounded border border-[#E9ECEF] text-[#ADB5BD] hover:bg-[#F8F9FA] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded font-bold text-xs bg-[#F2C94C] text-[#1E222D] flex items-center justify-center shadow-xs"
            >
              1
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded font-medium text-xs text-[#1E222D] hover:bg-[#F8F9FA] flex items-center justify-center cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded font-medium text-xs text-[#1E222D] hover:bg-[#F8F9FA] flex items-center justify-center cursor-pointer"
            >
              3
            </button>
            <span className="px-1 text-[#ADB5BD]">...</span>
            <button
              type="button"
              className="w-7 h-7 rounded font-medium text-xs text-[#1E222D] hover:bg-[#F8F9FA] flex items-center justify-center cursor-pointer"
            >
              39
            </button>
            <button
              type="button"
              className="p-1 rounded border border-[#E9ECEF] text-[#1E222D] hover:bg-[#F8F9FA] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      <CrearUsuarioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DetalleUsuarioDrawer
        user={drawerUser}
        onClose={() => setDrawerUserId(null)}
        onEdit={(u) => {
          setDrawerUserId(null);
          setEditUser(u);
        }}
        onChangeRole={(u) => {
          setDrawerUserId(null);
          setRoleUser(u);
        }}
        onSuspendOrActivate={(u) => {
          setDrawerUserId(null);
          setSuspendUser(u);
        }}
      />

      <EditarUsuarioModal
        user={editUser}
        onClose={() => setEditUser(null)}
      />

      <CambiarRolModal
        user={roleUser}
        onClose={() => setRoleUser(null)}
      />

      <ReenviarInvitacionModal
        user={resendUser}
        onClose={() => setResendUser(null)}
      />

      <SuspenderUsuarioModal
        user={suspendUser}
        onClose={() => setSuspendUser(null)}
      />
    </div>
  );
}
