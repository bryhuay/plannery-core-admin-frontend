'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '../lib/navigation';
import { usePlanery } from '../context/PlaneryContext';
import { CreateTaskDrawer } from '../components/modals/CreateTaskDrawer';

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = usePlanery();
  const [quarterFilter, setQuarterFilter] = useState('Este trimestre');
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

  const [dashboardTasks, setDashboardTasks] = useState([
    {
      id: 'dt-1',
      title: 'Confirmar catering para Gala',
      event: 'Evento: Gala Corporativa Anual',
      initials: 'SR',
      badge: 'Mañana',
      badgeStyle: 'bg-[#ffdad6] text-[#93000a]',
      completed: false,
    },
    {
      id: 'dt-2',
      title: 'Revisión técnica de audio y video',
      event: 'Evento: Cumbre Global de Innovación',
      initials: 'CM',
      badge: 'En 3 días',
      badgeStyle: 'bg-[#e7eefe] text-[#575e70]',
      completed: false,
    },
    {
      id: 'dt-3',
      title: 'Firma de contrato de venue',
      event: 'Evento: Lanzamiento Tech Summit',
      initials: 'ML',
      badge: '24 Nov',
      badgeStyle: 'bg-[#e7eefe] text-[#575e70]',
      completed: false,
    },
  ]);

  const toggleDashboardTask = (id: string) => {
    setDashboardTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    showToast('Estado de tarea rápida actualizado.');
  };

  const upcomingDashboardEvents = [
    {
      id: 'EV-2025-085',
      name: 'Cumbre Global de Innovación 2025',
      subtitle: 'Congreso Tecnológico',
      date: '18 Nov 2024',
      venue: 'Centro de Convenciones Norte',
      plannerInitials: 'SR',
      plannerName: 'Sofía R.',
      status: 'En Progreso',
      statusStyle: 'bg-[#f2c94c]/40 text-[#6b5400]',
    },
    {
      id: 'EV-2024-081',
      name: 'Gala Corporativa Anual',
      subtitle: 'Cena & Premiaciones',
      date: '02 Dic 2024',
      venue: 'Hotel Alvear Palace',
      plannerInitials: 'ML',
      plannerName: 'Martín L.',
      status: 'Confirmado',
      statusStyle: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'EV-2026-084',
      name: 'Boda de María y Carlos',
      subtitle: 'Matrimonio Social · EV-084',
      date: '18 Nov 2026',
      venue: 'Hacienda Los Álamos, Arequipa',
      plannerInitials: 'JH',
      plannerName: 'Jerson H.',
      status: 'Planificación',
      statusStyle: 'bg-[#e7eefe] text-[#575e70]',
    },
  ];

  return (
    <div className="pb-16">
      {/* Canvas Header Greeting */}
      <section className="px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-1">
              <span>Inicio</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900 font-semibold">Dashboard</span>
            </div>
            <h1 className="text-[32px] leading-[40px] font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Buenos días, Carlos Mendoza — Aquí tienes un resumen de la
              actividad de tus eventos corporativos.
            </p>
          </div>

          {/* Date Range Filter & Quick Export */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                const next =
                  quarterFilter === 'Este trimestre'
                    ? 'Este mes'
                    : 'Este trimestre';
                setQuarterFilter(next);
                showToast(`Periodo actualizado a: ${next}`);
              }}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-900 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">
                date_range
              </span>
              <span>{quarterFilter}</span>
              <span className="material-symbols-outlined text-[16px] text-slate-500">
                expand_more
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                showToast('Exportando reporte ejecutivo Q4 en formato PDF/XLSX...')
              }
              title="Exportar reporte"
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-900 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">
                file_download
              </span>
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="px-6 lg:px-8 flex flex-col gap-8">
        {/* SECCIÓN 1: KPI CARDS (Executive Precision Grid) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* KPI 1 */}
          <div
            onClick={() => router.push('/eventos')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Eventos activos
              </span>
              <div className="p-2 rounded-lg bg-[#f2c94c]/20 text-[#6b5400] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  celebration
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                12
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#f2c94c]/30 text-[#6b5400] px-2.5 py-0.5 rounded-full">
                +2 este mes
              </span>
            </div>
          </div>

          {/* KPI 2 */}
          <div
            onClick={() => router.push('/calendario')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Próximos eventos
              </span>
              <div className="p-2 rounded-lg bg-[#e7eefe] text-[#555f6f] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  calendar_month
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                5
              </span>
              <span className="text-xs text-slate-500">
                En los próximos 30 días
              </span>
            </div>
          </div>

          {/* KPI 3 */}
          <div
            onClick={() => router.push('/pagos')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pagos pendientes
              </span>
              <div className="p-2 rounded-lg bg-[#e7eefe] text-[#555f6f] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  pending_actions
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                $18,450
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#e7eefe] text-slate-600 px-2.5 py-0.5 rounded-full">
                3 facturas
              </span>
            </div>
          </div>

          {/* KPI 4 */}
          <div
            onClick={() => router.push('/proveedores')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Proveedores activos
              </span>
              <div className="p-2 rounded-lg bg-[#e7eefe] text-[#555f6f] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  store
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                34
              </span>
              <span className="text-xs text-emerald-700 font-semibold">
                98% confirmados
              </span>
            </div>
          </div>
        </section>

        {/* 2-COLUMN MAIN CONTENT (2/3 Left & 1/3 Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* COLUMNA IZQUIERDA (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* SECCIÓN 2: "Próximos eventos" */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#F2C94C] text-[22px]">
                    event_available
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Próximos eventos
                  </h2>
                </div>
                <Link
                  href="/eventos"
                  className="text-xs text-slate-900 font-semibold hover:text-[#745b00] transition-colors flex items-center gap-1"
                >
                  <span>Ver todos</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f0f3ff]/70 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4 sm:px-6">Evento</th>
                      <th className="py-3 px-4">Fecha y Lugar</th>
                      <th className="hidden md:table-cell py-3 px-4">Planner</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-900">
                    {upcomingDashboardEvents.map((ev) => (
                      <tr
                        key={ev.id}
                        onClick={() => router.push(`/eventos/${ev.id}`)}
                        className="hover:bg-[#f0f3ff]/50 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4 sm:px-6 font-medium">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 hover:text-[#745b00] transition-colors">
                              {ev.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {ev.subtitle}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {ev.date}
                            </span>
                            <span className="text-xs text-slate-500">
                              {ev.venue}
                            </span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#e2e8f8] flex items-center justify-center text-xs font-bold text-slate-900">
                              {ev.plannerInitials}
                            </div>
                            <span className="text-xs text-slate-900 font-medium">
                              {ev.plannerName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${ev.statusStyle}`}
                          >
                            {ev.status}
                          </span>
                        </td>
                        <td
                          className="py-4 px-4 sm:px-6 text-right"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/eventos/${ev.id}`);
                          }}
                        >
                          <button
                            type="button"
                            title="Abrir detalle del evento"
                            className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECCIÓN 4: "Próximas tareas" (Planning Action List) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#F2C94C] text-[22px]">
                    checklist
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Próximas tareas
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTaskDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#f0f3ff] hover:bg-[#e7eefe] border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                  <span>Añadir tarea</span>
                </button>
              </div>

              <div className="p-5 sm:p-6 flex flex-col gap-3">
                {dashboardTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleDashboardTask(task.id)}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-all gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-[#F2C94C] border-slate-300 focus:ring-[#F2C94C]"
                      />
                      <div className="flex flex-col min-w-0">
                        <span
                          className={`text-sm font-semibold truncate ${
                            task.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-xs text-slate-500">
                          {task.event}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-6 h-6 rounded-full bg-[#d9dff5] text-[#141b2b] text-[11px] font-bold flex items-center justify-center">
                        {task.initials}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${task.badgeStyle}`}
                      >
                        {task.completed ? 'Completada' : task.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (1/3) */}
          <div className="flex flex-col gap-8">
            {/* SECCIÓN 5: "Resumen financiero" */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#F2C94C] text-[20px]">
                    account_balance_wallet
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Resumen financiero
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Q4 2024
                </span>
              </div>

              {/* Total Budget Callout */}
              <div className="bg-[#f0f3ff] p-4 rounded-xl flex flex-col gap-1">
                <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  Presupuesto Asignado
                </span>
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  $142,500
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-600">
                    Salud presupuestaria: Óptima (+8% margen)
                  </span>
                </div>
              </div>

              {/* Progress Bar Stack */}
              <div className="flex flex-col gap-2 tabular-nums">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Monto pagado (62%)
                  </span>
                  <span className="text-slate-900 font-bold">$88,200</span>
                </div>
                <div className="w-full bg-[#e2e8f8] h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#F2C94C] h-full rounded-full"
                    style={{ width: '62%' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Pendiente por liquidar</span>
                  <span className="text-slate-900 font-semibold">$54,300</span>
                </div>
              </div>

              {/* Breakdown rows */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-xs tabular-nums">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Depósitos a venues</span>
                  <span className="font-semibold text-slate-900">$52,000</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Catering & Logística</span>
                  <span className="font-semibold text-slate-900">$24,200</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Audiovisual & Técnica</span>
                  <span className="font-semibold text-slate-900">$12,000</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: "Actividad reciente" (Timeline/Activity Card) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#F2C94C] text-[20px]">
                    history
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Actividad reciente
                  </h3>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  stream
                </span>
              </div>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#F2C94C] ring-4 ring-white" />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-semibold text-sm">
                      Nuevo evento creado: Foro de Líderes 2025
                    </span>
                    <span className="text-slate-500">
                      Por Sofía R. • hace 2 horas
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-semibold text-sm">
                      Proveedor confirmado: Sonido Pro Live
                    </span>
                    <span className="text-slate-500">
                      Por Carlos M. • hace 4 horas
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-semibold text-sm">
                      Pago registrado: Factura #1042 ($4,200)
                    </span>
                    <span className="text-slate-500">
                      Por Finanzas • hace 1 día
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-semibold text-sm">
                      Documento cargado: Contrato de Venue.pdf
                    </span>
                    <span className="text-slate-500">
                      Por Planner Lead • hace 1 día
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-semibold text-sm">
                      Tarea completada: Envío de invitaciones VIP
                    </span>
                    <span className="text-slate-500">
                      Completado por equipo • hace 2 días
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CreateTaskDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        eventId="EV-2026-084"
      />
    </div>
  );
}
