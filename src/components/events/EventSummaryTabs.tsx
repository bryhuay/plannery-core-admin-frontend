'use client';

import React, { useState } from 'react';
import { EventItem, EventDetailTab } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';
import { StatusBadge } from '../ui/StatusBadge';

export interface EventSummaryTabProps {
  event: EventItem;
  onSelectTab: (tab: EventDetailTab) => void;
  onOpenEditModal?: () => void;
}

function formatLongDateEs(isoDate: string, fallback: string): string {
  if (!isoDate) return fallback;
  const parts = isoDate.split('-');
  if (parts.length !== 3) return fallback;
  const monthsLong = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const year = parts[0];
  const monthIdx = Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1));
  const day = parseInt(parts[2], 10);
  return `${day} de ${monthsLong[monthIdx]} de ${year}`;
}

function formatTime12h(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

export const EventSummaryTab: React.FC<EventSummaryTabProps> = ({
  event,
  onSelectTab,
  onOpenEditModal,
}) => {
  const { updateEvent, planners } = usePlanery();

  // Inline Edit Mode for General Info Card
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [isChangingPlanner, setIsChangingPlanner] = useState(false);

  // Form states for inline editing
  const [editDate, setEditDate] = useState(event.date);
  const [editStartTime, setEditStartTime] = useState(event.startTime || '17:00');
  const [editEndTime, setEditEndTime] = useState(event.endTime || '03:00');
  const [editLocation, setEditLocation] = useState(event.location);
  const [editVenueDetail, setEditVenueDetail] = useState(
    event.venueDetail || 'Hacienda Los Álamos, Tiabaya, Arequipa'
  );
  const [editSubtitle, setEditSubtitle] = useState(
    event.subtitle || 'Matrimonio Social'
  );
  const [editStatus, setEditStatus] = useState(event.status);
  const [editClient, setEditClient] = useState(event.client);
  const [editClientEmail, setEditClientEmail] = useState(
    event.clientEmail || 'marialopez@email.com'
  );
  const [editClientPhone, setEditClientPhone] = useState(
    event.clientPhone || '+51 987 654 321'
  );
  const [editPlanner, setEditPlanner] = useState(event.planner);

  const handleStartInlineEdit = () => {
    setEditDate(event.date);
    setEditStartTime(event.startTime || '17:00');
    setEditEndTime(event.endTime || '03:00');
    setEditLocation(event.location);
    setEditVenueDetail(
      event.venueDetail || 'Hacienda Los Álamos, Tiabaya, Arequipa'
    );
    setEditSubtitle(event.subtitle || 'Matrimonio Social');
    setEditStatus(event.status);
    setEditClient(event.client);
    setEditClientEmail(event.clientEmail || 'marialopez@email.com');
    setEditClientPhone(event.clientPhone || '+51 987 654 321');
    setEditPlanner(event.planner);
    setIsEditingInline(true);
  };

  const handleSaveInlineEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedPlanner = planners.find(
      (p) => p.name === editPlanner || p.shortName === editPlanner
    );
    const initials = matchedPlanner
      ? matchedPlanner.initials
      : editPlanner
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

    updateEvent(event.id, {
      date: editDate,
      startTime: editStartTime,
      endTime: editEndTime,
      location: editLocation.trim(),
      venueDetail: editVenueDetail.trim(),
      subtitle: editSubtitle.trim(),
      status: editStatus,
      client: editClient.trim(),
      clientEmail: editClientEmail.trim(),
      clientPhone: editClientPhone.trim(),
      planner: matchedPlanner ? matchedPlanner.name : editPlanner,
      plannerInitials: initials,
      plannerRole: matchedPlanner ? matchedPlanner.role : event.plannerRole,
    });
    setIsEditingInline(false);
    setIsChangingPlanner(false);
  };

  const handleQuickPlannerSelect = (plannerName: string) => {
    const matched = planners.find((p) => p.name === plannerName);
    if (!matched) return;
    updateEvent(event.id, {
      planner: matched.name,
      plannerInitials: matched.initials,
      plannerRole: matched.role,
    });
    setIsChangingPlanner(false);
  };

  const paidPercent = Math.round(
    (event.paidAmount / Math.max(1, event.budget)) * 100
  );
  const pendingAmount = Math.max(0, event.budget - event.paidAmount);

  return (
    <div className="space-y-6">
      {/* 3 KPI Cards Financieros */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Presupuesto total
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#e7eefe] flex items-center justify-center text-[#745b00]">
              <span className="material-symbols-outlined text-[20px]">
                account_balance_wallet
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              S/ {event.budget.toLocaleString('es-PE')}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#F2C94C]" />
              Techo financiero acordado
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Monto pagado
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#e7eefe] flex items-center justify-center text-slate-600">
              <span className="material-symbols-outlined text-[20px]">
                verified
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              S/ {event.paidAmount.toLocaleString('es-PE')}
            </div>
            <div className="flex items-center justify-between gap-3 mt-1.5">
              <div className="w-full bg-[#e2e8f8] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-slate-900 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, paidPercent)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap tabular-nums">
                {paidPercent}% del total
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Monto pendiente
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#e7eefe] flex items-center justify-center text-[#745b00]">
              <span className="material-symbols-outlined text-[20px]">
                pending
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              S/ {pendingAmount.toLocaleString('es-PE')}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-600" />
              Saldo pendiente por liquidar en 2 cuotas
            </p>
          </div>
        </div>
      </section>

      {/* Grid Principal 2 Columnas (7 / 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: Información General */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#745b00] text-[20px]">
                  info
                </span>
                <h2 className="text-lg text-slate-900 font-bold">
                  Información general del evento
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingInline ? (
                  <>
                    <button
                      type="button"
                      onClick={handleStartInlineEdit}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-900 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        edit
                      </span>
                      <span>Editar ficha</span>
                    </button>
                    {onOpenEditModal && (
                      <button
                        type="button"
                        onClick={onOpenEditModal}
                        title="Abrir editor completo en modal"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          open_in_new
                        </span>
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-xs font-bold text-[#745b00] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Modo edición activo
                  </span>
                )}
              </div>
            </div>

            {isEditingInline ? (
              <form onSubmit={handleSaveInlineEdit} className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Fecha del evento
                    </label>
                    <input
                      type="date"
                      required
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Hora inicio
                      </label>
                      <input
                        type="time"
                        required
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Hora fin
                      </label>
                      <input
                        type="time"
                        required
                        value={editEndTime}
                        onChange={(e) => setEditEndTime(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Ciudad / Región
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Ubicación y Sede exacta
                    </label>
                    <input
                      type="text"
                      value={editVenueDetail}
                      onChange={(e) => setEditVenueDetail(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Tipo / Subtítulo de evento
                    </label>
                    <input
                      type="text"
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Estado actual
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(e.target.value as EventItem['status'])
                      }
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
                    >
                      <option value="Planificación">Planificación</option>
                      <option value="En progreso">En progreso</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Cliente titular
                      </label>
                      <input
                        type="text"
                        value={editClient}
                        onChange={(e) => setEditClient(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Correo cliente
                      </label>
                      <input
                        type="email"
                        value={editClientEmail}
                        onChange={(e) => setEditClientEmail(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Teléfono cliente
                      </label>
                      <input
                        type="text"
                        value={editClientPhone}
                        onChange={(e) => setEditClientPhone(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Planner asignado
                    </label>
                    <select
                      value={editPlanner}
                      onChange={(e) => setEditPlanner(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-[#FEFBF0] border border-[#F2C94C] text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
                    >
                      {planners.map((pl) => (
                        <option key={pl.id} value={pl.name}>
                          {pl.name} · {pl.role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 w-full">
                  <button
                    type="button"
                    onClick={() => setIsEditingInline(false)}
                    className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-lg bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] text-xs font-bold shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      check
                    </span>
                    <span>Guardar cambios</span>
                  </button>
                </div>
              </form>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Fecha del evento
                  </dt>
                  <dd className="mt-0.5 font-medium text-slate-900">
                    {formatLongDateEs(event.date, event.dateFormatted)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Horario y duración
                  </dt>
                  <dd className="mt-0.5 font-medium text-slate-900">
                    {event.startTime} - {event.endTime}{' '}
                    <span className="text-slate-500 text-xs">
                      (Inicio: {formatTime12h(event.startTime)} | Fin:{' '}
                      {formatTime12h(event.endTime)})
                    </span>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Ubicación y Sede
                  </dt>
                  <dd className="mt-0.5 font-medium text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">
                      pin_drop
                    </span>
                    {event.venueDetail || event.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Tipo de evento
                  </dt>
                  <dd className="mt-0.5 font-medium text-slate-900">
                    {event.subtitle || event.type}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Estado actual
                  </dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F2C94C]" />
                    <span className="font-medium text-slate-900">
                      {event.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      (iniciado hace 12 días)
                    </span>
                  </dd>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Cliente titular
                  </dt>
                  <dd className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">
                      {event.client}
                    </span>
                    <div className="flex items-center gap-4 text-slate-500 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          mail
                        </span>
                        {event.clientEmail || 'marialopez@email.com'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          call
                        </span>
                        {event.clientPhone || '+51 987 654 321'}
                      </span>
                    </div>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Planner asignado
                  </dt>
                  <dd className="mt-1">
                    {!isChangingPlanner ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#e7eefe] text-slate-900 text-[10px] font-bold flex items-center justify-center">
                            {event.plannerInitials}
                          </div>
                          <span className="font-semibold text-slate-900">
                            {event.planner}
                          </span>
                          <span className="text-xs text-slate-500">
                            · {event.plannerRole || 'Coordinador Senior'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsChangingPlanner(true)}
                          className="text-[#745b00] hover:underline text-xs font-semibold cursor-pointer"
                        >
                          Cambiar
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 mt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            Seleccionar nuevo Planner Líder:
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsChangingPlanner(false)}
                            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {planners.map((pl) => {
                            const isCurrent =
                              pl.name === event.planner ||
                              pl.shortName === event.planner;
                            return (
                              <button
                                key={pl.id}
                                type="button"
                                onClick={() =>
                                  handleQuickPlannerSelect(pl.name)
                                }
                                className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#FEFBF0] border-[#F2C94C] ring-1 ring-[#F2C94C]'
                                    : 'bg-white border-slate-200 hover:border-slate-400'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-7 h-7 rounded-full bg-[#e7eefe] text-slate-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {pl.initials}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">
                                      {pl.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                      {pl.role}
                                    </div>
                                  </div>
                                </div>
                                {isCurrent && (
                                  <span className="material-symbols-outlined text-[16px] text-[#745B00] shrink-0">
                                    check_circle
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </dd>
                </div>
              </dl>
            )}
          </section>

          {/* Card 2: Proveedores asociados */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#745b00] text-[20px]">
                  storefront
                </span>
                <h2 className="text-lg text-slate-900 font-bold">
                  Proveedores
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('proveedores')}
                className="text-xs font-bold text-[#745b00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver proveedores</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 text-sm">
              {[
                {
                  name: 'Catering Gourmet Del Sur',
                  sub: 'Servicio de Catering y Banquete',
                  icon: 'restaurant',
                  status: 'Confirmado',
                },
                {
                  name: 'Lumina Studio / Visual Studio',
                  sub: 'Fotografía y Video Cinematic',
                  icon: 'photo_camera',
                  status: 'Pendiente',
                },
                {
                  name: 'Flores & Estilo',
                  sub: 'Decoración floral y centros de mesa',
                  icon: 'local_florist',
                  status: 'Confirmado',
                },
                {
                  name: 'Sonido Acústica Pro',
                  sub: 'DJ, Iluminación inteligente y Sonido',
                  icon: 'volume_up',
                  status: 'En evaluación',
                },
              ].map((pr, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectTab('proveedores')}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-50/60 rounded-lg px-1 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#e7eefe] flex items-center justify-center text-slate-600">
                      <span className="material-symbols-outlined text-[20px]">
                        {pr.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 leading-tight">
                        {pr.name}
                      </h4>
                      <p className="text-xs text-slate-500">{pr.sub}</p>
                    </div>
                  </div>
                  <StatusBadge status={pr.status} size="xs" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Columna Derecha (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 3: Próximas tareas */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#745b00] text-[20px]">
                  task_alt
                </span>
                <h2 className="text-lg text-slate-900 font-bold">
                  Próximas tareas
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('tareas')}
                className="text-xs font-bold text-[#745b00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  title: 'Confirmar menú de degustación con catering',
                  status: 'Pendiente',
                  owner: 'Jerson H.',
                  date: '15 Nov 2026',
                  urgent: true,
                },
                {
                  title: 'Aprobar contrato fotográfico',
                  status: 'En revisión',
                  owner: 'Carlos M.',
                  date: '20 Nov 2026',
                  urgent: false,
                },
                {
                  title: 'Revisión de paleta floral con el cliente',
                  status: 'Pendiente',
                  owner: 'Jerson H.',
                  date: '25 Nov 2026',
                  urgent: false,
                },
              ].map((t, i) => (
                <div
                  key={i}
                  onClick={() => onSelectTab('tareas')}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-[#f0f3ff]/50 flex flex-col gap-1.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      {t.title}
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-[#F2C94C]/25 text-[#6b5400] text-[10px] font-semibold shrink-0">
                      {t.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        person
                      </span>
                      {t.owner}
                    </span>
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        t.urgent ? 'text-rose-600' : 'text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {t.urgent ? 'alarm' : 'event'}
                      </span>
                      {t.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Card 4: Actividad reciente */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#745b00] text-[20px]">
                  history
                </span>
                <h2 className="text-lg text-slate-900 font-bold">
                  Actividad reciente
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('actividad')}
                className="text-xs font-bold text-[#745b00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver actividad</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="relative pl-6 flex flex-col gap-4">
              <div className="absolute left-2.5 top-2 bottom-2 w-[1px] bg-slate-200" />
              {[
                {
                  title: 'Pago de adelanto registrado (S/ 18,000)',
                  meta: 'por Carlos Mendoza · hace 2 horas',
                  active: true,
                },
                {
                  title: 'Proveedor Flores & Estilo confirmado',
                  meta: 'por Jerson Huayta · ayer',
                  active: false,
                },
                {
                  title: 'Contrato preliminar de locación subido',
                  meta: 'por Jerson Huayta · hace 3 días',
                  active: false,
                },
                {
                  title: 'Evento creado en estado Planificación',
                  meta: 'por Sistema · hace 12 días',
                  active: false,
                },
              ].map((act, idx) => (
                <div key={idx} className="relative flex flex-col gap-0.5">
                  <div
                    className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                      act.active ? 'bg-[#F2C94C]' : 'bg-slate-400'
                    }`}
                  />
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {act.title}
                  </p>
                  <p className="text-xs text-slate-500">{act.meta}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export interface EventProvidersTabProps {
  onOpenAddProviderDrawer: () => void;
}

export const EventProvidersTab: React.FC<EventProvidersTabProps> = ({
  onOpenAddProviderDrawer,
}) => {
  const {
    eventProviders,
    removeProviderFromEvent,
    updateEventProviderStatus,
  } = usePlanery();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas las categorías');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [openMenuId, setOpenMenuId] = useState<string | null>('EPR-02');

  const filtered = eventProviders.filter((item) => {
    const matchSearch =
      !searchQuery.trim() ||
      item.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      categoryFilter === 'Todas las categorías' ||
      item.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchStatus =
      statusFilter === 'Todos los estados' ||
      item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchCategory && matchStatus;
  });

  const totalCommitted = filtered.reduce((acc, r) => acc + r.budget, 0);

  return (
    <div className="space-y-6" onClick={() => setOpenMenuId(null)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Proveedores</h2>
            <span className="bg-[#e2e8f8] text-slate-900 font-semibold text-xs px-2.5 py-1 rounded-full">
              {eventProviders.length} proveedores vinculados
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Gestiona los proveedores y servicios asociados a este evento.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddProviderDrawer}
          className="inline-flex items-center gap-2 bg-[#F2C94C] hover:bg-[#ebc246] active:scale-[0.98] text-slate-950 font-bold text-sm px-5 py-2.5 rounded-lg shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Agregar proveedor</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined text-[19px]">
                search
              </span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar proveedor por nombre o servicio..."
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:bg-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#F2C94C]"
          >
            <option>Todas las categorías</option>
            <option>Catering</option>
            <option>Fotografía</option>
            <option>Decoración</option>
            <option>Música</option>
            <option>Transporte</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#F2C94C]"
          >
            <option>Todos los estados</option>
            <option>Propuesto</option>
            <option>En evaluación</option>
            <option>Seleccionado</option>
            <option>Confirmado</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            setCategoryFilter('Todas las categorías');
            setStatusFilter('Todos los estados');
          }}
          title="Limpiar filtros"
          className="self-end sm:self-center p-1.5 text-slate-400 hover:text-slate-700 border border-[#E5E7EB] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
        </button>
      </div>

      {/* Tabla de Proveedores del Evento */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-visible">
        <div className="w-full overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Proveedor</th>
                <th className="hidden md:table-cell py-3.5 px-4">Categoría</th>
                <th className="hidden md:table-cell py-3.5 px-4">Servicio</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Presupuesto</th>
                <th className="hidden md:table-cell py-3.5 px-4">Estado de Pago</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {filtered.map((item) => {
                const isMenuOpen = openMenuId === item.id;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold shrink-0 ${item.iconBg}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {item.icon}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {item.providerName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="material-symbols-outlined text-[13px] text-slate-400">
                              mail
                            </span>
                            <span>{item.email}</span>
                            <span className="text-slate-300">•</span>
                            <span>{item.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-4 px-4 max-w-[220px]">
                      <span className="text-slate-800 font-medium block truncate">
                        {item.serviceDescription}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.serviceSubtext}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={item.status} size="xs" />
                    </td>
                    <td className="py-4 px-4 tabular-nums">
                      {item.budget > 0 ? (
                        <>
                          <div className="font-semibold text-slate-900 text-sm">
                            S/{' '}
                            {item.budget.toLocaleString('es-PE', {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {item.budgetNote}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-slate-400 italic">
                            Sin presupuesto
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            Esperando cotización
                          </span>
                        </>
                      )}
                    </td>
                    <td className="hidden md:table-cell py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                          item.paymentStatus === 'Pagado'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td
                      className="py-4 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(isMenuOpen ? null : item.id)
                          }
                          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            more_vert
                          </span>
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 text-left text-xs z-40">
                            <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                              Opciones
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                updateEventProviderStatus(
                                  item.id,
                                  'Confirmado'
                                );
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                                check_circle
                              </span>
                              <span>Marcar Confirmado</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateEventProviderStatus(
                                  item.id,
                                  'En evaluación'
                                );
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px] text-slate-400">
                                sync_alt
                              </span>
                              <span>Cambiar a Evaluación</span>
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              type="button"
                              onClick={() => {
                                removeProviderFromEvent(item.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px] text-rose-500">
                                delete
                              </span>
                              <span>Eliminar del evento</span>
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

        {/* Footer Summary */}
        <div className="bg-[#f0f3ff] px-6 py-3.5 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400">Total proveedores:</span>
              <span className="font-bold text-slate-900 ml-1">
                {filtered.length}
              </span>
            </div>
            <div className="h-3.5 w-px bg-slate-300" />
            <div>
              <span className="text-slate-400">Confirmados:</span>
              <span className="font-semibold text-emerald-700 ml-1">
                {filtered.filter((f) => f.status === 'Confirmado').length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              Presupuesto total comprometido:
            </span>
            <span className="font-bold text-slate-950 text-sm bg-white px-3 py-1 rounded-lg border border-[#E5E7EB] shadow-xs tabular-nums">
              S/{' '}
              {totalCommitted.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Guidance Card */}
      <div className="bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20 border border-amber-200/50 rounded-xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f2c94c]/20 text-[#6b5400] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">
              lightbulb
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Consejo de gestión de proveedores
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Recuerda solicitar el contrato firmado y comprobante tributario
              antes de marcar un proveedor como{' '}
              <strong className="text-slate-800">Confirmado</strong>. Esto
              habilitará la generación automática de calendarios de pago.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAddProviderDrawer}
          className="text-xs font-semibold text-slate-900 hover:text-amber-800 underline underline-offset-4 shrink-0 cursor-pointer"
        >
          Vincular nuevo proveedor →
        </button>
      </div>
    </div>
  );
};
