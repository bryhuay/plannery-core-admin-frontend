'use client';

import React, { useState, useEffect } from 'react';
import { EventItem, EventStatus, EventType } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface EditEventModalProps {
  isOpen: boolean;
  event: EventItem;
  onClose: () => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  event,
  onClose,
}) => {
  const { updateEvent, planners, clients } = usePlanery();

  const [name, setName] = useState(event.name);
  const [type, setType] = useState<EventType>(event.type);
  const [subtitle, setSubtitle] = useState(event.subtitle || '');
  const [status, setStatus] = useState<EventStatus>(event.status);
  const [date, setDate] = useState(event.date);
  const [startTime, setStartTime] = useState(event.startTime || '17:00');
  const [endTime, setEndTime] = useState(event.endTime || '03:00');
  const [location, setLocation] = useState(event.location);
  const [venueDetail, setVenueDetail] = useState(
    event.venueDetail || event.location
  );
  const [client, setClient] = useState(event.client);
  const [clientEmail, setClientEmail] = useState(
    event.clientEmail || 'marialopez@email.com'
  );
  const [clientPhone, setClientPhone] = useState(
    event.clientPhone || '+51 987 654 321'
  );
  const [plannerName, setPlannerName] = useState(event.planner);
  const [budget, setBudget] = useState(String(event.budget));
  const [description, setDescription] = useState(event.description || '');

  useEffect(() => {
    if (isOpen && event) {
      setName(event.name);
      setType(event.type);
      setSubtitle(event.subtitle || '');
      setStatus(event.status);
      setDate(event.date);
      setStartTime(event.startTime || '17:00');
      setEndTime(event.endTime || '03:00');
      setLocation(event.location);
      setVenueDetail(event.venueDetail || event.location);
      setClient(event.client);
      setClientEmail(event.clientEmail || 'marialopez@email.com');
      setClientPhone(event.clientPhone || '+51 987 654 321');
      setPlannerName(event.planner);
      setBudget(String(event.budget));
      setDescription(event.description || '');
    }
  }, [isOpen, event]);

  if (!isOpen) return null;

  const handleClientChange = (selectedClientName: string) => {
    setClient(selectedClientName);
    const foundClient = clients.find((c) => c.name === selectedClientName);
    if (foundClient) {
      setClientEmail(foundClient.email);
      setClientPhone(foundClient.phone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedPlanner = planners.find(
      (p) => p.name === plannerName || p.shortName === plannerName
    );
    const initials = matchedPlanner
      ? matchedPlanner.initials
      : plannerName
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

    updateEvent(event.id, {
      name: name.trim(),
      type,
      subtitle: subtitle.trim() || type,
      status,
      date,
      startTime,
      endTime,
      location: location.trim(),
      venueDetail: venueDetail.trim(),
      client: client.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      planner: matchedPlanner ? matchedPlanner.name : plannerName,
      plannerInitials: initials,
      plannerRole: matchedPlanner ? matchedPlanner.role : 'Coordinador Senior',
      budget: Math.max(0, Number(budget) || event.budget),
      description: description.trim(),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-event-modal-title"
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C94C]/25 border border-[#F2C94C] flex items-center justify-center text-[#745B00] shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                edit_calendar
              </span>
            </div>
            <div>
              <h3
                id="edit-event-modal-title"
                className="text-base font-bold text-slate-900"
              >
                Editar Información General del Evento
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {event.code} · Ficha Técnica y Asignación Operativa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto w-full flex flex-col gap-5"
        >
          {/* Section 1: Identidad y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nombre del evento <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] focus:border-slate-900"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Estado actual <span className="text-rose-600">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
              >
                <option value="Planificación">Planificación</option>
                <option value="En progreso">En progreso</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tipo de evento
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
              >
                <option value="Matrimonio">Matrimonio</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Conferencia">Conferencia</option>
                <option value="Cumpleaños">Cumpleaños</option>
                <option value="Bautizo">Bautizo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subtítulo / Categoría específica
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ej. Matrimonio Social"
                className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Presupuesto total (S/)
              </label>
              <input
                type="number"
                min={0}
                step="100"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
              />
            </div>
          </div>

          {/* Section 2: Fecha, Horario y Ubicación */}
          <div className="pt-4 border-t border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#745B00]">
                schedule
              </span>
              Fecha, Horario y Sede
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fecha del evento <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hora de inicio <span className="text-rose-600">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hora de finalización <span className="text-rose-600">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ciudad / Ubicación
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Arequipa, Perú"
                  className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sede / Dirección exacta
                </label>
                <input
                  type="text"
                  value={venueDetail}
                  onChange={(e) => setVenueDetail(e.target.value)}
                  placeholder="Ej. Hacienda Los Álamos, Tiabaya, Arequipa"
                  className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Planner Asignado y Cliente Titular */}
          <div className="pt-4 border-t border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#745B00]">
                badge
              </span>
              Planner Asignado y Cliente Titular
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Planner Líder asignado <span className="text-rose-600">*</span>
                </label>
                <select
                  value={plannerName}
                  onChange={(e) => setPlannerName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-[#FEFBF0] border border-[#F2C94C] text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C] cursor-pointer"
                >
                  {planners.map((pl) => (
                    <option key={pl.id} value={pl.name}>
                      {pl.name} — {pl.role} ({pl.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cliente titular
                </label>
                <input
                  type="text"
                  list="clients-datalist"
                  value={client}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
                <datalist id="clients-datalist">
                  {clients.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Correo del cliente
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Teléfono del cliente
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Notas / Descripción breve
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción ejecutiva del evento..."
                  className="w-full h-10 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F2C94C]"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100 w-full shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto justify-center px-5 py-2 rounded-lg bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                save
              </span>
              <span>Guardar cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
