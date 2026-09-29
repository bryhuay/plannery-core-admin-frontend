'use client';

import React, { useState } from 'react';
import { usePathname } from '../../../lib/navigation';
import {
  EventDetailTab,
  BudgetCategory,
  DocumentItem,
} from '../../../types/planery';
import { usePlanery } from '../../../context/PlaneryContext';
import {
  TabResumen,
  TabProveedoresEvento,
} from '../../../components/eventos/TabResumen';
import {
  TabPresupuestoEvento,
  TabPagosEvento,
  TabDocumentosEvento,
} from '../../../components/eventos/TabFinanzas';
import {
  TabTareasEvento,
  TabActividadEvento,
} from '../../../components/eventos/TabOperaciones';
import { AgregarProveedorEventoDrawer } from '../../../components/modals/AgregarProveedorEventoDrawer';
import {
  DetalleCategoriaPresupuestoDrawer,
  AgregarCategoriaPresupuestoDrawer,
} from '../../../components/modals/PresupuestoDrawers';
import { RegistrarPagoDrawer } from '../../../components/modals/RegistrarPagoDrawer';
import { SubirDocumentoDrawer } from '../../../components/modals/SubirDocumentoDrawer';
import { EliminarDocumentoModal } from '../../../components/modals/EliminarDocumentoModal';
import { CrearTareaDrawer } from '../../../components/modals/CrearTareaDrawer';
import { EditarEventoModal } from '../../../components/modals/EditarEventoModal';

