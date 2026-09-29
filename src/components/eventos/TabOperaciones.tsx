'use client';

import React, { useState } from 'react';
import { AuditLogItem, EventDetailTab } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface TabTareasProps {
  onOpenCrearTarea: () => void;
}

export const TabTareasEvento: React.FC<TabTareasProps> = ({
  onOpenCrearTarea,
}) => {
  const { tasks, toggleTaskCompletion } = usePlanery();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewMode, setViewMode] = useState<'lista' | 'calendario'>('lista');
  const [calendarMonth, setCalendarMonth] = useState<'Oct' | 'Nov'>('Oct');
  const [selectedCalDay, setSelectedCalDay] = useState<number>(12);

  const filtered = tasks.filter((t) => {
    const matchSearch =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      !statusFilter || t.status.toLowerCase() === statusFilter.toLowerCase();
    const matchPriority =
      !priorityFilter ||
      t.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchSearch && matchStatus && matchPriority;
  });

  const parseTaskDate = (dueDateStr: string): { day: number; month: 'Oct' | 'Nov' } => {
    const lower = dueDateStr.toLowerCase();
    const numMatch = dueDateStr.match(/\d+/);
    const day = numMatch ? Math.min(31, Math.max(1, parseInt(numMatch[0], 10))) : 15;
    const month: 'Oct' | 'Nov' =
      lower.includes('nov') || lower.includes('/11') || lower.includes('-11')
        ? 'Nov'
        : 'Oct';
    return { day, month };
  };

  const getTasksForDay = (day: number, month: 'Oct' | 'Nov') => {
    return filtered.filter((t) => {
      const parsed = parseTaskDate(t.dueDate);
      return parsed.day === day && parsed.month === month;
    });
  };

  const calendarCells =
    calendarMonth === 'Oct'
      ? [
          { day: 28, isCurrentMonth: false, monthLabel: 'Sep' },
          { day: 29, isCurrentMonth: false, monthLabel: 'Sep' },
          { day: 30, isCurrentMonth: false, monthLabel: 'Sep' },
          ...Array.from({ length: 31 }, (_, i) => ({
            day: i + 1,
            isCurrentMonth: true,
            monthLabel: 'Oct',
          })),
          { day: 1, isCurrentMonth: false, monthLabel: 'Nov' },
        ]
      : [
          { day: 26, isCurrentMonth: false, monthLabel: 'Oct' },
          { day: 27, isCurrentMonth: false, monthLabel: 'Oct' },
          { day: 28, isCurrentMonth: false, monthLabel: 'Oct' },
          { day: 29, isCurrentMonth: false, monthLabel: 'Oct' },
          { day: 30, isCurrentMonth: false, monthLabel: 'Oct' },
          { day: 31, isCurrentMonth: false, monthLabel: 'Oct' },
          ...Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            isCurrentMonth: true,
            monthLabel: 'Nov',
          })),
          ...Array.from({ length: 6 }, (_, i) => ({
            day: i + 1,
            isCurrentMonth: false,
            monthLabel: 'Dic',
          })),
        ];

  const selectedDayTasks = getTasksForDay(selectedCalDay, calendarMonth);

  const overdueCount = tasks.filter((t) => t.isOverdue && !t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tareas</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Organiza y da seguimiento a las tareas necesarias para este evento.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCrearTarea}
          className="bg-[#F2C94C] hover:bg-[#e5bc3f] text-[#111827] font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            add_task
          </span>
          <span className="text-sm font-bold">+ Nueva tarea</span>
        </button>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 tabular-nums">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total
            </span>
            <span className="material-symbols-outlined text-[18px] text-gray-400">
              assignment
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {tasks.length + 13}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Planificadas en cronograma
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pendientes
            </span>
            <span className="material-symbols-outlined text-[18px] text-blue-500">
              schedule
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600">8</div>
          <div className="text-xs text-gray-500 mt-0.5">Por iniciar</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              En progreso
            </span>
            <span className="material-symbols-outlined text-[18px] text-amber-500">
              pending
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-600">5</div>
          <div className="text-xs text-gray-500 mt-0.5">En ejecución</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Completadas
            </span>
            <span className="material-symbols-outlined text-[18px] text-emerald-500">
              check_circle
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {tasks.filter((t) => t.completed).length + 4}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Verificadas</div>
        </div>

        <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-red-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">
              Atrasadas
            </span>
            <span className="material-symbols-outlined text-[18px] text-red-600">
              warning
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-700">
              {overdueCount}
            </span>
            <span className="bg-red-200 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
              Atención
            </span>
          </div>
          <div className="text-xs text-red-600 mt-0.5">
            Requieren atención inmediata
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <span className="material-symbols-outlined text-[18px]">
                search
              </span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tarea..."
              className="w-full bg-[#f9fafb] border border-gray-200 text-gray-900 text-sm rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-[#F2C94C]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#f9fafb] border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#F2C94C]"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#f9fafb] border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#F2C94C]"
          >
            <option value="">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Vista Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-end sm:self-center border border-gray-200">
          <button
            type="button"
            onClick={() => setViewMode('lista')}
            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'lista'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              format_list_bulleted
            </span>
            <span>Lista</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendario')}
            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'calendario'
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              calendar_month
            </span>
            <span>Calendario</span>
          </button>
        </div>
      </div>

      {viewMode === 'lista' ? (
        /* Tabla de Tareas */
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#F2C94C] focus:ring-[#F2C94C]"
                    />
                  </th>
                  <th className="py-3 px-4 min-w-[240px]">Tarea</th>
                  <th className="hidden md:table-cell py-3 px-4">Relación</th>
                  <th className="hidden md:table-cell py-3 px-4 min-w-[170px]">
                    Responsable
                  </th>
                  <th className="py-3 px-4 min-w-[130px]">Fecha límite</th>
                  <th className="hidden md:table-cell py-3 px-4">Prioridad</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filtered.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`hover:bg-[#F9FAFB] transition-colors group cursor-pointer ${
                      task.isOverdue && !task.completed
                        ? 'bg-red-50/20'
                        : task.completed
                        ? 'opacity-85'
                        : ''
                    }`}
                  >
                    <td
                      className="py-3 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="rounded border-gray-300 text-[#F2C94C] focus:ring-[#F2C94C] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className={`font-semibold transition-colors ${
                          task.completed
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900 group-hover:text-amber-800'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-sm">
                        {task.description}
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${task.relationColor}`}
                      >
                        {task.relation}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${task.assigneeColor}`}
                        >
                          {task.assigneeInitials}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 leading-tight">
                            {task.assigneeName}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {task.assigneeRole}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {task.isOverdue && !task.completed ? (
                        <>
                          <div className="text-red-700 font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">
                              error
                            </span>
                            {task.dueDate}
                          </div>
                          <span className="inline-block mt-0.5 bg-red-100 text-red-700 text-[10px] font-bold px-1.5 rounded">
                            Atrasada
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="text-gray-900 font-medium">
                            {task.dueDate}
                          </div>
                          <div
                            className={`text-xs ${
                              task.completed
                                ? 'text-emerald-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {task.relativeDue}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="hidden md:table-cell py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          task.priority === 'Alta'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'Media'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          task.status === 'Completada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : task.status === 'En progreso'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            task.status === 'Completada'
                              ? 'bg-emerald-600'
                              : task.status === 'En progreso'
                              ? 'bg-amber-600'
                              : 'bg-blue-600'
                          }`}
                        />
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="py-3 px-4 bg-[#F9FAFB] border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
            <span>
              Mostrando <strong className="text-gray-800">{filtered.length}</strong>{' '}
              de <strong className="text-gray-800">18</strong> tareas registradas
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="px-2.5 py-1 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-white border border-gray-300 font-semibold text-gray-800 rounded-lg shadow-xs"
              >
                1
              </button>
              <button
                type="button"
                className="px-3 py-1 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                2
              </button>
              <button
                type="button"
                className="px-2.5 py-1 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Vista Calendario de Tareas del Evento */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Columna Principal: Grilla Mensual */}
          <div className="xl:col-span-8 bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            {/* Cabecera del Calendario */}
            <div className="p-4 border-b border-gray-200 bg-[#F9FAFB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMonth('Oct');
                      setSelectedCalDay(12);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      calendarMonth === 'Oct'
                        ? 'bg-[#1E222D] text-[#F2C94C]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Octubre 2026
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMonth('Nov');
                      setSelectedCalDay(2);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      calendarMonth === 'Nov'
                        ? 'bg-[#1E222D] text-[#F2C94C]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Noviembre 2026
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCalendarMonth('Nov');
                    setSelectedCalDay(14);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    celebration
                  </span>
                  <span>Día del Evento (14 Nov)</span>
                </button>
              </div>

              {/* Leyenda de Estados */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Atrasada
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  En progreso
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Pendiente
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Completada
                </span>
              </div>
            </div>

            {/* Grilla con scroll horizontal en móvil */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[660px]">
                {/* Días de la semana */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/80">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(
                    (dayName) => (
                      <div
                        key={dayName}
                        className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500"
                      >
                        {dayName}
                      </div>
                    )
                  )}
                </div>

                {/* Celdas del mes */}
                <div className="grid grid-cols-7 divide-x divide-y divide-gray-200">
                  {calendarCells.map((cell, idx) => {
                    const dayTasks = cell.isCurrentMonth
                      ? getTasksForDay(cell.day, calendarMonth)
                      : [];
                    const isSelected =
                      cell.isCurrentMonth && selectedCalDay === cell.day;
                    const isMainEventDay =
                      cell.isCurrentMonth &&
                      calendarMonth === 'Nov' &&
                      cell.day === 14;
                    const isTodayOct =
                      cell.isCurrentMonth &&
                      calendarMonth === 'Oct' &&
                      cell.day === 18;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (cell.isCurrentMonth) {
                            setSelectedCalDay(cell.day);
                          }
                        }}
                        className={`min-h-[112px] p-2 transition-colors flex flex-col justify-between cursor-pointer ${
                          !cell.isCurrentMonth
                            ? 'bg-gray-50/60 text-gray-300 cursor-default'
                            : isSelected
                            ? 'bg-[#FEF9E7]/60 ring-2 ring-inset ring-[#F2C94C]'
                            : isMainEventDay
                            ? 'bg-amber-50/40 hover:bg-amber-50/70'
                            : 'bg-white hover:bg-gray-50/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                              !cell.isCurrentMonth
                                ? 'text-gray-300'
                                : isSelected
                                ? 'bg-[#1E222D] text-[#F2C94C]'
                                : isTodayOct
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {cell.day}
                          </span>

                          {isTodayOct && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                              Hoy
                            </span>
                          )}
                          {isMainEventDay && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#F2C94C] text-[#241A00]">
                              Evento
                            </span>
                          )}
                          {dayTasks.length > 0 && !isTodayOct && !isMainEventDay && (
                            <span className="text-[10px] font-bold text-gray-400">
                              {dayTasks.length}{' '}
                              {dayTasks.length === 1 ? 'tarea' : 'tareas'}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 flex-1">
                          {isMainEventDay && (
                            <div className="p-1.5 rounded-lg bg-[#1E222D] text-[#F2C94C] text-[10px] font-bold leading-tight flex items-center gap-1 shadow-2xs">
                              <span className="material-symbols-outlined text-[13px]">
                                celebration
                              </span>
                              <span className="truncate">
                                Boda de María y Carlos
                              </span>
                            </div>
                          )}

                          {dayTasks.map((task) => {
                            const badgeStyle = task.completed
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 line-through opacity-80'
                              : task.isOverdue
                              ? 'bg-red-50 border-red-200 text-red-800'
                              : task.status === 'En progreso'
                              ? 'bg-amber-50 border-amber-200 text-amber-900'
                              : 'bg-blue-50 border-blue-200 text-blue-800';

                            return (
                              <div
                                key={task.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCalDay(cell.day);
                                }}
                                className={`p-1.5 rounded-lg border text-[11px] leading-tight transition-all hover:shadow-xs ${badgeStyle}`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold truncate">
                                    {task.title}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() =>
                                      toggleTaskCompletion(task.id)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    className="rounded border-gray-300 text-[#F2C94C] focus:ring-[#F2C94C] w-3 h-3 shrink-0 cursor-pointer"
                                  />
                                </div>
                                <div className="flex items-center justify-between mt-1 text-[10px] opacity-80">
                                  <span>{task.dueTime || '10:00'}</span>
                                  <span className="font-semibold">
                                    {task.assigneeInitials}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Lateral: Detalle del Día Seleccionado y Tareas del Mes */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Agenda del día seleccionado
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-0.5">
                    {selectedCalDay} de{' '}
                    {calendarMonth === 'Oct' ? 'Octubre' : 'Noviembre'} 2026
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onOpenCrearTarea}
                  className="px-3 py-1.5 rounded-lg bg-[#F2C94C] hover:bg-[#e5bc3f] text-[#111827] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                  <span>Asignar</span>
                </button>
              </div>

              {selectedDayTasks.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : task.isOverdue
                          ? 'bg-red-50/40 border-red-200'
                          : 'bg-gray-50/70 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                            className="mt-0.5 rounded border-gray-300 text-[#F2C94C] focus:ring-[#F2C94C] cursor-pointer"
                          />
                          <div>
                            <h4
                              className={`text-sm font-bold ${
                                task.completed
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-900'
                              }`}
                            >
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            task.priority === 'Alta'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'Media'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-gray-200/70 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${task.assigneeColor}`}
                          >
                            {task.assigneeInitials}
                          </span>
                          <span className="font-medium text-gray-700">
                            {task.assigneeName}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-gray-500 font-mono">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {task.dueTime || '10:00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-[20px]">
                      event_available
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    No hay tareas con vencimiento el {selectedCalDay} de{' '}
                    {calendarMonth === 'Oct' ? 'Octubre' : 'Noviembre'}.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Selecciona otro día con tareas resaltadas o crea una nueva
                    tarea operativa.
                  </p>
                </div>
              )}

              {/* Lista rápida de días con vencimientos para saltar directo */}
              <div className="pt-3 border-t border-gray-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
                  Fechas con tareas programadas ({filtered.length})
                </span>
                <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
                  {filtered.map((t) => {
                    const parsed = parseTaskDate(t.dueDate);
                    const isCurrentSelected =
                      parsed.day === selectedCalDay &&
                      parsed.month === calendarMonth;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setCalendarMonth(parsed.month);
                          setSelectedCalDay(parsed.day);
                        }}
                        className={`w-full p-2 rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isCurrentSelected
                            ? 'bg-[#FEF9E7] border-[#F2C94C] text-gray-900'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">
                            {t.title}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {t.assigneeName} · {t.relation}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            t.completed
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.isOverdue
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {t.dueDate}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export interface TabActividadProps {
  onSelectTab: (tab: EventDetailTab) => void;
}

export const TabActividadEvento: React.FC<TabActividadProps> = ({
  onSelectTab,
}) => {
  const { auditLogs, showToast } = usePlanery();
  const [categoryFilter, setCategoryFilter] = useState('Todas las actividades');
  const [userFilter, setUserFilter] = useState('Todos los usuarios');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem>(
    auditLogs[2] || auditLogs[0]
  );

  const filtered = auditLogs.filter((log) => {
    const matchCat =
      categoryFilter === 'Todas las actividades' ||
      log.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchUser =
      userFilter === 'Todos los usuarios' ||
      userFilter.toLowerCase().includes(log.user.toLowerCase());
    const matchText =
      !searchQuery.trim() ||
      log.summaryHtml.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchUser && matchText;
  });

  const groups = Array.from(new Set(filtered.map((l) => l.dateGroup)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#745b00] text-[22px]">
              history
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Actividad y Auditoría
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Consulta el historial cronológico de cambios, aprobaciones y
            acciones realizadas en este evento.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() =>
              showToast('Exportando log completo de auditoría firmada...')
            }
            className="px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-900 bg-white text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">
              download
            </span>
            <span>Exportar log</span>
          </button>
        </div>
      </div>

      {/* Barra de filtros de auditoría */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
              Tipo de actividad
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#f0f3ff] border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Todas las actividades</option>
              <option value="Evento">Evento y Estado</option>
              <option value="Proveedores">Proveedores</option>
              <option value="Presupuesto">Presupuesto</option>
              <option value="Pagos">Pagos y Cobros</option>
              <option value="Documentos">Documentos</option>
              <option value="Tareas">Tareas</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
              Usuario responsable
            </label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#f0f3ff] border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option>Todos los usuarios</option>
              <option>Carlos Mendoza (Admin)</option>
              <option>Jerson Huayta (Planner)</option>
              <option>María López (Cliente)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
              Rango temporal
            </label>
            <select className="w-full px-3 py-1.5 bg-[#f0f3ff] border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#F2C94C]">
              <option>Últimos 30 días</option>
              <option>Últimos 7 días</option>
              <option>Todo el historial</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
              Buscar en historial
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Palabras clave..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#f0f3ff] border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F2C94C]" />
            <span>
              Mostrando{' '}
              <strong className="text-slate-900">
                {filtered.length} eventos registrados
              </strong>{' '}
              en la auditoría
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('Todas las actividades');
              setUserFilter('Todos los usuarios');
              setSearchQuery('');
            }}
            className="text-[#745b00] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">
              refresh
            </span>
            <span>Restablecer filtros</span>
          </button>
        </div>
      </div>

      {/* Layout de 2 Columnas: Timeline (7 cols) + Panel de Detalle Auditado (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Timeline Cronológico */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-0.5 rounded-full bg-[#e2e8f8] text-slate-900 text-[11px] font-bold border border-slate-300">
                  {group}
                </span>
                <div className="h-[1px] flex-1 bg-slate-200" />
              </div>

              <div className="relative pl-8 flex flex-col gap-4">
                <div className="absolute left-3.5 top-3 bottom-3 w-[2px] bg-slate-200" />

                {filtered
                  .filter((l) => l.dateGroup === group)
                  .map((item) => {
                    const isSelected = selectedLog?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedLog(item)}
                        className={`relative bg-white rounded-xl p-4 shadow-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-2 border-[#F2C94C] ring-2 ring-[#F2C94C]/20'
                            : 'border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`absolute -left-[37px] top-4 w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-xs ring-4 ring-[#F9FAFB] ${
                            isSelected
                              ? 'bg-[#F2C94C] border-[#F2C94C] text-[#241a00]'
                              : 'bg-[#f0f3ff] border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {item.icon}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            {isSelected && (
                              <span className="self-start px-2 py-0.5 rounded bg-[#F2C94C]/25 text-[#6b5400] text-[10px] font-bold">
                                Seleccionado en visor
                              </span>
                            )}
                            <p
                              className="text-sm text-slate-900 leading-snug"
                              dangerouslySetInnerHTML={{
                                __html: item.summaryHtml,
                              }}
                            />
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-[#e7eefe] font-medium text-[10px] text-slate-700">
                                {item.category}
                              </span>
                              <span>·</span>
                              <span>{item.relativeTime}</span>
                              {item.metaTag && (
                                <>
                                  <span>·</span>
                                  <span className="font-medium text-slate-700">
                                    {item.metaTag}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#F2C94C]/20 text-[#6b5400]'
                                : 'border border-slate-200 text-slate-600'
                            }`}
                          >
                            {isSelected ? 'Viendo detalle →' : 'Inspeccionar'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Columna Derecha: Panel de Detalle de Auditoría */}
        {selectedLog && (
          <div className="lg:col-span-5 flex flex-col gap-4 sticky top-20">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#745b00] text-[20px]">
                    fact_check
                  </span>
                  <h3 className="text-lg text-slate-900 font-bold">
                    Detalle de actividad
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  ID:{' '}
                  <code className="font-mono font-semibold text-slate-900">
                    {selectedLog.logCode}
                  </code>
                </span>
              </div>

              <div>
                <span className="px-2.5 py-1 rounded-full bg-[#F2C94C]/20 text-[#6b5400] text-xs font-bold border border-[#F2C94C]/60">
                  {selectedLog.actionTitle}
                </span>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm pt-2 border-t border-slate-100">
                <div>
                  <dt className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Usuario
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#e7eefe] text-slate-900 text-[9px] font-bold flex items-center justify-center">
                      {selectedLog.userInitials}
                    </div>
                    <span>{selectedLog.user}</span>
                  </dd>
                  <span className="text-[11px] text-slate-500">
                    {selectedLog.userRole}
                  </span>
                </div>

                <div>
                  <dt className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Fecha y Hora
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 text-xs">
                    {selectedLog.timestamp}
                  </dd>
                  <span className="text-[11px] text-slate-500">
                    {selectedLog.relativeTime}
                  </span>
                </div>

                <div className="sm:col-span-2 pt-1">
                  <dt className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Módulo / Origen
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-slate-900 bg-[#f0f3ff] px-3 py-1.5 rounded border border-slate-200 flex items-center justify-between">
                    <span>{selectedLog.moduleOrigin}</span>
                    <span className="text-slate-500 text-[11px]">
                      IP: {selectedLog.ipAddress}
                    </span>
                  </dd>
                </div>
              </dl>

              {/* Comparativa de cambio */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider">
                  Desglose del cambio
                </span>
                <div className="bg-[#f0f3ff]/60 border border-slate-200 rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
                    <span>Elemento auditado:</span>
                    <strong className="text-slate-900 font-semibold">
                      {selectedLog.budgetItemName}
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center py-1 tabular-nums">
                    <div className="flex flex-col gap-0.5 p-2.5 rounded bg-white border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-500 font-semibold">
                        Valor anterior
                      </span>
                      <span className="text-sm font-bold text-slate-500 line-through">
                        {selectedLog.previousValue}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 p-2.5 rounded bg-white border border-[#F2C94C] shadow-xs">
                      <span className="text-[10px] uppercase text-[#6b5400] font-semibold flex items-center justify-between">
                        <span>Nuevo valor</span>
                        <span className="text-[#745b00] font-bold">
                          {selectedLog.percentageDelta}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedLog.newValue}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="text-slate-500">Variación neta:</span>
                    <span className="font-semibold text-[#745b00] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        trending_up
                      </span>
                      {selectedLog.netVariation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Justificación */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider">
                  Justificación del cambio
                </span>
                <p className="text-xs text-slate-800 bg-[#f0f3ff] p-3 rounded-lg border border-slate-200 leading-relaxed">
                  "{selectedLog.justification}"
                </p>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedLog.targetTab) {
                      onSelectTab(selectedLog.targetTab);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-[#F2C94C] hover:bg-[#ffe08b] text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Ir a {selectedLog.category}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
