'use client';

import React, { useState, useRef } from 'react';
import {
  EventItem,
  EventDetailTab,
  QuotationAttachment,
  EventProviderRelation,
  StrictProviderStatus,
  QuotationExtraFile,
  getNextAllowedStatuses,
  isTerminalStatus,
  normalizeProviderStatus,
} from '../../types/planery';
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

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const EventProvidersTab: React.FC<EventProvidersTabProps> = ({
  onOpenAddProviderDrawer,
}) => {
  const {
    eventProviders,
    removeProviderFromEvent,
    updateEventProviderRelation,
    updateEventProviderStatus,
    addExtraFileToQuotation,
    removeExtraFileFromQuotation,
    uploadDocument,
    showToast,
  } = usePlanery();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas las categorías');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Active quotation relation for modal
  const [activeRelationId, setActiveRelationId] = useState<string | null>(null);
  const [isEditingModal, setIsEditingModal] = useState(false);

  // Modal edit form states
  const [editBudget, setEditBudget] = useState('');
  const [editQuotationNumber, setEditQuotationNumber] = useState('');
  const [editStatus, setEditStatus] = useState<StrictProviderStatus>('PROPUESTO');
  const [editNotes, setEditNotes] = useState('');
  const [editFile, setEditFile] = useState<QuotationAttachment | null>(null);
  const [isDraggingModalFile, setIsDraggingModalFile] = useState(false);

  // Extra files form states
  const [isAddingExtraFile, setIsAddingExtraFile] = useState(false);
  const [newExtraFileName, setNewExtraFileName] = useState('');
  const [newExtraFileType, setNewExtraFileType] = useState<string>('Contrato');
  const [newExtraFileNotes, setNewExtraFileNotes] = useState('');
  const [newExtraFileAttachment, setNewExtraFileAttachment] = useState<QuotationAttachment | null>(null);

  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const extraFileInputRef = useRef<HTMLInputElement>(null);

  // Find currently active relation
  const activeRelation =
    eventProviders.find((p) => p.id === activeRelationId) || null;

  const openQuotationModal = (relation: EventProviderRelation, startInEditMode = false) => {
    setActiveRelationId(relation.id);
    setIsEditingModal(startInEditMode);
    setEditBudget(relation.budget > 0 ? relation.budget.toString() : '');
    setEditQuotationNumber(relation.quotationNumber || '');
    setEditStatus(normalizeProviderStatus(relation.status));
    setEditNotes(relation.internalNotes || relation.serviceSubtext || '');
    setEditFile(relation.quotationFile || null);
    setIsAddingExtraFile(false);
    setNewExtraFileName('');
    setNewExtraFileType('Contrato');
    setNewExtraFileNotes('');
    setNewExtraFileAttachment(null);
  };

  const closeQuotationModal = () => {
    setActiveRelationId(null);
    setIsEditingModal(false);
    setIsAddingExtraFile(false);
  };

  // Filtering
  const filtered = eventProviders.filter((item) => {
    const serviceName = item.serviceName || item.category;
    const matchSearch =
      !searchQuery.trim() ||
      item.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.quotationNumber &&
        item.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.serviceSubtext &&
        item.serviceSubtext.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory =
      categoryFilter === 'Todas las categorías' ||
      item.category.toLowerCase() === categoryFilter.toLowerCase() ||
      serviceName.toLowerCase() === categoryFilter.toLowerCase();

    const normalizedStatus = normalizeProviderStatus(item.status);
    const matchStatus =
      statusFilter === 'Todos los estados' ||
      normalizedStatus === statusFilter ||
      item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchCategory && matchStatus;
  });

  const totalCommitted = filtered.reduce((acc, r) => acc + r.budget, 0);

  // File upload for modal edit
  const handleModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processModalFile(file);
    }
  };

  const processModalFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDoc =
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.xls') ||
      file.name.toLowerCase().endsWith('.xlsx');

    const formattedSize = formatBytes(file.size);
    const todayFormatted = new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        setEditFile({
          name: file.name,
          size: formattedSize,
          type: 'image',
          dataUrl: uploadEvt.target?.result as string,
          uploadDate: todayFormatted,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setEditFile({
        name: file.name,
        size: formattedSize,
        type: isPdf ? 'pdf' : isDoc ? 'doc' : 'document',
        uploadDate: todayFormatted,
      });
    }

    if (!editQuotationNumber) {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      setEditQuotationNumber(`COT-${new Date().getFullYear()}-${randomCode}`);
    }
  };

  // Extra file attachment processing
  const handleExtraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isDoc =
        file.name.toLowerCase().endsWith('.doc') ||
        file.name.toLowerCase().endsWith('.docx') ||
        file.name.toLowerCase().endsWith('.xls') ||
        file.name.toLowerCase().endsWith('.xlsx');

      const formattedSize = formatBytes(file.size);
      const todayFormatted = new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date());

      setNewExtraFileName(file.name);
      setNewExtraFileAttachment({
        name: file.name,
        size: formattedSize,
        type: isPdf ? 'pdf' : isImage ? 'image' : isDoc ? 'doc' : 'document',
        uploadDate: todayFormatted,
      });
    }
  };

  // Submit edit form inside modal
  const handleSaveModalEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRelation) return;

    const numericBudget = parseFloat(editBudget.replace(/,/g, '')) || 0;

    updateEventProviderRelation(activeRelation.id, {
      budget: numericBudget,
      quotationNumber: editQuotationNumber.trim() || undefined,
      status: editStatus,
      quotationFile: editFile || undefined,
      internalNotes: editNotes.trim(),
      serviceSubtext: editNotes.trim() || activeRelation.serviceSubtext,
      budgetNote: editFile
        ? `Cotización: ${editQuotationNumber}`
        : editStatus === 'CONFIRMADO'
        ? 'Contrato firmado'
        : 'En evaluación',
    });

    // If new quotation file was uploaded, sync to Documents repository
    if (editFile && editFile.name !== activeRelation.quotationFile?.name) {
      uploadDocument({
        eventId: activeRelation.eventId,
        fileName: editFile.name,
        fileSize: editFile.size || '1.8 MB',
        fileFormat: editFile.type === 'image' ? 'PNG' : 'PDF',
        type: 'Cotización',
        category: activeRelation.category,
        relatedTo: activeRelation.providerName,
        relatedSubtext: `Cotización actualizada (${activeRelation.serviceName || activeRelation.category})`,
        uploadDate: editFile.uploadDate || 'Hoy',
        uploadedBy: 'Planner Líder',
        verified: true,
        icon: editFile.type === 'image' ? 'image' : 'description',
        iconBg: 'bg-amber-50 text-amber-900 border-amber-200',
        description: `Cotización actualizada ${editQuotationNumber} para ${activeRelation.providerName}.`,
      });
    }

    setIsEditingModal(false);
  };

  // Submit new extra file
  const handleSaveExtraFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRelation) return;

    if (!newExtraFileName.trim()) {
      showToast('Por favor ingresa un nombre para el archivo secundario.', 'warning');
      return;
    }

    const todayFormatted = new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());

    const createdExtra: Omit<QuotationExtraFile, 'id'> = {
      name: newExtraFileName.trim(),
      size: newExtraFileAttachment?.size || '1.2 MB',
      type: newExtraFileType,
      fileFormat: newExtraFileAttachment?.type || 'PDF',
      uploadDate: todayFormatted,
      uploadedBy: 'Planner Líder',
      notes: newExtraFileNotes.trim(),
    };

    addExtraFileToQuotation(activeRelation.id, createdExtra);

    // Also register in Event Documents tab
    uploadDocument({
      eventId: activeRelation.eventId,
      fileName: createdExtra.name,
      fileSize: createdExtra.size,
      fileFormat: 'PDF',
      type:
        newExtraFileType === 'Contrato'
          ? 'Contrato'
          : newExtraFileType === 'Plano técnico'
          ? 'Técnico / Plano'
          : 'Otro',
      category: activeRelation.category,
      relatedTo: activeRelation.providerName,
      relatedSubtext: `Archivo complementario de cotización (${activeRelation.serviceName || activeRelation.category})`,
      uploadDate: todayFormatted,
      uploadedBy: 'Planner Líder',
      verified: true,
      icon: newExtraFileType === 'Plano técnico' ? 'architecture' : 'description',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      description: newExtraFileNotes || `Archivo complementario de tipo ${newExtraFileType}.`,
    });

    setIsAddingExtraFile(false);
    setNewExtraFileName('');
    setNewExtraFileNotes('');
    setNewExtraFileAttachment(null);
  };

  return (
    <div className="space-y-6" onClick={() => setOpenMenuId(null)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Proveedores</h2>
            <span className="bg-[#e2e8f8] text-slate-900 font-semibold text-xs px-2.5 py-1 rounded-full">
              {eventProviders.length} servicios contratados
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Gestiona los proveedores, cotizaciones por servicio independiente y documentos complementarios del evento.
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
              <span className="material-symbols-outlined text-[19px]">search</span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por proveedor, servicio contratado o cotización..."
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
            <option>Música & Sonido</option>
            <option>Audio e Iluminación</option>
            <option>Transporte</option>
            <option>Venue / Locación</option>
            <option>Seguridad</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-xs bg-slate-50/70 border border-[#E5E7EB] rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#F2C94C]"
          >
            <option>Todos los estados</option>
            <option value="PROPUESTO">PROPUESTO</option>
            <option value="SELECCIONADO">SELECCIONADO</option>
            <option value="CONFIRMADO">CONFIRMADO</option>
            <option value="RECHAZADO">RECHAZADO</option>
            <option value="CANCELADO">CANCELADO</option>
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

      {/* Tabla de Proveedores del Evento (Filas independientes por servicio y cotización) */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-visible">
        <div className="w-full overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Proveedor</th>
                <th className="hidden md:table-cell py-3.5 px-4 min-w-[210px]">
                  Servicio contratado
                </th>
                <th className="hidden lg:table-cell py-3.5 px-4 min-w-[210px]">
                  Cotización & Adjuntos
                </th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Presupuesto</th>
                <th className="hidden md:table-cell py-3.5 px-4">Estado de Pago</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">
                      storefront
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      No se encontraron servicios contratados
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Prueba ajustando los filtros o vincula un nuevo proveedor al evento.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isMenuOpen = openMenuId === item.id;
                  const siblingServices = eventProviders.filter(
                    (p) => p.providerId === item.providerId
                  );
                  const hasSiblings = siblingServices.length > 1;
                  const serviceIndex =
                    siblingServices.findIndex((s) => s.id === item.id) + 1;
                  const normStatus = normalizeProviderStatus(item.status);
                  const allowedTransitions = getNextAllowedStatuses(normStatus);
                  const isTerminal = isTerminalStatus(normStatus);
                  const extraFilesCount = item.extraFiles?.length || 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Proveedor */}
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
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-sm">
                                {item.providerName}
                              </span>
                              {hasSiblings && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#e7eefe] text-[#141b2b] border border-blue-200">
                                  Servicio {serviceIndex} de {siblingServices.length}
                                </span>
                              )}
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

                      {/* Servicio Contratado (Fila individual para este servicio) */}
                      <td className="hidden md:table-cell py-4 px-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#FEF9E7] text-[#745B00] border border-[#F2C94C]/60">
                            <span className="material-symbols-outlined text-[14px]">
                              {item.icon}
                            </span>
                            <span>{item.serviceName || item.category}</span>
                          </span>
                          {item.serviceSubtext && (
                            <p className="text-[11px] text-slate-500 leading-tight max-w-xs line-clamp-2">
                              {item.serviceSubtext}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Cotización & Adjuntos */}
                      <td className="hidden lg:table-cell py-4 px-4">
                        {item.quotationFile ? (
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => openQuotationModal(item, false)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer group text-left"
                            >
                              <span className="material-symbols-outlined text-[17px] text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                                {item.quotationFile.type === 'image'
                                  ? 'image'
                                  : 'picture_as_pdf'}
                              </span>
                              <span className="truncate max-w-[155px]">
                                {item.quotationFile.name}
                              </span>
                            </button>

                            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                              {item.quotationNumber && (
                                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                  {item.quotationNumber}
                                </span>
                              )}
                              {item.quotationFile.size && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span>{item.quotationFile.size}</span>
                                </>
                              )}
                              {extraFilesCount > 0 && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                  <span className="material-symbols-outlined text-[11px]">
                                    attach_file
                                  </span>
                                  <span>+{extraFilesCount} extra{extraFilesCount > 1 ? 's' : ''}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openQuotationModal(item, true)}
                            className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-semibold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 hover:bg-amber-100/60 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              upload_file
                            </span>
                            <span>Adjuntar cotización</span>
                          </button>
                        )}
                      </td>

                      {/* Estado con Restricción Estricta */}
                      <td className="py-4 px-4">
                        <StatusBadge status={normStatus} size="xs" />
                      </td>

                      {/* Presupuesto */}
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

                      {/* Estado de Pago */}
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

                      {/* Acciones */}
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
                            <div className="absolute right-0 mt-1 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 text-left text-xs z-40">
                              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Opciones del servicio
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  openQuotationModal(item, false);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px] text-blue-600">
                                  visibility
                                </span>
                                <span>Ver / Editar cotización</span>
                              </button>

                              {/* Transiciones de Estado Estrictas Permitidas */}
                              {allowedTransitions.length > 0 ? (
                                <>
                                  <div className="my-1 border-t border-slate-100" />
                                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                    Transición permitida
                                  </div>
                                  {allowedTransitions.map((nextStatus) => (
                                    <button
                                      key={nextStatus}
                                      type="button"
                                      onClick={() => {
                                        updateEventProviderStatus(item.id, nextStatus);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                                    >
                                      <span
                                        className={`material-symbols-outlined text-[16px] ${
                                          nextStatus === 'CONFIRMADO'
                                            ? 'text-emerald-600'
                                            : nextStatus === 'SELECCIONADO'
                                            ? 'text-sky-600'
                                            : nextStatus === 'RECHAZADO'
                                            ? 'text-rose-600'
                                            : 'text-slate-600'
                                        }`}
                                      >
                                        {nextStatus === 'CONFIRMADO'
                                          ? 'check_circle'
                                          : nextStatus === 'SELECCIONADO'
                                          ? 'task_alt'
                                          : nextStatus === 'RECHAZADO'
                                          ? 'cancel'
                                          : 'block'}
                                      </span>
                                      <span>Pasar a {nextStatus}</span>
                                    </button>
                                  ))}
                                </>
                              ) : isTerminal ? (
                                <div className="px-3 py-1.5 text-[11px] text-slate-400 italic">
                                  Estado final ({normStatus})
                                </div>
                              ) : null}

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
                                <span>Desvincular servicio</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="bg-[#f0f3ff] px-6 py-3.5 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <span className="text-slate-400">Total servicios en el evento:</span>
              <span className="font-bold text-slate-900 ml-1">
                {filtered.length}
              </span>
            </div>
            <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
            <div>
              <span className="text-slate-400">Confirmados:</span>
              <span className="font-semibold text-emerald-700 ml-1">
                {
                  filtered.filter(
                    (f) => normalizeProviderStatus(f.status) === 'CONFIRMADO'
                  ).length
                }
              </span>
            </div>
            <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
            <div>
              <span className="text-slate-400">Con cotización adjunta:</span>
              <span className="font-semibold text-blue-700 ml-1">
                {filtered.filter((f) => Boolean(f.quotationFile)).length}
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
              Gestión individual de cotizaciones y archivos extras
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Cada servicio contratado de un proveedor cuenta con su cotización, presupuesto y estado independiente. Al abrir la cotización puedes editar sus condiciones y cargar contratos, planos técnicos de montaje o adendas secundarias.
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

      {/* MODAL COMPLETO DE COTIZACIÓN (VISUALIZACIÓN, EDICIÓN Y ARCHIVOS EXTRAS) */}
      {activeRelation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={closeQuotationModal}
          />

          {/* Hidden file input for replacing quote file in edit mode */}
          <input
            type="file"
            ref={modalFileInputRef}
            onChange={handleModalFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx"
            className="hidden"
          />

          {/* Hidden file input for uploading secondary/extra file */}
          <input
            type="file"
            ref={extraFileInputRef}
            onChange={handleExtraFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.dwg"
            className="hidden"
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${activeRelation.iconBg}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {activeRelation.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      Cotización · {activeRelation.serviceName || activeRelation.category}
                    </h3>
                    <StatusBadge
                      status={normalizeProviderStatus(activeRelation.status)}
                      size="xs"
                    />
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    Proveedor: <strong className="text-slate-800">{activeRelation.providerName}</strong>
                    {activeRelation.quotationNumber && (
                      <span className="ml-2 font-mono text-[11px] bg-slate-200/80 px-1.5 py-0.2 rounded text-slate-700">
                        {activeRelation.quotationNumber}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!isEditingModal ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingModal(true);
                      setEditBudget(activeRelation.budget > 0 ? activeRelation.budget.toString() : '');
                      setEditQuotationNumber(activeRelation.quotationNumber || '');
                      setEditStatus(normalizeProviderStatus(activeRelation.status));
                      setEditNotes(activeRelation.internalNotes || activeRelation.serviceSubtext || '');
                      setEditFile(activeRelation.quotationFile || null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-800 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-700">
                      edit
                    </span>
                    <span>Editar cotización</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingModal(false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      visibility
                    </span>
                    <span>Ver modo lectura</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeQuotationModal}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>
            </div>

            {/* Pipeline de Estados Estrictos Visual */}
            <div className="bg-[#FEF9E7]/60 border-b border-amber-200/60 px-6 py-2.5 flex items-center justify-between text-[11px] overflow-x-auto">
              <div className="flex items-center gap-2 text-slate-600 shrink-0 font-medium">
                <span className="material-symbols-outlined text-[16px] text-amber-700">
                  timeline
                </span>
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                  Flujo de Estados:
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold shrink-0">
                {(['PROPUESTO', 'SELECCIONADO', 'CONFIRMADO'] as const).map(
                  (step, idx, arr) => {
                    const activeNorm = normalizeProviderStatus(activeRelation.status);
                    const isCurrent = activeNorm === step;
                    const isPast =
                      (step === 'PROPUESTO' &&
                        (activeNorm === 'SELECCIONADO' || activeNorm === 'CONFIRMADO')) ||
                      (step === 'SELECCIONADO' && activeNorm === 'CONFIRMADO');

                    return (
                      <React.Fragment key={step}>
                        <span
                          className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isCurrent
                              ? 'bg-[#F2C94C] text-slate-950 ring-2 ring-[#745B00]/20'
                              : isPast
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isPast && (
                            <span className="material-symbols-outlined text-[12px]">
                              check
                            </span>
                          )}
                          <span>{step}</span>
                        </span>
                        {idx < arr.length - 1 && (
                          <span className="material-symbols-outlined text-[14px] text-slate-300">
                            arrow_forward
                          </span>
                        )}
                      </React.Fragment>
                    );
                  }
                )}

                {/* Si está en estado terminal (RECHAZADO o CANCELADO) */}
                {(normalizeProviderStatus(activeRelation.status) === 'RECHAZADO' ||
                  normalizeProviderStatus(activeRelation.status) === 'CANCELADO') && (
                  <>
                    <span className="text-slate-300 font-normal">|</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        cancel
                      </span>
                      <span>{normalizeProviderStatus(activeRelation.status)} (Final)</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* VISTA MODO LECTURA O MODO EDICIÓN */}
              {!isEditingModal ? (
                /* MODO LECTURA */
                <div className="space-y-5">
                  {/* Vista previa del documento de cotización */}
                  {activeRelation.quotationFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider">
                        <span>Documento oficial de cotización</span>
                        <span className="text-slate-400 font-normal text-[11px] normal-case">
                          Subido: {activeRelation.quotationFile.uploadDate || 'Reciente'}
                        </span>
                      </div>

                      {activeRelation.quotationFile.type === 'image' &&
                      activeRelation.quotationFile.dataUrl ? (
                        <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center max-h-[300px] shadow-2xs">
                          <img
                            src={activeRelation.quotationFile.dataUrl}
                            alt={activeRelation.quotationFile.name}
                            className="max-h-[300px] w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4 shadow-2xs">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[28px]">
                                picture_as_pdf
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {activeRelation.quotationFile.name}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Tamaño: {activeRelation.quotationFile.size || '1.8 MB'} · Archivo oficial validado
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              showToast(
                                `Descargando cotización: ${activeRelation.quotationFile?.name}...`
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              download
                            </span>
                            <span>Descargar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
                      <span className="material-symbols-outlined text-3xl text-slate-300">
                        attachment
                      </span>
                      <p className="text-xs font-bold text-slate-700">
                        No hay documento de cotización adjunto
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Haz clic en &quot;Editar cotización&quot; para subir el documento oficial en PDF o imagen.
                      </p>
                    </div>
                  )}

                  {/* Metadata Financiera y Notas */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">
                          Monto presupuestado para {activeRelation.serviceName || activeRelation.category}:
                        </span>
                        <span className="text-lg font-bold text-slate-950 tabular-nums">
                          S/{' '}
                          {activeRelation.budget.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">
                          Código de referencia:
                        </span>
                        <span className="text-sm font-mono font-bold text-slate-900">
                          {activeRelation.quotationNumber || 'Sin código asignado'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200">
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Especificaciones y notas acordadas:
                      </span>
                      <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed">
                        {activeRelation.internalNotes ||
                          activeRelation.serviceSubtext ||
                          'Sin notas adicionales especificadas.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODO EDICIÓN */
                <form onSubmit={handleSaveModalEdit} className="space-y-4">
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="material-symbols-outlined text-[17px] text-amber-700">
                        edit_document
                      </span>
                      Modo Edición: Modifica monto, archivo, estado y notas
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Cambios en tiempo real
                    </span>
                  </div>

                  {/* 1. Editar Documento de Cotización */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Documento de cotización
                    </label>

                    {editFile ? (
                      <div className="p-3 bg-amber-50/30 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[19px]">
                              picture_as_pdf
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {editFile.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {editFile.size} · Subido: {editFile.uploadDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => modalFileInputRef.current?.click()}
                            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer text-xs font-semibold"
                            title="Reemplazar archivo"
                          >
                            <span className="material-symbols-outlined text-[17px]">
                              sync
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditFile(null)}
                            className="p-1 rounded text-rose-600 hover:text-rose-800 hover:bg-rose-50 cursor-pointer"
                            title="Quitar archivo"
                          >
                            <span className="material-symbols-outlined text-[17px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingModalFile(true);
                        }}
                        onDragLeave={() => setIsDraggingModalFile(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingModalFile(false);
                          const f = e.dataTransfer.files?.[0];
                          if (f) processModalFile(f);
                        }}
                        onClick={() => modalFileInputRef.current?.click()}
                        className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                          isDraggingModalFile
                            ? 'border-[#F2C94C] bg-amber-50'
                            : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl text-amber-700 block mb-1">
                          upload_file
                        </span>
                        <p className="text-xs font-bold text-slate-800">
                          Subir o arrastrar nuevo documento de cotización
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          PDF, JPG, PNG, DOCX (hasta 25 MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Monto Presupuestado y Código de Cotización */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Monto cotizado (S/) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                          S/
                        </span>
                        <input
                          type="text"
                          value={editBudget}
                          onChange={(e) => setEditBudget(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-bold tabular-nums focus:outline-none focus:border-[#F2C94C]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Código de cotización
                      </label>
                      <input
                        type="text"
                        value={editQuotationNumber}
                        onChange={(e) => setEditQuotationNumber(e.target.value)}
                        placeholder="Ej: COT-2026-0814"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-[#F2C94C]"
                      />
                    </div>
                  </div>

                  {/* 3. Estado con Restricción Estricta de Transición */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Estado de la cotización (Restricción estricta)
                    </label>

                    {(() => {
                      const currentNorm = normalizeProviderStatus(activeRelation.status);
                      const isTerminal = isTerminalStatus(currentNorm);
                      const allowedNext = getNextAllowedStatuses(currentNorm);
                      const options: StrictProviderStatus[] = [
                        currentNorm,
                        ...allowedNext.filter((s) => s !== currentNorm),
                      ];

                      if (isTerminal) {
                        return (
                          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <span className="material-symbols-outlined text-[16px] text-rose-600">
                                lock
                              </span>
                              <span>Estado terminal ({currentNorm}): Transiciones bloqueadas</span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              De acuerdo con las reglas de negocio, los estados RECHAZADO y CANCELADO son terminales y no permiten más transiciones.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-1.5">
                          <select
                            value={editStatus}
                            onChange={(e) =>
                              setEditStatus(e.target.value as StrictProviderStatus)
                            }
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-[#F2C94C] cursor-pointer"
                          >
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt} {opt === currentNorm ? '(Estado actual)' : '(Transición permitida)'}
                              </option>
                            ))}
                          </select>

                          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-start gap-2">
                            <span className="material-symbols-outlined text-[15px] text-amber-700 shrink-0 mt-0.5">
                              info
                            </span>
                            <div>
                              <span className="font-semibold text-slate-800">
                                Regla de transición estricta para {currentNorm}:
                              </span>
                              <span className="block text-slate-500 text-[10px] mt-0.5">
                                {currentNorm === 'PROPUESTO' &&
                                  'PROPUESTO solo puede pasar a SELECCIONADO o RECHAZADO.'}
                                {currentNorm === 'SELECCIONADO' &&
                                  'SELECCIONADO solo puede pasar a CONFIRMADO o CANCELADO.'}
                                {currentNorm === 'CONFIRMADO' &&
                                  'CONFIRMADO solo puede pasar a CANCELADO.'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 4. Notas y requerimientos adicionales */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Notas y especificaciones adicionales
                    </label>
                    <textarea
                      rows={3}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Especificaciones técnicas, menús, condiciones de entrega..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
                    />
                  </div>

                  {/* Botones Guardar / Cancelar Edición */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsEditingModal(false)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#F2C94C] hover:bg-[#ebc246] text-slate-950 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        save
                      </span>
                      <span>Guardar cambios</span>
                    </button>
                  </div>
                </form>
              )}

              {/* SECCIÓN DE ARCHIVOS EXTRAS / SECUNDARIOS */}
              <div className="pt-5 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-purple-700">
                        folder_copy
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Archivos Extras y Complementarios
                      </h4>
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-purple-200">
                        {activeRelation.extraFiles?.length || 0}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Archivos secundarios asociados: contratos firmados, planos técnicos de montaje, fotos de referencia o adendas.
                    </p>
                  </div>

                  {!isAddingExtraFile && (
                    <button
                      type="button"
                      onClick={() => setIsAddingExtraFile(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        add
                      </span>
                      <span>Cargar archivo extra</span>
                    </button>
                  )}
                </div>

                {/* Formulario para agregar nuevo archivo extra */}
                {isAddingExtraFile && (
                  <form
                    onSubmit={handleSaveExtraFile}
                    className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-purple-700">
                          upload_file
                        </span>
                        Nuevo Archivo Complementario
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingExtraFile(false)}
                        className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Tipo de documento secundario <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newExtraFileType}
                          onChange={(e) => setNewExtraFileType(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-purple-400 cursor-pointer"
                        >
                          <option value="Contrato">Contrato firmado</option>
                          <option value="Plano técnico">Plano técnico / Montaje</option>
                          <option value="Muestra / Imagen">Muestra / Foto de referencia</option>
                          <option value="Adenda">Adenda contractual</option>
                          <option value="Especificación">Especificación técnica</option>
                          <option value="Documento">Documento legal / Guía</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Nombre del archivo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newExtraFileName}
                          onChange={(e) => setNewExtraFileName(e.target.value)}
                          placeholder="Ej: Contrato_Catering_Firmado.pdf"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Comentarios o descripción del archivo
                      </label>
                      <input
                        type="text"
                        value={newExtraFileNotes}
                        onChange={(e) => setNewExtraFileNotes(e.target.value)}
                        placeholder="Ej: Aprobado con firma legal, versión final de distribución de mesas..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => extraFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-900 bg-white border border-purple-200 rounded-lg hover:bg-purple-100/50 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          attach_file
                        </span>
                        <span>Examinar archivo local</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingExtraFile(false)}
                          className="px-3 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          Adjuntar archivo extra
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Listado de archivos extras cargados */}
                <div className="space-y-2">
                  {!activeRelation.extraFiles || activeRelation.extraFiles.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                      No hay archivos secundarios todavía. Puedes cargar contratos firmados, planos o adendas una vez que el cliente apruebe la cotización.
                    </div>
                  ) : (
                    activeRelation.extraFiles.map((file) => {
                      const isContract = file.type.toLowerCase().includes('contrato');
                      const isBlueprint =
                        file.type.toLowerCase().includes('plano') ||
                        file.type.toLowerCase().includes('técnico');
                      const isImage = file.type.toLowerCase().includes('imagen') || file.type.toLowerCase().includes('muestra');

                      const badgeStyle = isContract
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isBlueprint
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : isImage
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200';

                      const iconName = isContract
                        ? 'description'
                        : isBlueprint
                        ? 'architecture'
                        : isImage
                        ? 'image'
                        : 'folder_open';

                      return (
                        <div
                          key={file.id}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-slate-300 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${badgeStyle}`}
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {iconName}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {file.name}
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${badgeStyle}`}
                                >
                                  {file.type}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>Subido: {file.uploadDate}</span>
                                {file.notes && (
                                  <>
                                    <span>•</span>
                                    <span className="italic text-slate-600 truncate max-w-xs">
                                      &quot;{file.notes}&quot;
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => showToast(`Descargando archivo extra: ${file.name}...`)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Descargar archivo secundario"
                            >
                              <span className="material-symbols-outlined text-[17px]">
                                download
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                removeExtraFileFromQuotation(activeRelation.id, file.id)
                              }
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar archivo secundario"
                            >
                              <span className="material-symbols-outlined text-[17px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Partida y cotización vinculadas al repositorio del evento
              </span>
              <button
                type="button"
                onClick={closeQuotationModal}
                className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