export default function DetalleEventoPage() {
  const pathname = usePathname();
  const {
    events,
    eventProviders,
    documents,
    tasks,
    activeEventTab,
    setActiveEventTab,
    deleteDocument,
    showToast,
  } = usePlanery();

  const eventIdFromUrl = pathname.startsWith('/eventos/')
    ? pathname.replace('/eventos/', '')
    : 'EV-2026-084';

  const currentEvent =
    events.find((e) => e.id === eventIdFromUrl) || events[0];

  // Drawer & Modal States
  const [isEditarEventoOpen, setIsEditarEventoOpen] = useState(false);
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [selectedBudgetCategory, setSelectedBudgetCategory] =
    useState<BudgetCategory | null>(null);
  const [isAddBudgetCategoryOpen, setIsAddBudgetCategoryOpen] =
    useState(false);
  const [isRegistrarPagoOpen, setIsRegistrarPagoOpen] = useState(false);
  const [isSubirDocumentoOpen, setIsSubirDocumentoOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);
  const [isCrearTareaOpen, setIsCrearTareaOpen] = useState(false);

  const tabs: {
    id: EventDetailTab;
    label: string;
    icon: string;
    badge?: number;
  }[] = [
    { id: 'resumen', label: 'Resumen', icon: 'dashboard' },
    {
      id: 'proveedores',
      label: 'Proveedores',
      icon: 'group',
      badge: eventProviders.length,
    },
    {
      id: 'presupuesto',
      label: 'Presupuesto',
      icon: 'account_balance_wallet',
    },
    { id: 'pagos', label: 'Pagos', icon: 'receipt_long' },
    {
      id: 'documentos',
      label: 'Documentos',
      icon: 'description',
      badge: documents.length,
    },
    {
      id: 'tareas',
      label: 'Tareas',
      icon: 'check_box',
      badge: tasks.length,
    },
    { id: 'actividad', label: 'Actividad', icon: 'history' },
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* 3. EVENT HEADER OFICIAL */}
      <section className="bg-white border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-7 pb-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <h1 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold text-slate-900 tracking-tight">
                  {currentEvent.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  {currentEvent.type}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {currentEvent.status}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500">
                Código identificador de proyecto:{' '}
                <span className="font-semibold text-slate-700">
                  {currentEvent.code}
                </span>
              </p>
            </div>

            {/* Acciones a la derecha */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsEditarEventoOpen(true)}
                className="h-9 px-4 rounded-lg border border-[#E5E7EB] bg-white hover:border-slate-900 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">
                  edit
                </span>
                <span>Editar</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast('Exportando dossier ejecutivo del evento...')
                }
                className="h-9 px-3.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-slate-900 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
              >
                <span>Más acciones</span>
                <span className="material-symbols-outlined text-[18px]">
                  keyboard_arrow_down
                </span>
              </button>
            </div>
          </div>

          {/* Metadatos con Iconos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                event
              </span>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Fecha evento
                </span>
                <span className="font-medium text-slate-900">
                  {currentEvent.dateFormatted} · {currentEvent.startTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                location_on
              </span>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Ubicación
                </span>
                <span className="font-medium text-slate-900">
                  {currentEvent.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                person
              </span>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Planner Líder
                </span>
                <span className="font-medium text-slate-900">
                  {currentEvent.planner}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                groups
              </span>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Cliente titular
                </span>
                <span className="font-medium text-slate-900">
                  {currentEvent.client}
                </span>
              </div>
            </div>
          </div>

          {/* 4. TABS DE NAVEGACIÓN INTERNA */}
          <nav
            aria-label="Pestañas de Detalle"
            className="flex overflow-x-auto items-center gap-4 sm:gap-6 mt-3 border-b border-transparent -mb-[21px] pb-2 sm:pb-0 text-sm select-none"
          >
            {tabs.map((tab) => {
              const isActive = activeEventTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEventTab(tab.id)}
                  className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    isActive
                      ? 'text-slate-900 font-bold border-[#f2c94c]'
                      : 'text-slate-500 hover:text-slate-900 font-medium border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {typeof tab.badge === 'number' && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full tabular-nums ${
                        isActive
                          ? 'bg-[#f2c94c] text-slate-950 font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* 5. CONTENIDO PRINCIPAL DE LA PESTAÑA ACTIVA */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-[1400px] mx-auto">
          {activeEventTab === 'resumen' && (
            <TabResumen
              event={currentEvent}
              onSelectTab={(t) => setActiveEventTab(t)}
              onOpenEditModal={() => setIsEditarEventoOpen(true)}
            />
          )}

          {activeEventTab === 'proveedores' && (
            <TabProveedoresEvento
              onOpenAddProviderDrawer={() => setIsAddProviderOpen(true)}
            />
          )}

          {activeEventTab === 'presupuesto' && (
            <TabPresupuestoEvento
              onSelectCategory={(cat) => setSelectedBudgetCategory(cat)}
              onOpenAddCategory={() => setIsAddBudgetCategoryOpen(true)}
            />
          )}

          {activeEventTab === 'pagos' && (
            <TabPagosEvento
              onOpenRegistrarPago={() => setIsRegistrarPagoOpen(true)}
            />
          )}

          {activeEventTab === 'documentos' && (
            <TabDocumentosEvento
              onOpenSubirDocumento={() => setIsSubirDocumentoOpen(true)}
              onRequestDeleteDoc={(doc) => setDocToDelete(doc)}
            />
          )}

          {activeEventTab === 'tareas' && (
            <TabTareasEvento
              onOpenCrearTarea={() => setIsCrearTareaOpen(true)}
            />
          )}

          {activeEventTab === 'actividad' && (
            <TabActividadEvento onSelectTab={(t) => setActiveEventTab(t)} />
          )}
        </div>
      </main>

      {/* DRAWERS & MODALS */}
      <AgregarProveedorEventoDrawer
        isOpen={isAddProviderOpen}
        onClose={() => setIsAddProviderOpen(false)}
        eventId={currentEvent.id}
      />

      <DetalleCategoriaPresupuestoDrawer
        category={selectedBudgetCategory}
        onClose={() => setSelectedBudgetCategory(null)}
      />

      <AgregarCategoriaPresupuestoDrawer
        isOpen={isAddBudgetCategoryOpen}
        onClose={() => setIsAddBudgetCategoryOpen(false)}
        eventId={currentEvent.id}
      />

      <RegistrarPagoDrawer
        isOpen={isRegistrarPagoOpen}
        onClose={() => setIsRegistrarPagoOpen(false)}
        eventId={currentEvent.id}
      />

      <SubirDocumentoDrawer
        isOpen={isSubirDocumentoOpen}
        onClose={() => setIsSubirDocumentoOpen(false)}
        eventId={currentEvent.id}
      />

      <EliminarDocumentoModal
        isOpen={Boolean(docToDelete)}
        fileName={docToDelete?.fileName || ''}
        onClose={() => setDocToDelete(null)}
        onConfirm={() => {
          if (docToDelete) {
            deleteDocument(docToDelete.id);
            setDocToDelete(null);
          }
        }}
      />

      <CrearTareaDrawer
        isOpen={isCrearTareaOpen}
        onClose={() => setIsCrearTareaOpen(false)}
        eventId={currentEvent.id}
      />

      <EditarEventoModal
        isOpen={isEditarEventoOpen}
        event={currentEvent}
        onClose={() => setIsEditarEventoOpen(false)}
      />
    </div>
  );
}
