'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '../../../lib/navigation';
import { EventType } from '../../../types/planery';
import { usePlanery } from '../../../context/PlaneryContext';
import {
  QuickClientModal,
  CancelEventModal,
} from '../../../components/modals/EventFormModals';

export default function CrearEventoPage() {
  const router = useRouter();
  const { clients, planners, addEvent } = usePlanery();

  const [name, setName] = useState('');
  const [type, setType] = useState<EventType | ''>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-11-28');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('02:00');
  const [location, setLocation] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedPlannerId, setSelectedPlannerId] = useState('sofia_r');
  const [budget, setBudget] = useState('45000');

  const [showValidationBanner, setShowValidationBanner] = useState(false);
  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !type || !date || !selectedClientId) {
      setShowValidationBanner(true);
      return;
    }

    const clientObj = clients.find((c) => c.id === selectedClientId);
    const plannerObj =
      planners.find((p) => p.id === selectedPlannerId) || planners[0];

    const created = addEvent({
      name: name.trim(),
      subtitle: `${type} Corporativo/Social`,
      type: type as EventType,
      date,
      dateFormatted: new Date(date + 'T12:00:00').toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      startTime,
      endTime,
      location: location.trim() || 'Hacienda Villa Verde, Lurín',
      venueDetail: location.trim() || 'Hacienda Villa Verde, Lurín',
      client: clientObj ? clientObj.name : 'Tech Innovations Corp',
      clientEmail: clientObj?.email,
      clientPhone: clientObj?.phone,
      planner: plannerObj.shortName,
      plannerInitials: plannerObj.initials,
      plannerRole: plannerObj.role,
      budget: parseFloat(budget) || 45000,
      status: 'Planificación',
      description: description.trim(),
    });

    router.push(`/eventos/${created.id}`);
  };

  return (
    <main className="p-6 lg:p-8 max-w-5xl mx-auto w-full pb-16">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 mb-4 text-slate-500 text-xs">
        <Link href="/" className="hover:text-[#745b00] transition-colors">
          Inicio
        </Link>
        <span className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <Link
          href="/eventos"
          className="hover:text-[#745b00] transition-colors"
        >
          Eventos
        </Link>
        <span className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <span className="font-semibold text-slate-900">Nuevo evento</span>
      </nav>

      {/* Page Header with Initial Status Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-[32px] leading-[40px] text-slate-900 font-bold tracking-tight">
            Crear evento
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registra la información principal para comenzar a gestionar tu
            evento.
          </p>
        </div>

        {/* Badge Informativo de Estado Inicial */}
        <div className="flex items-center gap-2.5 bg-[#f0f3ff] px-3.5 py-2 rounded-xl border border-slate-200 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600 ring-4 ring-slate-600/10" />
          <div className="text-left">
            <span className="text-xs text-slate-900 font-bold uppercase tracking-wider block">
              Estado inicial: Planificación
            </span>
            <span className="text-xs text-slate-500 block">
              El evento se activará automáticamente
            </span>
          </div>
          <span
            className="material-symbols-outlined text-slate-500 ml-1"
            title="Este estado permite configurar presupuestos, proveedores y cronogramas previos."
          >
            info
          </span>
        </div>
      </div>

      {/* FORM CONTAINER */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-slate-200 rounded-xl shadow-xs divide-y divide-slate-200 overflow-hidden"
      >
        {/* SECCIÓN 1: INFORMACIÓN DEL EVENTO */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#f0f3ff] text-[#745b00] flex items-center justify-center text-xs font-bold border border-slate-200">
              1
            </span>
            <h2 className="text-lg text-slate-900 font-semibold">
              Información del evento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs text-slate-900 font-semibold">
                Nombre del evento <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Boda de María y Carlos / Cumbre Corporativa Q1"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20"
              />
              <p className="text-xs text-slate-500">
                Usa un nombre distintivo y reconocible por todo el equipo de
                coordinación.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-900 font-semibold">
                Tipo de evento <span className="text-rose-600 font-bold">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] cursor-pointer"
              >
                <option value="" disabled>
                  Selecciona un tipo...
                </option>
                <option value="Matrimonio">Matrimonio</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Conferencia">Conferencia</option>
                <option value="Bautizo">Bautizo</option>
                <option value="Cumpleaños">Cumpleaños</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-900 font-semibold">
                Presupuesto inicial estimado (S/)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 tabular-nums focus:outline-none focus:border-[#F2C94C]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs text-slate-900 font-semibold">
                Descripción{' '}
                <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los objetivos principales o notas generales del evento..."
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C] resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: FECHA Y UBICACIÓN */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#f0f3ff] text-[#745b00] flex items-center justify-center text-xs font-bold border border-slate-200">
              2
            </span>
            <h2 className="text-lg text-slate-900 font-semibold">
              Fecha y ubicación
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs text-slate-900 font-semibold">
                Fecha del evento <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-900 font-semibold">
                Hora de inicio <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-900 font-semibold">
                Hora de finalización{' '}
                <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="block text-xs text-slate-900 font-semibold">
                Ubicación del evento{' '}
                <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  location_on
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Hacienda Villa Verde, Lurín o Dirección del evento"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: CLIENTE */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#f0f3ff] text-[#745b00] flex items-center justify-center text-xs font-bold border border-slate-200">
                3
              </span>
              <h2 className="text-lg text-slate-900 font-semibold">Cliente</h2>
            </div>

            <button
              type="button"
              onClick={() => setIsQuickClientOpen(true)}
              className="text-sm text-[#745b00] font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                person_add
              </span>
              <span>+ Crear cliente</span>
            </button>
          </div>

          <div className="space-y-2 pt-2 max-w-2xl">
            <label className="block text-xs text-slate-900 font-semibold">
              Cliente titular <span className="text-rose-600 font-bold">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                group
              </span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] cursor-pointer"
              >
                <option value="" disabled>
                  Selecciona un cliente de tu empresa...
                </option>
                {clients.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.name} ({cli.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="material-symbols-outlined text-[16px] text-slate-400">
                verified_user
              </span>
              <p className="text-xs text-slate-500">
                Solo se muestran clientes asociados a tu empresa actual mediante
                permisos RBAC.
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: PLANNER ASIGNADO */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#f0f3ff] text-[#745b00] flex items-center justify-center text-xs font-bold border border-slate-200">
              4
            </span>
            <h2 className="text-lg text-slate-900 font-semibold">
              Planner asignado
            </h2>
          </div>

          <div className="space-y-2 pt-2 max-w-2xl">
            <label className="block text-xs text-slate-900 font-semibold">
              Planner responsable directo{' '}
              <span className="text-rose-600 font-bold">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                badge
              </span>
              <select
                value={selectedPlannerId}
                onChange={(e) => setSelectedPlannerId(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] cursor-pointer"
              >
                {planners.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name} ({pl.role})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500">
              En V1 cada evento cuenta con un planner responsable directo
              asignado para auditoría y flujo de aprobaciones.
            </p>
          </div>
        </div>

        {/* FOOTER DEL FORMULARIO */}
        <div className="p-6 bg-[#f0f3ff]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span className="text-rose-600 font-bold">*</span> Campos
            obligatorios para el registro
          </div>
          <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 rounded-xl bg-white text-sm font-semibold text-slate-900 hover:border-slate-900 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-2.5 bg-[#F2C94C] hover:bg-[#ffe08b] text-[#151c27] text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                check
              </span>
              <span>Crear evento</span>
            </button>
          </div>
        </div>
      </form>

      {/* Validation Banner */}
      {showValidationBanner && (
        <div className="mt-4 p-4 bg-[#ffdad6] text-[#93000a] rounded-xl border border-rose-300 flex items-start gap-3">
          <span className="material-symbols-outlined text-rose-700 mt-0.5">
            error
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">
              Por favor completa todos los campos requeridos marcados con (*).
            </p>
            <p className="text-xs mt-0.5">
              Asegúrate de ingresar un nombre, tipo de evento, fecha válida y
              asignar un cliente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowValidationBanner(false)}
            className="text-[#93000a] hover:opacity-75 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <QuickClientModal
        isOpen={isQuickClientOpen}
        onClose={() => setIsQuickClientOpen(false)}
        onClientCreated={(client) => setSelectedClientId(client.id)}
      />

      <CancelEventModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onDiscard={() => {
          setIsCancelModalOpen(false);
          router.push('/eventos');
        }}
      />
    </main>
  );
}
