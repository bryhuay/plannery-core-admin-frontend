'use client';

import React, { useState, useMemo } from 'react';
import { Link, useRouter } from '../../lib/navigation';
import { CalendarEntry } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

interface CalendarCell {
  dayNumber: number;
  label: string;
  isCurrentMonth: boolean;
  monthLabel: string;
  weekdayShort: string;
  weekdayLong: string;
}

const WEEKDAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const WEEKDAYS_LONG = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

const HOUR_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

function parseStartHour(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 9;
  const h = parseInt(match[1], 10);
  if (isNaN(h)) return 9;
  return Math.max(8, Math.min(20, h));
}

export default function CalendarPage() {
  const router = useRouter();
  const { calendarEntries, showToast } = usePlanery();

  const [viewType, setViewType] = useState<'Mes' | 'Semana' | 'Día' | 'Agenda'>(
    'Mes'
  );
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [plannerFilter, setPlannerFilter] = useState('Todos los Planners');

  // Navigation states for Semana (0..4) and Día (1..30)
  // Default week 2 = 14 Sep - 20 Sep 2026 (contains Today = 15 Sep, and 18 Sep wedding)
  const [activeWeekIdx, setActiveWeekIdx] = useState<number>(2);
  // Default day = 15 (Hoy: Martes 15 de Septiembre 2026)
  const [activeDay, setActiveDay] = useState<number>(15);

  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(
    () => calendarEntries.find((c) => c.id === 'CAL-15') || null
  );

  const filteredEntries = useMemo(() => {
    return calendarEntries.filter((entry) => {
      const matchType =
        typeFilter === 'Todos' ||
        (typeFilter === 'Eventos' && entry.type === 'event') ||
        (typeFilter === 'Tareas' &&
          (entry.type === 'task' || entry.type === 'overdue-task'));
      const matchPlanner =
        plannerFilter === 'Todos los Planners' ||
        entry.planner.toLowerCase().includes(plannerFilter.toLowerCase());
      return matchType && matchPlanner;
    });
  }, [calendarEntries, typeFilter, plannerFilter]);

  // 35 Grid cells for September 2026 (Mon Aug 31 -> Sun Oct 04)
  const cells: CalendarCell[] = useMemo(() => {
    return Array.from({ length: 35 }, (_, idx) => {
      const weekdayShort = WEEKDAYS_SHORT[idx % 7];
      const weekdayLong = WEEKDAYS_LONG[idx % 7];
      if (idx === 0) {
        return {
          dayNumber: 31,
          label: '31',
          isCurrentMonth: false,
          monthLabel: 'Ago',
          weekdayShort,
          weekdayLong,
        };
      }
      if (idx >= 1 && idx <= 30) {
        return {
          dayNumber: idx,
          label: idx.toString().padStart(2, '0'),
          isCurrentMonth: true,
          monthLabel: 'Sep',
          weekdayShort,
          weekdayLong,
        };
      }
      const nextMonthDay = idx - 30;
      return {
        dayNumber: nextMonthDay,
        label: nextMonthDay.toString().padStart(2, '0'),
        isCurrentMonth: false,
        monthLabel: 'Oct',
        weekdayShort,
        weekdayLong,
      };
    });
  }, []);

  // Current week cells (7 days)
  const currentWeekCells = useMemo(() => {
    const start = activeWeekIdx * 7;
    return cells.slice(start, start + 7);
  }, [cells, activeWeekIdx]);

  // Current active day cell
  const currentDayCell = useMemo(() => {
    return (
      cells.find((c) => c.isCurrentMonth && c.dayNumber === activeDay) ||
      cells[15]
    );
  }, [cells, activeDay]);

  // Entries for current week
  const weekEntries = useMemo(() => {
    const validDays = new Set(
      currentWeekCells.filter((c) => c.isCurrentMonth).map((c) => c.dayNumber)
    );
    return filteredEntries.filter((e) => validDays.has(e.day));
  }, [currentWeekCells, filteredEntries]);

  // Entries for current day
  const dayEntries = useMemo(() => {
    return filteredEntries.filter((e) => e.day === activeDay);
  }, [filteredEntries, activeDay]);

  // Dynamic Period Title in Toolbar
  const periodLabel = useMemo(() => {
    if (viewType === 'Semana') {
      const first = currentWeekCells[0];
      const last = currentWeekCells[6];
      return `Semana del ${first.label} ${first.monthLabel} al ${last.label} ${last.monthLabel} 2026`;
    }
    if (viewType === 'Día') {
      return `${currentDayCell.weekdayLong}, ${currentDayCell.label} de Septiembre 2026`;
    }
    return 'Septiembre 2026';
  }, [viewType, currentWeekCells, currentDayCell]);

  // Handlers for Prev / Next & Today
  const handlePrevPeriod = () => {
    if (viewType === 'Semana') {
      setActiveWeekIdx((prev) => Math.max(0, prev - 1));
      return;
    }
    if (viewType === 'Día') {
      setActiveDay((prev) => {
        const nextDay = Math.max(1, prev - 1);
        const weekForDay = Math.floor(nextDay / 7);
        setActiveWeekIdx(Math.min(4, weekForDay));
        return nextDay;
      });
      return;
    }
    showToast('Mes anterior: Agosto 2026');
  };

  const handleNextPeriod = () => {
    if (viewType === 'Semana') {
      setActiveWeekIdx((prev) => Math.min(4, prev + 1));
      return;
    }
    if (viewType === 'Día') {
      setActiveDay((prev) => {
        const nextDay = Math.min(30, prev + 1);
        const weekForDay = Math.floor(nextDay / 7);
        setActiveWeekIdx(Math.min(4, weekForDay));
        return nextDay;
      });
      return;
    }
    showToast('Mes siguiente: Octubre 2026');
  };

  const handleGoToday = () => {
    setActiveWeekIdx(2);
    setActiveDay(15);
    const todayItem = calendarEntries.find((c) => c.day === 15);
    if (todayItem) setSelectedEntry(todayItem);
    showToast('Centrado en Hoy: Martes 15 de Septiembre 2026');
  };

  const handleOpenDayView = (dayNumber: number) => {
    setActiveDay(dayNumber);
    const cellIdx = cells.findIndex(
      (c) => c.isCurrentMonth && c.dayNumber === dayNumber
    );
    if (cellIdx >= 0) {
      setActiveWeekIdx(Math.floor(cellIdx / 7));
    }
    const firstEntry = filteredEntries.find((e) => e.day === dayNumber);
    if (firstEntry) setSelectedEntry(firstEntry);
    setViewType('Día');
  };

  const renderEntryBadgeStyle = (entry: CalendarEntry, isSelected: boolean) => {
    if (entry.type === 'overdue-task') {
      return isSelected
        ? 'bg-rose-100 border-2 border-rose-600 text-rose-950 shadow-xs'
        : 'bg-rose-50 border-l-2 border-rose-600 text-rose-900 hover:bg-rose-100/80';
    }
    if (entry.type === 'task') {
      return isSelected
        ? 'bg-emerald-100 border-2 border-emerald-600 text-emerald-950 shadow-xs'
        : 'bg-emerald-50 border-l-2 border-emerald-600 text-emerald-900 hover:bg-emerald-100/80';
    }
    return isSelected
      ? 'bg-[#F2C94C]/25 border-2 border-[#F2C94C] text-slate-900 shadow-xs'
      : 'bg-blue-50 border-l-2 border-blue-600 text-blue-900 hover:bg-blue-100/80';
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[32px] sm:leading-[40px] font-bold text-slate-900 tracking-tight">
            Calendario
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organiza tus eventos y tareas en una sola vista por mes, semana, día o agenda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={handleGoToday}
            className="h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-[#f0f3ff] text-slate-900 text-sm font-medium transition-colors cursor-pointer"
          >
            Hoy (15 Sep)
          </button>
          <Link
            href="/eventos/nuevo"
            className="h-10 px-4 rounded-lg bg-[#F2C94C] hover:bg-[#ebd578] text-slate-900 font-bold text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Nuevo evento</span>
          </Link>
        </div>
      </section>

      {/* Calendar Navigation & View Segment Controls */}
      <section className="px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 border-y border-slate-200 bg-white">
        {/* Period Nav */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-200 bg-[#f0f3ff] p-0.5">
            <button
              type="button"
              onClick={handlePrevPeriod}
              aria-label="Periodo anterior"
              className="w-8 h-8 rounded hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleNextPeriod}
              aria-label="Periodo siguiente"
              className="w-8 h-8 rounded hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
              {periodLabel}
            </h2>
            {viewType === 'Semana' && (
              <p className="text-[11px] text-slate-500">
                Semana {activeWeekIdx + 1} de 5 · {weekEntries.length}{' '}
                actividades programadas
              </p>
            )}
            {viewType === 'Día' && (
              <p className="text-[11px] text-slate-500">
                {activeDay === 15
                  ? 'Hoy · Jornada operativa activa'
                  : `${dayEntries.length} registros agendados para este día`}
              </p>
            )}
          </div>
        </div>

        {/* Segmented View Switcher */}
        <div className="w-full sm:w-auto flex items-center bg-[#f0f3ff] p-1 rounded-lg border border-slate-200 overflow-x-auto">
          {(['Mes', 'Semana', 'Día', 'Agenda'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setViewType(v)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 sm:py-1 rounded text-xs transition-all cursor-pointer ${
                viewType === v
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Semantic Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Eventos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Tareas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-rose-600 text-[14px]">
              warning
            </span>
            <span className="text-rose-600 font-medium">Tareas atrasadas</span>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="px-4 sm:px-6 lg:px-8 py-2.5 bg-[#f9f9ff] flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              Tipo:
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-0 p-0 text-xs font-medium text-slate-900 focus:outline-none cursor-pointer"
            >
              <option>Todos</option>
              <option>Eventos</option>
              <option>Tareas</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              Planner:
            </span>
            <select
              value={plannerFilter}
              onChange={(e) => setPlannerFilter(e.target.value)}
              className="bg-transparent border-0 p-0 text-xs font-medium text-slate-900 focus:outline-none cursor-pointer"
            >
              <option>Todos los Planners</option>
              <option value="Carlos">Carlos Mendoza</option>
              <option value="Sofía">Sofía R.</option>
              <option value="Martín">Martín L.</option>
              <option value="Jerson">Jerson Huayta</option>
            </select>
          </div>

          {viewType === 'Semana' && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
              <span className="text-[11px] font-semibold text-slate-500">
                Semana:
              </span>
              <select
                value={activeWeekIdx}
                onChange={(e) => setActiveWeekIdx(Number(e.target.value))}
                className="bg-transparent border-0 p-0 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={0}>Sem 1 (31 Ago - 06 Sep)</option>
                <option value={1}>Sem 2 (07 Sep - 13 Sep)</option>
                <option value={2}>Sem 3 (14 Sep - 20 Sep · Actual)</option>
                <option value={3}>Sem 4 (21 Sep - 27 Sep)</option>
                <option value={4}>Sem 5 (28 Sep - 04 Oct)</option>
              </select>
            </div>
          )}

          {viewType === 'Día' && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
              <span className="text-[11px] font-semibold text-slate-500">
                Día:
              </span>
              <select
                value={activeDay}
                onChange={(e) => {
                  const d = Number(e.target.value);
                  setActiveDay(d);
                  setActiveWeekIdx(Math.min(4, Math.floor(d / 7)));
                }}
                className="bg-transparent border-0 p-0 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d.toString().padStart(2, '0')} Sep 2026
                    {d === 15 ? ' (Hoy)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setTypeFilter('Todos');
              setPlannerFilter('Todos los Planners');
            }}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors ml-1 cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="text-xs text-slate-500">
          {viewType === 'Semana' ? (
            <>
              Mostrando{' '}
              <span className="font-semibold text-slate-900">
                {weekEntries.length}
              </span>{' '}
              registros en esta semana
            </>
          ) : viewType === 'Día' ? (
            <>
              Mostrando{' '}
              <span className="font-semibold text-slate-900">
                {dayEntries.length}
              </span>{' '}
              registros del día {activeDay} Sep
            </>
          ) : (
            <>
              Mostrando{' '}
              <span className="font-semibold text-slate-900">
                {filteredEntries.length}
              </span>{' '}
              registros para el mes
            </>
          )}
        </div>
      </section>

      {/* Main Content Area by View Type */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-16">
        {/* ========================================================= */}
        {/* 1. VISTA DE AGENDA */}
        {/* ========================================================= */}
        {viewType === 'Agenda' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Vista de Agenda — Septiembre 2026
                </h3>
                <p className="text-xs text-slate-500">
                  Listado cronológico de eventos confirmados, visitas técnicas y tareas operativas.
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f0f3ff] text-slate-800 self-start sm:self-auto">
                {filteredEntries.length} actividades en total
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => {
                    setSelectedEntry(entry);
                    handleOpenDayView(entry.day);
                  }}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#f0f3ff] border border-slate-200 flex flex-col items-center justify-center font-bold text-xs text-slate-900 shrink-0">
                      <span className="text-sm leading-none">{entry.day}</span>
                      <span className="text-[9px] text-slate-500 uppercase mt-0.5">
                        Sep
                      </span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {entry.title}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            entry.type === 'overdue-task'
                              ? 'bg-rose-100 text-rose-800'
                              : entry.type === 'task'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {entry.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {entry.time} · {entry.location} · Planner:{' '}
                        <strong className="text-slate-700">
                          {entry.planner}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/eventos/${entry.eventId || 'EV-2026-084'}`
                        );
                      }}
                      className="text-xs font-semibold text-[#745b00] hover:underline"
                    >
                      Ir al evento →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. VISTA DE SEMANA (7 COLUMNAS CON CRONOGRAMA HORARIO)    */}
        {/* ========================================================= */}
        {viewType === 'Semana' && (
          <div className="space-y-4">
            {/* Week Quick Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { idx: 0, label: 'Semana 1 (31 Ago - 06 Sep)' },
                { idx: 1, label: 'Semana 2 (07 Sep - 13 Sep)' },
                { idx: 2, label: 'Semana 3 (14 Sep - 20 Sep · Actual)' },
                { idx: 3, label: 'Semana 4 (21 Sep - 27 Sep)' },
                { idx: 4, label: 'Semana 5 (28 Sep - 04 Oct)' },
              ].map((w) => (
                <button
                  key={w.idx}
                  type="button"
                  onClick={() => setActiveWeekIdx(w.idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    activeWeekIdx === w.idx
                      ? 'bg-[#1E222D] text-[#F2C94C] border-[#1E222D] shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 7-Column Weekly Board */}
              <div className="lg:col-span-9 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[760px] flex flex-col">
                    {/* Week Header Row */}
                    <div className="grid grid-cols-7 border-b border-slate-200 bg-[#f0f3ff] divide-x divide-slate-200">
                      {currentWeekCells.map((cell, i) => {
                        const isToday =
                          cell.isCurrentMonth && cell.dayNumber === 15;
                        const cellEntries = cell.isCurrentMonth
                          ? filteredEntries.filter(
                              (e) => e.day === cell.dayNumber
                            )
                          : [];

                        return (
                          <div
                            key={i}
                            onClick={() => {
                              if (cell.isCurrentMonth) {
                                handleOpenDayView(cell.dayNumber);
                              }
                            }}
                            className={`p-3 text-center transition-colors cursor-pointer ${
                              isToday
                                ? 'bg-[#FEFBF0] border-b-2 border-b-[#F2C94C]'
                                : 'hover:bg-white/70'
                            }`}
                          >
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                              {cell.weekdayShort}
                            </span>
                            <div className="mt-1 flex items-center justify-center gap-1.5">
                              <span
                                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                                  isToday
                                    ? 'bg-[#745b00] text-white'
                                    : cell.isCurrentMonth
                                    ? 'text-slate-900 bg-white border border-slate-200'
                                    : 'text-slate-400'
                                }`}
                              >
                                {cell.label}
                              </span>
                            </div>
                            <span className="mt-1.5 block text-[10px] font-medium text-slate-500">
                              {cellEntries.length > 0
                                ? `${cellEntries.length} ${
                                    cellEntries.length === 1
                                      ? 'actividad'
                                      : 'actividades'
                                  }`
                                : 'Sin eventos'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Weekly Columns Body */}
                    <div className="grid grid-cols-7 divide-x divide-slate-200 min-h-[420px]">
                      {currentWeekCells.map((cell, i) => {
                        const isToday =
                          cell.isCurrentMonth && cell.dayNumber === 15;
                        const cellEntries = cell.isCurrentMonth
                          ? filteredEntries.filter(
                              (e) => e.day === cell.dayNumber
                            )
                          : [];

                        return (
                          <div
                            key={i}
                            className={`p-2.5 flex flex-col gap-2.5 transition-colors ${
                              !cell.isCurrentMonth
                                ? 'bg-slate-50/60'
                                : isToday
                                ? 'bg-[#FFFDF5]'
                                : 'bg-white'
                            }`}
                          >
                            {cellEntries.length === 0 ? (
                              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 opacity-50">
                                <span className="material-symbols-outlined text-slate-300 text-xl">
                                  event_available
                                </span>
                                <span className="text-[10px] text-slate-400 mt-1">
                                  Libre
                                </span>
                              </div>
                            ) : (
                              cellEntries.map((entry) => {
                                const isSelected =
                                  selectedEntry?.id === entry.id;
                                return (
                                  <div
                                    key={entry.id}
                                    onClick={() => setSelectedEntry(entry)}
                                    className={`p-2.5 rounded-lg text-xs cursor-pointer transition-all space-y-1.5 ${renderEntryBadgeStyle(
                                      entry,
                                      isSelected
                                    )}`}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                                        {entry.time.split(',')[0]}
                                      </span>
                                      {entry.type === 'overdue-task' && (
                                        <span className="material-symbols-outlined text-[14px] text-rose-600">
                                          warning
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-bold leading-snug">
                                      {entry.title}
                                    </div>
                                    <div className="text-[10px] opacity-80 flex items-center gap-1 truncate">
                                      <span className="material-symbols-outlined text-[12px]">
                                        location_on
                                      </span>
                                      <span className="truncate">
                                        {entry.location}
                                      </span>
                                    </div>
                                    <div className="pt-1 border-t border-black/5 flex items-center justify-between text-[10px]">
                                      <span className="font-medium truncate">
                                        {entry.planner}
                                      </span>
                                      <span className="font-semibold underline">
                                        Detalle
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}

                            {cell.isCurrentMonth && (
                              <button
                                type="button"
                                onClick={() => handleOpenDayView(cell.dayNumber)}
                                className="mt-auto w-full py-1.5 rounded-lg border border-dashed border-slate-200 hover:border-[#F2C94C] text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                              >
                                Ver día {cell.label} →
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Selected Activity Inspector Card */}
              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#745b00] text-[20px]">
                      event_note
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Detalle de actividad
                    </h3>
                  </div>
                  {selectedEntry && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedEntry.day} Sep 2026
                    </span>
                  )}
                </div>

                {selectedEntry ? (
                  <div className="space-y-4">
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          selectedEntry.type === 'overdue-task'
                            ? 'bg-rose-100 text-rose-800'
                            : selectedEntry.type === 'task'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {selectedEntry.status}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">
                        {selectedEntry.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedEntry.category}
                      </p>
                    </div>

                    <div className="space-y-2.5 py-3 border-y border-slate-100 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          schedule
                        </span>
                        <span>{selectedEntry.time}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          location_on
                        </span>
                        <span>{selectedEntry.location}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          badge
                        </span>
                        <span>
                          Planner:{' '}
                          <strong className="text-slate-900">
                            {selectedEntry.planner}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-700">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          person
                        </span>
                        <span>
                          Cliente:{' '}
                          <strong className="text-slate-900">
                            {selectedEntry.client}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/eventos/${selectedEntry.eventId || 'EV-2026-084'}`
                          )
                        }
                        className="w-full h-9 rounded-lg bg-[#F2C94C] hover:bg-[#ebd578] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          visibility
                        </span>
                        <span>Abrir expediente del evento</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDayView(selectedEntry.day)}
                        className="w-full h-9 rounded-lg border border-slate-200 hover:border-slate-900 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          today
                        </span>
                        <span>Ver cronograma del día {selectedEntry.day}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    Selecciona cualquier evento o tarea de la semana para inspeccionar sus detalles.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. VISTA DE DÍA (CRONOGRAMA POR HORAS + RESUMEN DEL DÍA)  */}
        {/* ========================================================= */}
        {viewType === 'Día' && (
          <div className="space-y-5">
            {/* Horizontal Day Strip for Current Week + Days with Events */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2">
                {currentWeekCells
                  .filter((c) => c.isCurrentMonth)
                  .map((c) => {
                    const isSelectedDay = c.dayNumber === activeDay;
                    const count = filteredEntries.filter(
                      (e) => e.day === c.dayNumber
                    ).length;
                    return (
                      <button
                        key={c.dayNumber}
                        type="button"
                        onClick={() => setActiveDay(c.dayNumber)}
                        className={`px-3.5 py-2 rounded-xl border text-left transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                          isSelectedDay
                            ? 'bg-[#1E222D] text-white border-[#1E222D] shadow-xs'
                            : 'bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-center">
                          <span
                            className={`text-[10px] uppercase font-bold block ${
                              isSelectedDay
                                ? 'text-[#F2C94C]'
                                : 'text-slate-400'
                            }`}
                          >
                            {c.weekdayShort}
                          </span>
                          <span className="text-sm font-bold tabular-nums">
                            {c.label}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isSelectedDay
                              ? 'bg-slate-800 text-[#F2C94C]'
                              : count > 0
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-200/70 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold text-slate-400 hidden md:inline">
                  Días con actividad:
                </span>
                {[1, 4, 9, 15, 18, 24, 26].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setActiveDay(d);
                      setActiveWeekIdx(Math.min(4, Math.floor(d / 7)));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeDay === d
                        ? 'bg-[#F2C94C] text-slate-950 font-bold'
                        : 'bg-[#f0f3ff] text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {d} Sep
                  </button>
                ))}
              </div>
            </div>

            {/* Day View Main Grid: Hourly Timeline (8 cols) + Day Summary Sidebar (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Hourly Schedule */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="px-5 py-4 border-b border-slate-200 bg-[#f0f3ff]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#745b00]">
                      schedule
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Agenda horaria — {currentDayCell.weekdayLong}{' '}
                        {currentDayCell.label} de Septiembre
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Distribución de eventos, inspecciones y vencimientos por bloque horario
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-800 self-start sm:self-auto">
                    {dayEntries.length}{' '}
                    {dayEntries.length === 1
                      ? 'actividad programada'
                      : 'actividades programadas'}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {HOUR_SLOTS.map((slot) => {
                    const slotHour = parseInt(slot.split(':')[0], 10);
                    const matchingEntries = dayEntries.filter(
                      (e) => parseStartHour(e.time) === slotHour
                    );

                    return (
                      <div
                        key={slot}
                        className={`flex items-stretch min-h-[64px] transition-colors ${
                          matchingEntries.length > 0
                            ? 'bg-[#FEFBF0]/40'
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Hour Label */}
                        <div className="w-20 sm:w-24 shrink-0 py-3 px-3 sm:px-4 border-r border-slate-100 text-right">
                          <span className="text-xs font-mono font-semibold text-slate-500">
                            {slot}
                          </span>
                        </div>

                        {/* Slot Content */}
                        <div className="flex-1 p-2.5 flex flex-col gap-2 justify-center">
                          {matchingEntries.length === 0 ? (
                            <span className="text-[11px] text-slate-300 pl-2 select-none">
                              — Disponible —
                            </span>
                          ) : (
                            matchingEntries.map((entry) => {
                              const isSelected = selectedEntry?.id === entry.id;
                              return (
                                <div
                                  key={entry.id}
                                  onClick={() => setSelectedEntry(entry)}
                                  className={`p-3 rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${renderEntryBadgeStyle(
                                    entry,
                                    isSelected
                                  )}`}
                                >
                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-bold">
                                        {entry.title}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full bg-white/80 text-[10px] font-bold border border-black/10">
                                        {entry.status}
                                      </span>
                                      <span className="text-[11px] opacity-75">
                                        {entry.category}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-85">
                                      <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">
                                          schedule
                                        </span>
                                        {entry.time}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">
                                          location_on
                                        </span>
                                        {entry.location}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">
                                          person
                                        </span>
                                        Planner: {entry.planner}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(
                                        `/eventos/${
                                          entry.eventId || 'EV-2026-084'
                                        }`
                                      );
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F2C94C] text-slate-900 font-semibold text-xs border border-slate-200 transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                                  >
                                    Ver evento →
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Day Summary & Quick Actions */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#745b00] block">
                        Resumen de la jornada
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {currentDayCell.weekdayLong} {currentDayCell.label} Sep
                        2026
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] text-slate-900 font-bold text-sm flex items-center justify-center border border-slate-200">
                      {currentDayCell.label}
                    </div>
                  </div>

                  {/* Mini KPIs for the day */}
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60">
                      <span className="text-lg font-bold text-blue-900 block tabular-nums">
                        {dayEntries.filter((e) => e.type === 'event').length}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-700">
                        Eventos
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                      <span className="text-lg font-bold text-emerald-900 block tabular-nums">
                        {dayEntries.filter((e) => e.type === 'task').length}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Tareas
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60">
                      <span className="text-lg font-bold text-rose-900 block tabular-nums">
                        {
                          dayEntries.filter((e) => e.type === 'overdue-task')
                            .length
                        }
                      </span>
                      <span className="text-[10px] font-semibold text-rose-700">
                        Atrasadas
                      </span>
                    </div>
                  </div>

                  {/* List of entries on this day */}
                  {dayEntries.length > 0 ? (
                    <div className="space-y-2.5 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Actividades del día ({dayEntries.length})
                      </span>
                      {dayEntries.map((entry) => (
                        <div
                          key={entry.id}
                          onClick={() => setSelectedEntry(entry)}
                          className="p-3 rounded-xl border border-slate-200 hover:border-[#F2C94C] bg-slate-50/60 space-y-1.5 cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {entry.title}
                            </span>
                            <span className="text-[10px] font-semibold text-[#745b00]">
                              {entry.time.split(',')[0]}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {entry.location} · Cliente: {entry.client}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-medium text-slate-600">
                              Planner: <strong>{entry.planner}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/eventos/${entry.eventId || 'EV-2026-084'}`
                                );
                              }}
                              className="text-[11px] font-bold text-[#745b00] hover:underline cursor-pointer"
                            >
                              Abrir evento →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200 space-y-2">
                      <span className="material-symbols-outlined text-slate-400 text-2xl">
                        event_busy
                      </span>
                      <p className="text-xs font-semibold text-slate-700">
                        Sin actividades registradas en este día
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Puedes seleccionar otra fecha en la barra superior o programar un nuevo evento.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. VISTA DE MES (CUADRÍCULA DE 35 CELDAS)                 */}
        {/* ========================================================= */}
        {viewType === 'Mes' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[680px] flex flex-col">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-[#f0f3ff] text-center text-xs font-semibold text-slate-500 py-2">
                  <div className="py-1">Lun</div>
                  <div className="py-1">Mar</div>
                  <div className="py-1">Mié</div>
                  <div className="py-1">Jue</div>
                  <div className="py-1">Vie</div>
                  <div className="py-1 font-bold text-slate-900">Sáb</div>
                  <div className="py-1 font-bold text-slate-900">Dom</div>
                </div>

                {/* 5-Week Grid */}
                <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200">
                  {cells.map((cell, idx) => {
                    const isToday =
                      cell.isCurrentMonth && cell.dayNumber === 15;
                    const isWeekend = idx % 7 === 5 || idx % 7 === 6;
                    const cellEntries = cell.isCurrentMonth
                      ? filteredEntries.filter((e) => e.day === cell.dayNumber)
                      : [];

                    return (
                      <div
                        key={idx}
                        className={`min-h-[135px] p-2 flex flex-col relative transition-colors ${
                          !cell.isCurrentMonth
                            ? 'bg-white/60'
                            : isToday
                            ? 'bg-[#FFFDF5] border-2 border-[#F2C94C] z-10 shadow-xs'
                            : isWeekend
                            ? 'bg-[#FBFBFF]'
                            : 'bg-white hover:bg-[#f0f3ff]/30'
                        }`}
                      >
                        {/* Day Header */}
                        {isToday ? (
                          <div className="flex items-center justify-between mb-1">
                            <button
                              type="button"
                              onClick={() => handleOpenDayView(cell.dayNumber)}
                              title="Ver vista detallada del día"
                              className="w-6 h-6 rounded-full bg-[#745b00] text-white text-xs font-bold flex items-center justify-center cursor-pointer hover:opacity-90"
                            >
                              15
                            </button>
                            <span className="text-[10px] text-[#745b00] font-bold uppercase tracking-wider">
                              Hoy
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mb-1">
                            <button
                              type="button"
                              disabled={!cell.isCurrentMonth}
                              onClick={() =>
                                cell.isCurrentMonth &&
                                handleOpenDayView(cell.dayNumber)
                              }
                              title={
                                cell.isCurrentMonth
                                  ? `Ver agenda del día ${cell.label} Sep`
                                  : undefined
                              }
                              className={`text-xs rounded px-1 py-0.5 transition-colors ${
                                !cell.isCurrentMonth
                                  ? 'text-slate-400 font-medium cursor-default'
                                  : 'text-slate-900 font-semibold hover:bg-[#f0f3ff] hover:text-[#745b00] cursor-pointer'
                              }`}
                            >
                              {cell.label}
                            </button>
                          </div>
                        )}

                        {/* Day Entries */}
                        <div className="space-y-1">
                          {cellEntries.map((entry) => {
                            const isSelected = selectedEntry?.id === entry.id;
                            if (entry.type === 'overdue-task') {
                              return (
                                <div
                                  key={entry.id}
                                  onClick={() => setSelectedEntry(entry)}
                                  className="p-1 rounded bg-rose-50 border-l-2 border-rose-600 text-[11px] text-rose-900 flex items-center gap-1 cursor-pointer hover:bg-rose-100"
                                >
                                  <span className="material-symbols-outlined text-[13px] text-rose-600">
                                    warning
                                  </span>
                                  <span className="truncate">
                                    {entry.title}
                                  </span>
                                </div>
                              );
                            }
                            if (entry.type === 'task') {
                              return (
                                <div
                                  key={entry.id}
                                  onClick={() => setSelectedEntry(entry)}
                                  className="p-1 rounded bg-emerald-50 border-l-2 border-emerald-600 text-[11px] text-emerald-900 flex items-center gap-1 cursor-pointer hover:bg-emerald-100"
                                >
                                  <span className="material-symbols-outlined text-[13px] text-emerald-700">
                                    check_box_outline_blank
                                  </span>
                                  <span className="truncate">
                                    {entry.title}
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <div
                                key={entry.id}
                                onClick={() => setSelectedEntry(entry)}
                                className={`p-1.5 rounded text-[11px] leading-snug cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-[#F2C94C]/25 border-2 border-[#F2C94C] shadow-xs'
                                    : 'bg-blue-50 border-l-2 border-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`font-semibold truncate ${
                                      isSelected
                                        ? 'text-slate-900 font-bold'
                                        : 'text-blue-900'
                                    }`}
                                  >
                                    {entry.title}
                                  </span>
                                  {isSelected && (
                                    <span className="w-2 h-2 rounded-full bg-[#F2C94C] shrink-0" />
                                  )}
                                </div>
                                {cell.dayNumber === 18 && (
                                  <span className="text-[10px] text-slate-500 block mt-0.5">
                                    Hacienda Villa Verde
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Floating Contextual Popover when an entry in this cell is selected */}
                        {selectedEntry &&
                          cell.isCurrentMonth &&
                          selectedEntry.day === cell.dayNumber && (
                            <div className="absolute right-0 lg:left-[-90px] top-[72px] w-[320px] bg-white rounded-xl border border-slate-200 shadow-2xl p-4 z-50 text-left">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                    {selectedEntry.status}
                                  </span>
                                  <h3 className="text-base leading-tight font-bold text-slate-900 mt-1">
                                    {selectedEntry.title}
                                  </h3>
                                  <span className="text-xs text-slate-500">
                                    {selectedEntry.category}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedEntry(null)}
                                  aria-label="Cerrar detalle"
                                  className="text-slate-400 hover:text-slate-900 rounded p-1 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    close
                                  </span>
                                </button>
                              </div>

                              <div className="space-y-2 py-2.5 my-1.5 border-y border-slate-200 text-xs">
                                <div className="flex items-center gap-2 text-slate-900">
                                  <span className="material-symbols-outlined text-[16px] text-slate-500">
                                    schedule
                                  </span>
                                  <span>{selectedEntry.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-900">
                                  <span className="material-symbols-outlined text-[16px] text-slate-500">
                                    location_on
                                  </span>
                                  <span className="truncate">
                                    {selectedEntry.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-900">
                                  <span className="material-symbols-outlined text-[16px] text-slate-500">
                                    badge
                                  </span>
                                  <span>
                                    Planner asignado:{' '}
                                    <strong className="font-semibold">
                                      {selectedEntry.planner}
                                    </strong>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-900">
                                  <span className="material-symbols-outlined text-[16px] text-slate-500">
                                    person
                                  </span>
                                  <span>
                                    Cliente:{' '}
                                    <strong className="font-semibold">
                                      {selectedEntry.client}
                                    </strong>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    router.push(
                                      `/eventos/${
                                        selectedEntry.eventId || 'EV-2026-084'
                                      }`
                                    )
                                  }
                                  className="flex-1 h-9 rounded-lg bg-[#F2C94C] hover:bg-[#ebd578] text-slate-900 font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  Ver evento
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenDayView(selectedEntry.day)
                                  }
                                  className="h-9 px-3 rounded-lg border border-slate-200 hover:border-slate-900 text-slate-900 font-medium text-xs transition-colors cursor-pointer"
                                >
                                  Vista día
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
