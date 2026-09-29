'use client';

import React, { useState, useMemo } from 'react';
import { usePlanery } from '../../context/PlaneryContext';
import { GlobalCatalogItem, GlobalCatalogModule } from '../../types/planery';
import { CatalogCategoryModal } from '../../components/forms/CatalogCategoryModal';

export default function SettingsPage() {
  const { globalCatalogs, toggleGlobalCatalogItemStatus, showToast } =
    usePlanery();

  const [activeModule, setActiveModule] =
    useState<GlobalCatalogModule>('presupuesto');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'Activa' | 'Inactiva'>(
    'all'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<GlobalCatalogItem | null>(null);

  // Parámetros generales state
  const [generalParams, setGeneralParams] = useState({
    defaultCurrency: 'PEN (S/ — Sol Peruano)',
    secondaryCurrency: 'USD ($ — Dólar Estadounidense)',
    taxRate: '18% (IGV Perú)',
    defaultTimezone: 'America/Lima (GMT-5)',
    sessionTimeout: '60 minutos de inactividad',
    inviteExpiration: '48 horas (Token TLS 1.3)',
  });

  const budgetCount = globalCatalogs.filter(
    (i) => i.module === 'presupuesto' && i.status === 'Activa'
  ).length;
  const providerCount = globalCatalogs.filter(
    (i) => i.module === 'proveedores'
  ).length;
  const eventTypesCount = globalCatalogs.filter(
    (i) => i.module === 'tipos_evento'
  ).length;

  const isCatalogModule =
    activeModule === 'presupuesto' ||
    activeModule === 'proveedores' ||
    activeModule === 'tipos_evento';

  const moduleItems = useMemo(() => {
    if (!isCatalogModule) return [];
    return globalCatalogs
      .filter((item) => item.module === activeModule)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [globalCatalogs, activeModule, isCatalogModule]);

  const filteredItems = useMemo(() => {
    return moduleItems.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusTab === 'all' || item.status === statusTab;
      return matchesSearch && matchesStatus;
    });
  }, [moduleItems, searchQuery, statusTab]);

  const activeItemsCount = moduleItems.filter(
    (i) => i.status === 'Activa'
  ).length;
  const inactiveItemsCount = moduleItems.filter(
    (i) => i.status === 'Inactiva'
  ).length;

  const moduleHeaderMap: Record<
    'presupuesto' | 'proveedores' | 'tipos_evento',
    {
      icon: string;
      title: string;
      description: string;
      btnLabel: string;
    }
  > = {
    presupuesto: {
      icon: 'account_balance_wallet',
      title: 'Categorías de presupuesto',
      description:
        'Administra las categorías que podrán utilizar todas las empresas al organizar el presupuesto de sus eventos.',
      btnLabel: 'Nueva categoría',
    },
    proveedores: {
      icon: 'sell',
      title: 'Categorías de proveedores',
      description:
        'Organiza los rubros y especialidades homologadas en el directorio global de proveedores.',
      btnLabel: 'Nueva categoría',
    },
    tipos_evento: {
      icon: 'event_available',
      title: 'Tipos de evento',
      description:
        'Define las clasificaciones oficiales de eventos disponibles al crear proyectos en Planery Core.',
      btnLabel: 'Nuevo tipo de evento',
    },
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#F9FAFB]">
      {/* Subheader / Page Banner */}
      <section className="bg-white border-b border-[#E5E7EB] px-6 lg:px-8 py-5 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-[1600px] mx-auto">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <span>Plataforma</span>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
              <span className="text-[#151C27] font-medium">Configuración</span>
            </nav>
            <h1 className="text-2xl font-bold text-[#151C27] tracking-tight">
              Configuración de la plataforma
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Administra los catálogos y parámetros globales de Planery Core.
            </p>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9DFF5]/60 border border-[#575E70]/20 text-[#141B2B]">
              <span className="material-symbols-outlined text-[16px] text-[#745B00]">
                admin_panel_settings
              </span>
              <span className="text-xs font-semibold">
                Super Admin — Configuración Global
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ESTRUCTURA INTERNA DE CONFIGURACIÓN (DOS COLUMNAS) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto">
        {/* A. COLUMNA IZQUIERDA (Menú secundario de navegación: horizontal scroll / select en < md, columna md:w-[310px] en desktop) */}
        <aside className="w-full md:w-[310px] bg-white border-b md:border-b-0 md:border-r border-[#E5E7EB] flex flex-col justify-between shrink-0">
          <div className="p-4 space-y-3 md:space-y-4">
            <div className="flex items-center justify-between px-1 md:px-2 pt-0.5 md:pt-1">
              <h2 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                Módulos globales
              </h2>
              <span className="md:hidden text-[11px] text-gray-400 font-medium">
                Desliza para ver más →
              </span>
            </div>

            {/* Selector rápido móvil (< sm) + Barra de pestañas horizontal (< md) */}
            <div className="md:hidden space-y-2.5">
              <div className="relative sm:hidden">
                <select
                  aria-label="Seleccionar módulo de configuración"
                  value={activeModule}
                  onChange={(e) => {
                    const nextMod = e.target.value as GlobalCatalogModule;
                    setActiveModule(nextMod);
                    setSearchQuery('');
                    setStatusTab('all');
                  }}
                  className="w-full appearance-none bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 pr-9 text-xs font-semibold text-[#151C27] focus:outline-none focus:border-[#F2C94C]"
                >
                  <option value="presupuesto">
                    Categorías de presupuesto ({budgetCount} activas)
                  </option>
                  <option value="proveedores">
                    Categorías de proveedores ({providerCount} catálogos)
                  </option>
                  <option value="tipos_evento">
                    Tipos de evento ({eventTypesCount} tipos)
                  </option>
                  <option value="parametros">Parámetros generales</option>
                  <option value="estados">Estados del sistema (Solo lectura)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="flex overflow-x-auto gap-2 pb-2 custom-scroll">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModule('presupuesto');
                    setSearchQuery('');
                    setStatusTab('all');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    activeModule === 'presupuesto'
                      ? 'bg-[#FAF5E6] text-[#151C27] border-[#F2C94C] shadow-2xs'
                      : 'bg-gray-50 text-gray-600 border-[#E5E7EB] hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#745B00]">
                    account_balance_wallet
                  </span>
                  <span>Presupuesto</span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-white/80 text-[#065F46]">
                    {budgetCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveModule('proveedores');
                    setSearchQuery('');
                    setStatusTab('all');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    activeModule === 'proveedores'
                      ? 'bg-[#FAF5E6] text-[#151C27] border-[#F2C94C] shadow-2xs'
                      : 'bg-gray-50 text-gray-600 border-[#E5E7EB] hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#745B00]">
                    sell
                  </span>
                  <span>Proveedores</span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-white/80 text-gray-700">
                    {providerCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveModule('tipos_evento');
                    setSearchQuery('');
                    setStatusTab('all');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    activeModule === 'tipos_evento'
                      ? 'bg-[#FAF5E6] text-[#151C27] border-[#F2C94C] shadow-2xs'
                      : 'bg-gray-50 text-gray-600 border-[#E5E7EB] hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#745B00]">
                    event_available
                  </span>
                  <span>Tipos de evento</span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-white/80 text-gray-700">
                    {eventTypesCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule('parametros')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    activeModule === 'parametros'
                      ? 'bg-[#FAF5E6] text-[#151C27] border-[#F2C94C] shadow-2xs'
                      : 'bg-gray-50 text-gray-600 border-[#E5E7EB] hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#745B00]">
                    tune
                  </span>
                  <span>Parámetros</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule('estados')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                    activeModule === 'estados'
                      ? 'bg-[#FAF5E6] text-[#151C27] border-[#F2C94C] shadow-2xs'
                      : 'bg-gray-50 text-gray-600 border-[#E5E7EB] hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#745B00]">
                    checklist
                  </span>
                  <span>Estados</span>
                </button>
              </div>
            </div>

            {/* Menú en columna para Escritorio (hidden md:block) */}
            <div className="hidden md:block space-y-1.5">
              {/* 1. Categorías de presupuesto */}
              <button
                type="button"
                onClick={() => {
                  setActiveModule('presupuesto');
                  setSearchQuery('');
                  setStatusTab('all');
                }}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                  activeModule === 'presupuesto'
                    ? 'bg-white border-l-4 border-l-[#F2C94C] shadow-xs border border-[#E5E7EB]'
                    : 'hover:bg-gray-50 border border-transparent hover:border-[#E5E7EB]'
                }`}
              >
                <span
                  className={`material-symbols-outlined p-2 rounded-lg text-[20px] shrink-0 ${
                    activeModule === 'presupuesto'
                      ? 'text-[#F2C94C] bg-[#FAF5E6]'
                      : 'text-gray-400 bg-gray-100'
                  }`}
                >
                  account_balance_wallet
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-[#151C27] text-[13.5px]">
                      Categorías de presupuesto
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#ECFDF5] text-[#065F46] rounded-md shrink-0">
                      {budgetCount} activas
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11.5px] mt-0.5 line-clamp-2">
                    Clasifica los gastos de los eventos.
                  </p>
                </div>
              </button>

              {/* 2. Categorías de proveedores */}
              <button
                type="button"
                onClick={() => {
                  setActiveModule('proveedores');
                  setSearchQuery('');
                  setStatusTab('all');
                }}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                  activeModule === 'proveedores'
                    ? 'bg-white border-l-4 border-l-[#F2C94C] shadow-xs border border-[#E5E7EB]'
                    : 'hover:bg-gray-50 border border-transparent hover:border-[#E5E7EB]'
                }`}
              >
                <span
                  className={`material-symbols-outlined p-2 rounded-lg text-[20px] shrink-0 ${
                    activeModule === 'proveedores'
                      ? 'text-[#F2C94C] bg-[#FAF5E6]'
                      : 'text-gray-400 bg-gray-100'
                  }`}
                >
                  sell
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-gray-800 text-[13.5px]">
                      Categorías de proveedores
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-md shrink-0">
                      {providerCount} catálogos
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11.5px] mt-0.5 line-clamp-2">
                    Organiza los servicios de los proveedores.
                  </p>
                </div>
              </button>

              {/* 3. Tipos de evento */}
              <button
                type="button"
                onClick={() => {
                  setActiveModule('tipos_evento');
                  setSearchQuery('');
                  setStatusTab('all');
                }}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                  activeModule === 'tipos_evento'
                    ? 'bg-white border-l-4 border-l-[#F2C94C] shadow-xs border border-[#E5E7EB]'
                    : 'hover:bg-gray-50 border border-transparent hover:border-[#E5E7EB]'
                }`}
              >
                <span
                  className={`material-symbols-outlined p-2 rounded-lg text-[20px] shrink-0 ${
                    activeModule === 'tipos_evento'
                      ? 'text-[#F2C94C] bg-[#FAF5E6]'
                      : 'text-gray-400 bg-gray-100'
                  }`}
                >
                  event_available
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-gray-800 text-[13.5px]">
                      Tipos de evento
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-md shrink-0">
                      {eventTypesCount} tipos
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11.5px] mt-0.5 line-clamp-2">
                    Define los tipos de evento disponibles.
                  </p>
                </div>
              </button>

              {/* 4. Parámetros generales */}
              <button
                type="button"
                onClick={() => setActiveModule('parametros')}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                  activeModule === 'parametros'
                    ? 'bg-white border-l-4 border-l-[#F2C94C] shadow-xs border border-[#E5E7EB]'
                    : 'hover:bg-gray-50 border border-transparent hover:border-[#E5E7EB]'
                }`}
              >
                <span
                  className={`material-symbols-outlined p-2 rounded-lg text-[20px] shrink-0 ${
                    activeModule === 'parametros'
                      ? 'text-[#F2C94C] bg-[#FAF5E6]'
                      : 'text-gray-400 bg-gray-100'
                  }`}
                >
                  tune
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-800 text-[13.5px]">
                    Parámetros generales
                  </span>
                  <p className="text-gray-500 text-[11.5px] mt-0.5 line-clamp-2">
                    Configura idioma, moneda y región.
                  </p>
                </div>
              </button>

              {/* 5. Estados del sistema */}
              <button
                type="button"
                onClick={() => setActiveModule('estados')}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                  activeModule === 'estados'
                    ? 'bg-white border-l-4 border-l-[#F2C94C] shadow-xs border border-[#E5E7EB]'
                    : 'hover:bg-gray-50 border border-transparent hover:border-[#E5E7EB]'
                }`}
              >
                <span
                  className={`material-symbols-outlined p-2 rounded-lg text-[20px] shrink-0 ${
                    activeModule === 'estados'
                      ? 'text-[#F2C94C] bg-[#FAF5E6]'
                      : 'text-gray-400 bg-gray-100'
                  }`}
                >
                  checklist
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-gray-800 text-[13.5px]">
                      Estados del sistema
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60 rounded-md shrink-0">
                      Solo lectura
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11.5px] mt-0.5 line-clamp-2">
                    Consulta y administra opciones del sistema.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Callout informativo al pie del menú secundario */}
          <div className="hidden md:block p-4 m-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex gap-2.5">
              <span className="material-symbols-outlined text-gray-500 text-[18px] shrink-0 mt-0.5">
                info
              </span>
              <div className="text-[11.5px] leading-relaxed text-gray-600">
                <strong className="text-gray-800 font-semibold block mb-0.5">
                  Ámbito Global
                </strong>
                Todos los cambios realizados en estos catálogos aplican instantáneamente como opciones disponibles para todas las empresas de Planery Core sin alterar datos históricos.
              </div>
            </div>
          </div>
        </aside>

        {/* B. PANEL PRINCIPAL (DERECHA) */}
        <section className="flex-1 min-w-0 bg-[#F9FAFB] px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {isCatalogModule && (
              <>
                {/* Encabezado de la Sección */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#F2C94C] text-[26px]">
                        {moduleHeaderMap[activeModule].icon}
                      </span>
                      <h2 className="text-xl font-bold text-[#151C27] tracking-tight">
                        {moduleHeaderMap[activeModule].title}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                      {moduleHeaderMap[activeModule].description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setItemToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-[#F2C94C] hover:bg-[#ebc246] text-[#111827] font-bold px-4 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                    <span>{moduleHeaderMap[activeModule].btnLabel}</span>
                  </button>
                </div>

                {/* Barra de Herramientas (Toolbar) */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
                  {/* Buscador Rápido */}
                  <div className="relative flex-1 sm:max-w-sm">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por nombre de categoría..."
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#151C27] placeholder:text-gray-400 focus:outline-none focus:border-[#F2C94C] transition-all"
                    />
                  </div>

                  {/* Filtros y Ordenamiento */}
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                    {/* Filtro de Estado */}
                    <div className="inline-flex p-0.5 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => setStatusTab('all')}
                        className={`flex-1 sm:flex-initial px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          statusTab === 'all'
                            ? 'font-semibold bg-white text-[#151C27] shadow-2xs'
                            : 'font-medium text-gray-600 hover:text-[#151C27]'
                        }`}
                      >
                        Todas ({moduleItems.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusTab('Activa')}
                        className={`flex-1 sm:flex-initial px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          statusTab === 'Activa'
                            ? 'font-semibold bg-white text-[#151C27] shadow-2xs'
                            : 'font-medium text-gray-600 hover:text-[#151C27]'
                        }`}
                      >
                        Activas ({activeItemsCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusTab('Inactiva')}
                        className={`flex-1 sm:flex-initial px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          statusTab === 'Inactiva'
                            ? 'font-semibold bg-white text-[#151C27] shadow-2xs'
                            : 'font-medium text-gray-600 hover:text-[#151C27]'
                        }`}
                      >
                        Inactivas ({inactiveItemsCount})
                      </button>
                    </div>

                    {/* Selector de Ordenamiento */}
                    <div className="hidden xl:flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">
                        sort
                      </span>
                      <span>
                        Ordenar por:{' '}
                        <strong className="font-semibold text-[#151C27]">
                          Orden de aparición
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabla Profesional de Alta Densidad */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                          <th
                            scope="col"
                            className="py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
                          >
                            Nombre
                          </th>
                          <th
                            scope="col"
                            className="hidden md:table-cell py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
                          >
                            Descripción
                          </th>
                          <th
                            scope="col"
                            className="hidden md:table-cell py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center"
                          >
                            Orden de visualización
                          </th>
                          <th
                            scope="col"
                            className="py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center"
                          >
                            Estado
                          </th>
                          <th
                            scope="col"
                            className="py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right"
                          >
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB] text-xs text-[#151C27]">
                        {filteredItems.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-[#F9FAFB] transition-colors group"
                          >
                            <td className="py-3 px-4 font-semibold text-gray-900">
                              <div className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-gray-500 text-[18px] cursor-grab shrink-0">
                                  drag_indicator
                                </span>
                                <div>
                                  <span className="block">{item.name}</span>
                                  <span className="md:hidden text-[11px] font-normal text-gray-500 line-clamp-1 mt-0.5">
                                    {item.description}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="hidden md:table-cell py-3 px-4 text-gray-600">
                              {item.description}
                            </td>
                            <td className="hidden md:table-cell py-3 px-4 text-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-semibold text-gray-700 tabular-nums">
                                {item.displayOrder}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {item.status === 'Activa' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                  Activa
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                  Inactiva
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setItemToEdit(item);
                                    setIsModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded transition-colors cursor-pointer"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleGlobalCatalogItemStatus(item.id)
                                  }
                                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                                    item.status === 'Activa'
                                      ? 'text-gray-700 hover:text-rose-600 hover:bg-red-50'
                                      : 'text-emerald-700 hover:bg-emerald-50'
                                  }`}
                                >
                                  {item.status === 'Activa'
                                    ? 'Desactivar'
                                    : 'Activar'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setItemToEdit(item);
                                    setIsModalOpen(true);
                                  }}
                                  aria-label="Más opciones"
                                  className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    more_vert
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer de la Tabla */}
                  <div className="px-5 py-3.5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">
                      Mostrando {filteredItems.length} de {moduleItems.length}{' '}
                      categorías globales
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-gray-400">
                        touch_app
                      </span>
                      <span>
                        Arrastra o edita el orden numérico para modificar la prioridad de visualización en el módulo de presupuestos.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Componente de Integridad Global (Bento Card Auxiliar) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF5E6] text-[#745B00] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        sync
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-[13px]">
                        Sincronización en tiempo real
                      </h4>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        Las empresas activas reciben actualizaciones de catálogo sin requerir reinicio de sesión.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#D9DFF5]/60 text-[#1E222D] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        shield
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-[13px]">
                        Protección de registros
                      </h4>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        Desactivar una categoría no afecta gastos previamente vinculados ni estadísticas históricas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        format_list_numbered
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-[13px]">
                        Orden estricto
                      </h4>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        El valor numérico de orden rige de menor a mayor en todos los desplegables de gastos.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeModule === 'parametros' && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#F2C94C] text-[24px]">
                      tune
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-[#151C27]">
                        Parámetros generales de la plataforma
                      </h2>
                      <p className="text-xs text-gray-500">
                        Configuración regional, fiscal y de seguridad predeterminada para nuevos tenants.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        'Parámetros globales de Planery Core actualizados.'
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-[#F2C94C] hover:bg-[#ebc246] text-[#111827] font-bold text-xs cursor-pointer"
                  >
                    Guardar parámetros
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Moneda principal predeterminada
                    </label>
                    <input
                      type="text"
                      value={generalParams.defaultCurrency}
                      onChange={(e) =>
                        setGeneralParams({
                          ...generalParams,
                          defaultCurrency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Moneda secundaria habilitada
                    </label>
                    <input
                      type="text"
                      value={generalParams.secondaryCurrency}
                      onChange={(e) =>
                        setGeneralParams({
                          ...generalParams,
                          secondaryCurrency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Impuesto predeterminado (IGV / IVA)
                    </label>
                    <input
                      type="text"
                      value={generalParams.taxRate}
                      onChange={(e) =>
                        setGeneralParams({
                          ...generalParams,
                          taxRate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Zona horaria del servidor
                    </label>
                    <input
                      type="text"
                      value={generalParams.defaultTimezone}
                      onChange={(e) =>
                        setGeneralParams({
                          ...generalParams,
                          defaultTimezone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'estados' && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#F2C94C] text-[24px]">
                      checklist
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-[#151C27]">
                        Estados del sistema (Inmutables)
                      </h2>
                      <p className="text-xs text-gray-500">
                        Máquina de estados oficial para eventos, pagos y tareas operativas.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
                    Modo Solo Lectura
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <h4 className="font-bold text-gray-900">
                      Estados de Evento
                    </h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Planificación</li>
                      <li>• En progreso</li>
                      <li>• Confirmado</li>
                      <li>• Completado</li>
                      <li>• Cancelado</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <h4 className="font-bold text-gray-900">Estados de Pago</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Pagado</li>
                      <li>• Programado</li>
                      <li>• Pendiente</li>
                      <li>• Anulado</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <h4 className="font-bold text-gray-900">
                      Estados de Usuario y Tenant
                    </h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Activo / Activa</li>
                      <li>• Invitación pendiente</li>
                      <li>• Suspendido / Suspendida</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL INTERACTIVO: NUEVA / EDITAR CATEGORÍA */}
      {isCatalogModule && (
        <CatalogCategoryModal
          isOpen={isModalOpen}
          module={activeModule}
          suggestedOrder={moduleItems.length + 1}
          itemToEdit={itemToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setItemToEdit(null);
          }}
        />
      )}
    </div>
  );
}
